<?php

namespace Tests\Feature;

use App\Models\Achievement;
use App\Models\PlayerProgress;
use App\Models\User;
use App\Models\UserAchievement;
use App\Services\AchievementService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PlayerPortalApiTest extends TestCase
{
    protected User $player;

    protected function setUp(): void
    {
        parent::setUp();

        $this->player = User::firstOrCreate(
            ['email' => 'portal_tester@aervyn.local'],
            [
                'name' => 'PortalTester',
                'display_name' => 'Chrono Explorer',
                'password' => bcrypt('Password123!'),
                'role' => 'player',
                'level' => 3,
                'xp' => 750,
                'is_active' => true,
                'is_banned' => false,
            ]
        );

        // Ensure basic world 1 progress
        PlayerProgress::firstOrCreate(
            ['user_id' => $this->player->id, 'world_id' => 'world_1'],
            [
                'current_mission' => 'Awakening the Keystone',
                'current_step' => 2,
                'completed_objectives' => ['awaken_keystone'],
                'inventory' => [['id' => 'energy_fragment_1', 'name' => 'Energy Fragment']],
                'is_completed' => false,
                'playtime_seconds' => 1200,
            ]
        );
    }

    public function test_unauthenticated_request_to_player_api_is_blocked(): void
    {
        $response = $this->getJson('/api/player/dashboard');
        $response->assertStatus(401);
    }

    public function test_player_can_fetch_dashboard_telemetry(): void
    {
        $response = $this->actingAs($this->player)->getJson('/api/player/dashboard');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'status',
                'data' => [
                    'user' => [
                        'id',
                        'username',
                        'display_name',
                        'email',
                        'avatar',
                        'level',
                        'xp',
                        'rank_title',
                        'level_progress_percent',
                        'next_level_xp',
                    ],
                    'campaign' => [
                        'current_world_id',
                        'current_world_title',
                        'completed_worlds_count',
                        'total_worlds',
                        'campaign_percent',
                    ],
                    'playtime' => [
                        'total_seconds',
                        'formatted',
                    ],
                    'achievements' => [
                        'unlocked_count',
                        'total_count',
                        'percent',
                        'recent',
                    ],
                    'worlds',
                ]
            ]);
    }

    public function test_player_can_fetch_profile(): void
    {
        $response = $this->actingAs($this->player)->getJson('/api/player/profile');

        $response->assertStatus(200)
            ->assertJsonFragment([
                'username' => 'PortalTester',
                'account_status' => 'Active',
            ])
            ->assertJsonStructure([
                'status',
                'data' => [
                    'username',
                    'display_name',
                    'email',
                    'avatar',
                    'title',
                    'level',
                    'xp',
                    'avatar_presets',
                ]
            ]);
    }

    public function test_player_can_update_profile_display_name_and_avatar(): void
    {
        $response = $this->actingAs($this->player)->putJson('/api/player/profile', [
            'display_name' => 'Master Chronos',
            'avatar' => 'avatar_quantum_pilot',
            'bio' => 'Traveling through timelines.',
        ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('users', [
            'id' => $this->player->id,
            'display_name' => 'Master Chronos',
            'avatar' => 'avatar_quantum_pilot',
        ]);
    }

    public function test_player_cannot_tamper_with_level_or_xp(): void
    {
        $originalXp = $this->player->xp;

        $response = $this->actingAs($this->player)->putJson('/api/player/profile', [
            'display_name' => 'Hacker Name',
            'avatar' => 'avatar_default',
            'level' => 999,
            'xp' => 999999,
            'role' => 'super_admin',
        ]);

        $response->assertStatus(200);

        $this->player->refresh();
        $this->assertEquals($originalXp, $this->player->xp);
        $this->assertEquals('player', $this->player->role);
    }

    public function test_player_can_fetch_statistics(): void
    {
        $response = $this->actingAs($this->player)->getJson('/api/player/statistics');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'status',
                'data' => [
                    'playtime' => ['total_seconds', 'formatted'],
                    'sessions_count',
                    'worlds_completed',
                    'missions_completed',
                    'collectibles_discovered',
                    'puzzles_completed',
                    'boss_victories',
                    'total_xp_earned',
                    'campaign_completion_percentage',
                    'ending_selected',
                    'world_breakdowns',
                ]
            ]);
    }

    public function test_player_can_fetch_achievements(): void
    {
        $response = $this->actingAs($this->player)->getJson('/api/player/achievements');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'status',
                'data' => [
                    'total_count',
                    'unlocked_count',
                    'completion_percent',
                    'categories',
                    'achievements' => [
                        '*' => [
                            'id',
                            'title',
                            'description',
                            'category',
                            'icon',
                            'xp_reward',
                            'is_unlocked',
                        ]
                    ]
                ]
            ]);
    }

    public function test_achievement_system_awards_xp_and_prevents_duplicate_claims(): void
    {
        // 1. First trigger
        $initialXp = $this->player->xp;
        $unlocked = AchievementService::syncForUser($this->player);

        $this->assertIsArray($unlocked);
        $this->player->refresh();

        // 2. Second trigger should not award XP again for already unlocked achievements
        $secondRunXp = $this->player->xp;
        $unlockedAgain = AchievementService::syncForUser($this->player);

        $this->assertEmpty($unlockedAgain);
        $this->player->refresh();
        $this->assertEquals($secondRunXp, $this->player->xp);
    }

    public function test_player_can_fetch_leaderboard(): void
    {
        $response = $this->actingAs($this->player)->getJson('/api/player/leaderboard');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'status',
                'filter',
                'total_players',
                'current_user_rank',
                'leaderboard' => [
                    '*' => [
                        'user_id',
                        'username',
                        'display_name',
                        'avatar',
                        'level',
                        'xp',
                        'rank_title',
                        'completed_worlds',
                        'achievements_count',
                        'rank',
                    ]
                ]
            ]);
    }
}
