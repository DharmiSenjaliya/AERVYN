<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\PlayerProgress;
use Illuminate\Foundation\Testing\RefreshDatabase;

class GameApiTest extends TestCase
{
    public function test_player_can_register()
    {
        $uniqueEmail = 'explorer_' . uniqid() . '@aervyn.local';

        $response = $this->postJson('/api/auth/register', [
            'name' => 'TimelineRunner',
            'email' => $uniqueEmail,
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $response->assertStatus(201)
            ->assertJsonStructure(['status', 'token', 'user']);
    }

    public function test_player_can_login()
    {
        $response = $this->postJson('/api/auth/login', [
            'email' => 'player@aervyn.local',
            'password' => 'password123',
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure(['status', 'token', 'user']);
    }

    public function test_authenticated_player_can_get_game_state()
    {
        $user = User::where('email', 'player@aervyn.local')->first();

        $response = $this->actingAs($user, 'sanctum')
            ->getJson('/api/game/state?world=world_1');

        $response->assertStatus(200)
            ->assertJsonStructure(['status', 'progress', 'session_id']);
    }

    public function test_authenticated_player_can_save_progress()
    {
        $user = User::where('email', 'player@aervyn.local')->first();

        $response = $this->actingAs($user, 'sanctum')
            ->postJson('/api/game/save', [
                'world_id' => 'world_1',
                'current_step' => 3,
                'inventory' => ['fragment_1', 'fragment_2'],
                'checkpoint_id' => 'courtyard_pillar_west',
                'checkpoint_position' => ['x' => -6, 'y' => 1, 'z' => -2],
                'playtime_increment' => 60,
            ]);

        $response->assertStatus(200)
            ->assertJsonPath('status', 'success');
    }

    public function test_authenticated_player_can_get_world_3_state()
    {
        $user = User::where('email', 'player@aervyn.local')->first();

        $response = $this->actingAs($user, 'sanctum')
            ->getJson('/api/game/state?world=world_3');

        $response->assertStatus(200)
            ->assertJsonPath('status', 'success')
            ->assertJsonPath('progress.world_id', 'world_3')
            ->assertJsonPath('progress.current_mission', 'Arrival at the End of Time');
    }

    public function test_authenticated_player_can_complete_world_3()
    {
        $user = User::where('email', 'player@aervyn.local')->first();

        // Advance to step 6 (boss battle phase)
        $this->actingAs($user, 'sanctum')
            ->postJson('/api/game/save', [
                'world_id' => 'world_3',
                'current_step' => 6,
                'inventory' => ['shard_genesis', 'shard_flux', 'shard_singularity'],
            ]);

        // Complete World 3 after defeating Chronarch
        $response = $this->actingAs($user, 'sanctum')
            ->postJson('/api/game/complete-world', [
                'world_id' => 'world_3',
            ]);

        $response->assertStatus(200)
            ->assertJsonPath('status', 'success')
            ->assertJsonPath('xp_awarded', 1000)
            ->assertJsonPath('progress.is_completed', true);
    }

    public function test_authenticated_player_can_complete_final_chapter()
    {
        $user = User::where('email', 'player@aervyn.local')->first();

        // Save progress at final decision
        $this->actingAs($user, 'sanctum')
            ->postJson('/api/game/save', [
                'world_id' => 'world_final',
                'current_step' => 3,
                'ending_selected' => 'ending_a',
                'story_journal' => ['lore_origin', 'lore_chronarch_fall', 'lore_primordial_core'],
            ]);

        // Complete Final Chapter with Ending A
        $response = $this->actingAs($user, 'sanctum')
            ->postJson('/api/game/complete-world', [
                'world_id' => 'world_final',
                'ending_selected' => 'ending_a',
            ]);

        $response->assertStatus(200)
            ->assertJsonPath('status', 'success')
            ->assertJsonPath('xp_awarded', 1500)
            ->assertJsonPath('progress.is_completed', true)
            ->assertJsonPath('progress.campaign_completed', true)
            ->assertJsonPath('progress.ending_selected', 'ending_a');
    }

    public function test_authenticated_player_can_get_campaign_summary()
    {
        $user = User::where('email', 'player@aervyn.local')->first();

        $response = $this->actingAs($user, 'sanctum')
            ->getJson('/api/game/campaign-summary');

        $response->assertStatus(200)
            ->assertJsonPath('status', 'success')
            ->assertJsonStructure([
                'status',
                'summary' => [
                    'user',
                    'worlds_completed',
                    'total_worlds',
                    'total_playtime_seconds',
                    'total_playtime_formatted',
                    'ending_selected',
                    'campaign_completed',
                    'completion_percentage',
                    'story_journal_count',
                    'story_journal',
                ]
            ]);
    }
}
