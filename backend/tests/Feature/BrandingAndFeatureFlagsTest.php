<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\GameSetting;
use Illuminate\Foundation\Testing\RefreshDatabase;

class BrandingAndFeatureFlagsTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        // Clear cached routes/config if any
        $this->artisan('route:clear');
    }

    public function test_public_branding_defaults_to_official_aervyn_identity(): void
    {
        // Ensure white label is disabled
        GameSetting::set('white_label_enabled', 'false', 'Toggle white label', 'branding');

        $response = $this->getJson('/api/config/branding');

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('branding.white_label_enabled', false)
            ->assertJsonPath('branding.product_name', 'AERVYN: ECHOES OF TIME')
            ->assertJsonPath('branding.logo_url', '/assets/aervyn-logo.png')
            ->assertJsonPath('branding.primary_color', '#00D9FF');
    }

    public function test_public_features_endpoint_returns_flags(): void
    {
        $response = $this->getJson('/api/config/features');

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonStructure([
                'features' => [
                    'demo_mode',
                    'social',
                    'leaderboard',
                    'friends',
                    'challenges',
                    'achievements',
                    'buyer_inquiry',
                    'product_showcase',
                    'white_label',
                    'analytics',
                    'landing_page'
                ]
            ]);
    }

    public function test_ordinary_player_cannot_access_or_modify_branding(): void
    {
        $player = User::factory()->create([
            'role' => 'player',
            'is_banned' => false,
        ]);

        $response = $this->actingAs($player, 'sanctum')->getJson('/api/admin/branding');
        $response->assertStatus(403);

        $updateResponse = $this->actingAs($player, 'sanctum')->putJson('/api/admin/branding', [
            'white_label_enabled' => true,
            'product_name' => 'Hacked Game',
        ]);
        $updateResponse->assertStatus(403);
    }

    public function test_admin_can_enable_white_label_and_reset_to_default(): void
    {
        $admin = User::factory()->create([
            'role' => 'admin',
            'is_banned' => false,
            'is_active' => true,
        ]);

        // 1. Admin fetches branding config
        $fetchRes = $this->actingAs($admin, 'sanctum')->getJson('/api/admin/branding');
        $fetchRes->assertStatus(200)
            ->assertJsonPath('success', true);

        // 2. Admin enables white-label customization
        $updateRes = $this->actingAs($admin, 'sanctum')->putJson('/api/admin/branding', [
            'white_label_enabled' => true,
            'product_name' => 'CHRONO NOVA: RIFTS OF DESTINY',
            'tagline' => 'A New Era of Spacetime Travel',
            'company_name' => 'Apex Studios Global',
            'company_description' => 'Leading publisher of web-first interactive experiences.',
            'support_email' => 'contact@apexstudios.com',
            'website_url' => 'https://apexstudios.com',
            'footer_text' => '© 2027 Apex Studios. Licensed Technology.',
            'primary_color' => '#10B981',
            'secondary_color' => '#6366F1',
            'accent_color' => '#F59E0B',
            'landing_title' => 'Chrono Nova — 3D Adventure Game',
            'landing_description' => 'Explore the continuum in this bespoke 3D web experience.',
        ]);
        $updateRes->assertStatus(200)
            ->assertJsonPath('success', true);

        // 3. Public endpoint now serves the customized buyer branding
        $publicRes = $this->getJson('/api/config/branding');
        $publicRes->assertStatus(200)
            ->assertJsonPath('branding.white_label_enabled', true)
            ->assertJsonPath('branding.product_name', 'CHRONO NOVA: RIFTS OF DESTINY')
            ->assertJsonPath('branding.company_name', 'Apex Studios Global')
            ->assertJsonPath('branding.primary_color', '#10B981');

        // 4. Admin resets to AERVYN default
        $resetRes = $this->actingAs($admin, 'sanctum')->postJson('/api/admin/branding/reset');
        $resetRes->assertStatus(200)
            ->assertJsonPath('success', true);

        // 5. Public endpoint immediately restores official AERVYN identity
        $restoredRes = $this->getJson('/api/config/branding');
        $restoredRes->assertStatus(200)
            ->assertJsonPath('branding.white_label_enabled', false)
            ->assertJsonPath('branding.product_name', 'AERVYN: ECHOES OF TIME')
            ->assertJsonPath('branding.company_name', 'AERVYN Game Studios')
            ->assertJsonPath('branding.logo_url', '/assets/aervyn-logo.png');
    }

    public function test_admin_can_update_feature_flags(): void
    {
        $admin = User::factory()->create([
            'role' => 'admin',
            'is_banned' => false,
            'is_active' => true,
        ]);

        $response = $this->actingAs($admin, 'sanctum')->putJson('/api/admin/features', [
            'features' => [
                'demo_mode' => true,
                'social' => false,
                'leaderboard' => true,
                'friends' => false,
            ]
        ]);

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('features.social', false);

        // Verify public features reflects update
        $publicFeatures = $this->getJson('/api/config/features');
        $publicFeatures->assertStatus(200)
            ->assertJsonPath('features.social', false)
            ->assertJsonPath('features.demo_mode', true);
    }
}
