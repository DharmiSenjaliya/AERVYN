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
}
