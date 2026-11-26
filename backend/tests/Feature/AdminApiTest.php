<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\World;
use App\Models\Mission;
use App\Models\Collectible;
use App\Models\Feedback;
use App\Models\AdminActivityLog;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminApiTest extends TestCase
{
    protected User $admin;
    protected User $player;

    protected function setUp(): void
    {
        parent::setUp();

        $this->admin = User::firstOrCreate(
            ['email' => 'test_admin@aervyn.local'],
            [
                'name' => 'Test Admin Director',
                'password' => bcrypt('password123'),
                'role' => 'admin',
                'level' => 99,
                'xp' => 50000,
                'is_active' => true,
            ]
        );

        $this->player = User::firstOrCreate(
            ['email' => 'test_player_one@aervyn.local'],
            [
                'name' => 'Test Explorer',
                'password' => bcrypt('password123'),
                'role' => 'player',
                'level' => 5,
                'xp' => 2400,
                'is_active' => true,
            ]
        );
    }

    public function test_unauthenticated_request_to_admin_is_blocked(): void
    {
        $response = $this->getJson('/api/admin/dashboard-stats');
        $response->assertStatus(401);
    }

    public function test_ordinary_player_cannot_access_admin_api(): void
    {
        $response = $this->actingAs($this->player)->getJson('/api/admin/dashboard-stats');
        $response->assertStatus(403);
        $response->assertJson(['success' => false]);
    }

    public function test_admin_can_access_dashboard_stats(): void
    {
        $response = $this->actingAs($this->admin)->getJson('/api/admin/dashboard-stats');
        $response->assertStatus(200);
        $response->assertJsonStructure([
            'success',
            'metrics' => [
                'total_registered_players',
                'active_players',
                'new_players_today',
                'new_players_this_week',
                'total_game_sessions',
                'completed_campaigns',
                'total_worlds_completed',
                'total_missions_completed',
                'average_completion_rate',
                'total_feedback',
                'reported_issues',
            ],
            'world_stats',
            'endings',
            'recent_players',
            'recent_sessions',
        ]);
    }

    public function test_admin_can_paginate_and_search_players(): void
    {
        $response = $this->actingAs($this->admin)->getJson('/api/admin/players?search=Explorer');
        $response->assertStatus(200);
        $response->assertJsonStructure([
            'success',
            'players' => ['data', 'total', 'per_page', 'current_page'],
        ]);
    }

    public function test_admin_can_suspend_and_reactivate_player(): void
    {
        // 1. Suspend
        $suspendResponse = $this->actingAs($this->admin)->postJson("/api/admin/players/{$this->player->id}/status", [
            'action' => 'suspend',
            'reason' => 'Suspected anomaly speed manipulation',
        ]);
        $suspendResponse->assertStatus(200);
        $this->assertDatabaseHas('users', [
            'id' => $this->player->id,
            'is_active' => false,
            'is_banned' => true,
        ]);
        $this->assertDatabaseHas('admin_activity_logs', [
            'action' => 'player_suspend',
            'entity_id' => (string) $this->player->id,
        ]);

        // 2. Reactivate
        $reactivateResponse = $this->actingAs($this->admin)->postJson("/api/admin/players/{$this->player->id}/status", [
            'action' => 'reactivate',
            'reason' => 'Appeal verified; account cleared',
        ]);
        $reactivateResponse->assertStatus(200);
        $this->assertDatabaseHas('users', [
            'id' => $this->player->id,
            'is_active' => true,
            'is_banned' => false,
        ]);
    }

    public function test_admin_can_update_world_details(): void
    {
        $world = World::firstOrCreate(
            ['id' => 'world_1'],
            [
                'title' => 'World 1: The Lost Kingdom',
                'epoch' => 'Past Era',
                'description' => 'Test kingdom description',
                'display_order' => 1,
                'is_active' => true,
                'required_level' => 1,
            ]
        );

        $response = $this->actingAs($this->admin)->putJson("/api/admin/worlds/{$world->id}", [
            'title' => 'World 1: The Lost Kingdom (Enhanced)',
            'epoch' => 'Past Era (-840)',
            'description' => 'Updated majestic ancient castle description.',
            'display_order' => 1,
            'is_active' => true,
            'required_level' => 1,
        ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('worlds', [
            'id' => 'world_1',
            'title' => 'World 1: The Lost Kingdom (Enhanced)',
        ]);
    }

    public function test_admin_can_update_mission(): void
    {
        $mission = Mission::firstOrCreate(
            ['id' => 'test_m1'],
            [
                'world_id' => 'world_1',
                'title' => 'Initial Mission',
                'description' => 'Initial desc',
                'step_number' => 1,
                'xp_reward' => 100,
                'is_active' => true,
            ]
        );

        $response = $this->actingAs($this->admin)->putJson("/api/admin/missions/{$mission->id}", [
            'title' => 'Updated Mission Title',
            'description' => 'Updated step description with full detail.',
            'objectives' => ['Objective 1', 'Objective 2'],
            'xp_reward' => 250,
            'is_active' => true,
        ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('missions', [
            'id' => 'test_m1',
            'title' => 'Updated Mission Title',
            'xp_reward' => 250,
        ]);
    }

    public function test_admin_can_fetch_analytics_telemetry(): void
    {
        $response = $this->actingAs($this->admin)->getJson('/api/admin/analytics?range=30d');
        $response->assertStatus(200);
        $response->assertJsonStructure([
            'success',
            'has_sufficient_data',
            'summary' => [
                'total_players',
                'wau',
                'mau',
                'total_sessions',
                'avg_session_duration_mins',
                'campaign_completion_rate',
            ],
            'world_popularity',
            'endings',
        ]);
    }

    public function test_admin_can_update_feedback_ticket(): void
    {
        $feedback = Feedback::create([
            'player_name' => 'SpeedTester',
            'player_email' => 'speed@aervyn.local',
            'category' => 'bug',
            'subject' => 'Collision issue at bridge gate',
            'message' => 'Hit invisible wall during sprint.',
            'status' => 'new',
        ]);

        $response = $this->actingAs($this->admin)->putJson("/api/admin/feedback/{$feedback->id}", [
            'status' => 'resolved',
            'admin_notes' => 'Fixed box boundary collider in PhaseBridgeTerminal.jsx',
        ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('feedback', [
            'id' => $feedback->id,
            'status' => 'resolved',
            'admin_notes' => 'Fixed box boundary collider in PhaseBridgeTerminal.jsx',
        ]);
        $this->assertNotNull(Feedback::find($feedback->id)->resolved_at);
    }

    public function test_admin_can_toggle_maintenance_mode(): void
    {
        $response = $this->actingAs($this->admin)->postJson('/api/admin/settings/maintenance', [
            'enabled' => true,
            'reason' => 'Scheduled temporal core database optimization',
        ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('game_settings', [
            'key' => 'maintenance_mode',
            'value' => 'true',
        ]);
    }

    public function test_admin_can_list_media_assets(): void
    {
        $response = $this->actingAs($this->admin)->getJson('/api/admin/media');
        $response->assertStatus(200)
            ->assertJsonStructure([
                'status',
                'total',
                'data' => [
                    '*' => [
                        'id',
                        'filename',
                        'title',
                        'category',
                        'url',
                        'mime_type',
                        'size_bytes',
                        'size_formatted',
                        'created_at',
                        'is_system',
                    ],
                ],
            ]);
    }

    public function test_admin_can_upload_media_asset(): void
    {
        $file = \Illuminate\Http\UploadedFile::fake()->create('test_world_cover.png', 50, 'image/png');

        $response = $this->actingAs($this->admin)->postJson('/api/admin/media/upload', [
            'file' => $file,
            'category' => 'thumbnail',
            'title' => 'Test World Cover',
        ]);

        $response->assertStatus(201)
            ->assertJsonFragment([
                'status' => 'success',
                'category' => 'thumbnail',
                'title' => 'Test World Cover',
            ]);
    }
}
