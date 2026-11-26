<?php

namespace Tests\Feature;

use App\Models\BuyerDemoAccess;
use App\Models\User;
use Tests\TestCase;

class BuyerDemoAccessTest extends TestCase
{

    public function test_public_visitor_can_get_showcase_sample_data(): void
    {
        $response = $this->getJson('/api/buyer-demo/sample-data');

        $response->assertStatus(200)
            ->assertJson([
                'status' => 'success',
                'disclaimer' => 'DEMO DATA — NOT LIVE PLAYER STATISTICS',
            ])
            ->assertJsonStructure([
                'data' => [
                    'sample_profile' => ['callsign', 'level', 'xp', 'campaign_progress'],
                    'sample_achievements',
                    'sample_inventory',
                    'sample_leaderboard',
                ],
            ]);
    }

    public function test_public_visitor_can_validate_active_token(): void
    {
        $res = BuyerDemoAccess::createSecureLink([
            'buyer_name' => 'Acme Games Studio',
            'company' => 'Acme Interactive',
            'access_limit' => 5,
            'expires_at' => now()->addDays(7),
        ]);

        $plainToken = $res['plain_token'];

        $response = $this->postJson('/api/buyer-demo/validate-token', [
            'token' => $plainToken,
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'status' => 'success',
                'data' => [
                    'buyer_name' => 'Acme Games Studio',
                    'company' => 'Acme Interactive',
                    'access_count' => 1,
                    'access_limit' => 5,
                ],
            ]);

        $this->assertDatabaseHas('buyer_demo_access', [
            'buyer_name' => 'Acme Games Studio',
            'access_count' => 1,
        ]);
    }

    public function test_expired_token_is_rejected(): void
    {
        $res = BuyerDemoAccess::createSecureLink([
            'buyer_name' => 'Expired Evaluator',
            'expires_at' => now()->subDay(),
        ]);

        $response = $this->postJson('/api/buyer-demo/validate-token', [
            'token' => $res['plain_token'],
        ]);

        $response->assertStatus(410)
            ->assertJson(['status' => 'error']);
    }

    public function test_revoked_token_is_rejected(): void
    {
        $res = BuyerDemoAccess::createSecureLink([
            'buyer_name' => 'Revoked Publisher',
            'expires_at' => now()->addDays(14),
            'revoked_at' => now(),
        ]);

        $response = $this->postJson('/api/buyer-demo/validate-token', [
            'token' => $res['plain_token'],
        ]);

        $response->assertStatus(403)
            ->assertJson(['status' => 'error']);
    }

    public function test_exhausted_access_limit_is_rejected(): void
    {
        $res = BuyerDemoAccess::createSecureLink([
            'buyer_name' => 'Limited Evaluator',
            'access_limit' => 2,
            'access_count' => 2,
            'expires_at' => now()->addDays(7),
        ]);

        $response = $this->postJson('/api/buyer-demo/validate-token', [
            'token' => $res['plain_token'],
        ]);

        $response->assertStatus(429)
            ->assertJson(['status' => 'error']);
    }

    public function test_invalid_token_returns_404(): void
    {
        $response = $this->postJson('/api/buyer-demo/validate-token', [
            'token' => 'aervyn_demo_nonexistent_token_string_1234567890',
        ]);

        $response->assertStatus(404)
            ->assertJson(['status' => 'error']);
    }

    public function test_session_ping_and_feedback(): void
    {
        $pingResponse = $this->postJson('/api/buyer-demo/session/ping', [
            'session_id' => 'test_sess_' . uniqid(),
            'section_id' => 'game_story',
            'completed' => false,
        ]);

        $pingResponse->assertStatus(200)
            ->assertJson(['status' => 'success']);

        $feedbackResponse = $this->postJson('/api/buyer-demo/session/feedback', [
            'session_id' => $pingResponse->json('session_id'),
            'score' => 5,
            'notes' => 'Impressive 3D performance and architecture.',
        ]);

        $feedbackResponse->assertStatus(200)
            ->assertJson(['status' => 'success']);
    }

    public function test_ordinary_player_cannot_manage_buyer_demo_links(): void
    {
        $player = User::factory()->create([
            'role' => 'player',
            'is_active' => true,
            'is_banned' => false,
        ]);

        $response = $this->actingAs($player, 'sanctum')
            ->getJson('/api/admin/buyer-demo/links');

        $response->assertStatus(403);
    }

    public function test_admin_can_generate_list_revoke_links_and_view_analytics(): void
    {
        $admin = User::factory()->create([
            'role' => 'admin',
            'is_active' => true,
            'is_banned' => false,
        ]);

        // 1. Create Link
        $createResponse = $this->actingAs($admin, 'sanctum')
            ->postJson('/api/admin/buyer-demo/links', [
                'buyer_name' => 'Hyperion Publishing Group',
                'company' => 'Hyperion Interactive',
                'email' => 'partnerships@hyperion.com',
                'access_tier' => 'vip',
                'access_limit' => 25,
                'expires_in_days' => 30,
                'internal_notes' => 'Executive review lead for European syndication.',
            ]);

        $createResponse->assertStatus(201)
            ->assertJson([
                'status' => 'success',
                'data' => [
                    'buyer_name' => 'Hyperion Publishing Group',
                    'access_tier' => 'vip',
                    'access_limit' => 25,
                ],
            ]);

        $linkId = $createResponse->json('data.id');
        $plainToken = $createResponse->json('data.plain_token');
        $this->assertNotEmpty($plainToken);

        // 2. List Links
        $listResponse = $this->actingAs($admin, 'sanctum')
            ->getJson('/api/admin/buyer-demo/links');

        $listResponse->assertStatus(200)
            ->assertJson(['status' => 'success']);

        // 3. View Analytics
        $analyticsResponse = $this->actingAs($admin, 'sanctum')
            ->getJson('/api/admin/buyer-demo/analytics');

        $analyticsResponse->assertStatus(200)
            ->assertJson(['status' => 'success']);

        // 4. Revoke Link
        $revokeResponse = $this->actingAs($admin, 'sanctum')
            ->postJson("/api/admin/buyer-demo/links/{$linkId}/revoke");

        $revokeResponse->assertStatus(200)
            ->assertJson(['status' => 'success']);

        // 5. Verify Revoked Token Validation fails
        $testValidation = $this->postJson('/api/buyer-demo/validate-token', [
            'token' => $plainToken,
        ]);
        $testValidation->assertStatus(403);
    }
}
