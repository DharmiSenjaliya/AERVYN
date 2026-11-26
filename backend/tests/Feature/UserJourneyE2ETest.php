<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\PlayerProgress;
use App\Models\GameSession;

class UserJourneyE2ETest extends TestCase
{
    /**
     * Complete User Journey: Registration -> Login -> Dashboard -> World 1 -> World 2 -> World 3 -> Final Chapter -> Ending A
     */
    public function test_complete_player_journey_ending_a()
    {
        $unique = uniqid();
        $email = "hero_{$unique}@aervyn.local";

        // 1. REGISTRATION
        $regResponse = $this->postJson('/api/auth/register', [
            'name' => 'AervynHero_' . $unique,
            'email' => $email,
            'password' => 'TemporalKey#2026',
            'password_confirmation' => 'TemporalKey#2026',
        ]);
        $regResponse->assertStatus(201);
        $token = $regResponse->json('token');
        $this->assertNotEmpty($token);

        // 2. LOGIN
        $loginResponse = $this->postJson('/api/auth/login', [
            'email' => $email,
            'password' => 'TemporalKey#2026',
        ]);
        $loginResponse->assertStatus(200);
        $user = User::where('email', $email)->first();
        $this->assertNotNull($user);

        // 3. PLAYER DASHBOARD
        $dashResponse = $this->actingAs($user, 'sanctum')->getJson('/api/player/dashboard');
        $dashResponse->assertStatus(200)
            ->assertJsonPath('status', 'success');

        // 4. NEW GAME -> WORLD 1: THE LOST KINGDOM
        $w1State = $this->actingAs($user, 'sanctum')->getJson('/api/game/state?world=world_1');
        $w1State->assertStatus(200)
            ->assertJsonPath('progress.world_id', 'world_1')
            ->assertJsonPath('progress.current_step', 1);

        // Save progress: collect energy fragments & checkpoint
        $w1Save = $this->actingAs($user, 'sanctum')->postJson('/api/game/save', [
            'world_id' => 'world_1',
            'current_step' => 5,
            'inventory' => [
                ['id' => 'fragment_1', 'name' => 'Solar Fragment', 'collected_at' => now()->toIso8601String()],
                ['id' => 'fragment_2', 'name' => 'Lunar Fragment', 'collected_at' => now()->toIso8601String()],
                ['id' => 'fragment_3', 'name' => 'Astral Fragment', 'collected_at' => now()->toIso8601String()],
            ],
            'completed_objectives' => ['collect_fragment_1', 'collect_fragment_2', 'collect_fragment_3'],
            'checkpoint_id' => 'sanctuary_gateway',
            'checkpoint_position' => ['x' => 12, 'y' => 1.5, 'z' => -10],
            'playtime_increment' => 180,
        ]);
        $w1Save->assertStatus(200);

        // Advance to step 9 (puzzle solved, ancient door unlocked)
        $this->actingAs($user, 'sanctum')->postJson('/api/game/save', [
            'world_id' => 'world_1',
            'current_step' => 9,
            'completed_objectives' => ['solve_ancient_door_puzzle', 'activate_time_portal'],
        ]);

        // Complete World 1
        $w1Complete = $this->actingAs($user, 'sanctum')->postJson('/api/game/complete-world', [
            'world_id' => 'world_1',
        ]);
        $w1Complete->assertStatus(200)
            ->assertJsonPath('status', 'success')
            ->assertJsonPath('xp_awarded', 500)
            ->assertJsonPath('progress.is_completed', true);

        // 5. WORLD 2: THE BROKEN PRESENT
        $w2State = $this->actingAs($user, 'sanctum')->getJson('/api/game/state?world=world_2');
        $w2State->assertStatus(200)
            ->assertJsonPath('progress.world_id', 'world_2');

        // Advance World 2 to step 6 (Time Core repaired)
        $this->actingAs($user, 'sanctum')->postJson('/api/game/save', [
            'world_id' => 'world_2',
            'current_step' => 6,
            'inventory' => [
                ['id' => 'chrono_core_alpha', 'name' => 'Alpha Chrono Core'],
                ['id' => 'chrono_core_beta', 'name' => 'Beta Chrono Core'],
            ],
            'completed_objectives' => ['harvest_cores', 'calibrate_flux_terminal'],
        ]);

        // Complete World 2
        $w2Complete = $this->actingAs($user, 'sanctum')->postJson('/api/game/complete-world', [
            'world_id' => 'world_2',
        ]);
        $w2Complete->assertStatus(200)
            ->assertJsonPath('xp_awarded', 750)
            ->assertJsonPath('progress.is_completed', true);

        // 6. WORLD 3: THE FRACTURED FUTURE
        $w3State = $this->actingAs($user, 'sanctum')->getJson('/api/game/state?world=world_3');
        $w3State->assertStatus(200)
            ->assertJsonPath('progress.world_id', 'world_3');

        // Advance World 3 to step 6 (Chronarch boss defeated)
        $this->actingAs($user, 'sanctum')->postJson('/api/game/save', [
            'world_id' => 'world_3',
            'current_step' => 6,
            'completed_objectives' => ['navigate_labyrinth', 'defeat_chronarch'],
        ]);

        // Complete World 3
        $w3Complete = $this->actingAs($user, 'sanctum')->postJson('/api/game/complete-world', [
            'world_id' => 'world_3',
        ]);
        $w3Complete->assertStatus(200)
            ->assertJsonPath('xp_awarded', 1000)
            ->assertJsonPath('progress.is_completed', true);

        // 7. FINAL CHAPTER: THE LAST TIMELINE -> ENDING A
        $wFinalState = $this->actingAs($user, 'sanctum')->getJson('/api/game/state?world=world_final');
        $wFinalState->assertStatus(200)
            ->assertJsonPath('progress.world_id', 'world_final');

        // Save step 3 with selected Ending A
        $this->actingAs($user, 'sanctum')->postJson('/api/game/save', [
            'world_id' => 'world_final',
            'current_step' => 3,
            'ending_selected' => 'ending_a',
            'story_journal' => ['lore_first_timeline', 'lore_chronarch_downfall', 'lore_weaver_ascension'],
        ]);

        // Complete Final Chapter with Ending A
        $finalComplete = $this->actingAs($user, 'sanctum')->postJson('/api/game/complete-world', [
            'world_id' => 'world_final',
            'ending_selected' => 'ending_a',
        ]);
        $finalComplete->assertStatus(200)
            ->assertJsonPath('xp_awarded', 1500)
            ->assertJsonPath('progress.is_completed', true)
            ->assertJsonPath('progress.campaign_completed', true)
            ->assertJsonPath('progress.ending_selected', 'ending_a');

        // 8. VERIFY CAMPAIGN SUMMARY
        $summary = $this->actingAs($user, 'sanctum')->getJson('/api/game/campaign-summary');
        $summary->assertStatus(200)
            ->assertJsonPath('status', 'success')
            ->assertJsonPath('summary.campaign_completed', true)
            ->assertJsonPath('summary.ending_selected', 'ending_a')
            ->assertJsonPath('summary.completion_percentage', 100);
    }

    /**
     * Alternate Ending Journey: Final Chapter -> Ending B (The Shattered Continuum)
     */
    public function test_player_journey_ending_b()
    {
        $unique = uniqid();
        $email = "hero_b_{$unique}@aervyn.local";

        $user = User::create([
            'name' => 'ChronoRenegade_' . $unique,
            'email' => $email,
            'password' => bcrypt('Password#2026'),
            'role' => 'player',
            'is_active' => true,
        ]);

        // Complete Final Chapter with Ending B
        $this->actingAs($user, 'sanctum')->postJson('/api/game/save', [
            'world_id' => 'world_final',
            'current_step' => 3,
            'ending_selected' => 'ending_b',
        ]);

        $finalResponse = $this->actingAs($user, 'sanctum')->postJson('/api/game/complete-world', [
            'world_id' => 'world_final',
            'ending_selected' => 'ending_b',
        ]);

        $finalResponse->assertStatus(200)
            ->assertJsonPath('progress.ending_selected', 'ending_b')
            ->assertJsonPath('progress.campaign_completed', true);
    }

    /**
     * Checkpoint Resume & Persistence Verification across Login Sessions
     */
    public function test_save_resume_and_checkpoint_persistence()
    {
        $unique = uniqid();
        $email = "checkpoint_tester_{$unique}@aervyn.local";

        $user = User::create([
            'name' => 'CheckpointTester_' . $unique,
            'email' => $email,
            'password' => bcrypt('Secret#2026'),
            'role' => 'player',
            'is_active' => true,
        ]);

        // Save specific checkpoint and inventory
        $this->actingAs($user, 'sanctum')->postJson('/api/game/save', [
            'world_id' => 'world_2',
            'current_step' => 4,
            'checkpoint_id' => 'subway_chronarch_junction',
            'checkpoint_position' => ['x' => -15.5, 'y' => 3.2, 'z' => 42.1],
            'inventory' => [['id' => 'time_wrench', 'name' => 'Time Wrench']],
            'playtime_increment' => 300,
        ]);

        // Simulate session termination and resume
        $resumeState = $this->actingAs($user, 'sanctum')->getJson('/api/game/state?world=world_2');
        $resumeState->assertStatus(200)
            ->assertJsonPath('progress.checkpoint_id', 'subway_chronarch_junction')
            ->assertJsonPath('progress.checkpoint_position.x', -15.5)
            ->assertJsonPath('progress.current_step', 4)
            ->assertJsonPath('progress.playtime_seconds', 300);
    }

    /**
     * Anti-Cheat & Security Safeguards Verification
     */
    public function test_anti_cheat_safeguards()
    {
        $unique = uniqid();
        $user = User::create([
            'name' => 'GlitchTester_' . $unique,
            'email' => "glitch_{$unique}@aervyn.local",
            'password' => bcrypt('Pass#2026'),
            'role' => 'player',
            'is_active' => true,
        ]);

        // 1. Cannot complete world prematurely without fulfilling minimum step requirements
        $this->actingAs($user, 'sanctum')->getJson('/api/game/state?world=world_1');
        $prematureResponse = $this->actingAs($user, 'sanctum')->postJson('/api/game/complete-world', [
            'world_id' => 'world_1',
        ]);
        $prematureResponse->assertStatus(422)
            ->assertJsonPath('status', 'error');

        // 2. Normal player cannot access administrative routes
        $adminForbidden = $this->actingAs($user, 'sanctum')->getJson('/api/admin/dashboard-stats');
        $adminForbidden->assertStatus(403);

        // 3. Ordinary player cannot inject XP or level via profile update
        $tamperResponse = $this->actingAs($user, 'sanctum')->putJson('/api/player/profile', [
            'display_name' => 'HackerName',
            'avatar' => 'avatar_chrono_walker',
            'xp' => 999999,
            'level' => 100,
            'role' => 'admin',
        ]);
        $tamperResponse->assertStatus(200);

        $refreshed = $user->fresh();
        $this->assertEquals(0, $refreshed->xp);
        $this->assertEquals(1, $refreshed->level);
        $this->assertEquals('player', $refreshed->role);
    }
}
