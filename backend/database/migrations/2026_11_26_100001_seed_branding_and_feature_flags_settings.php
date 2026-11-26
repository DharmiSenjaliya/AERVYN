<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Models\GameSetting;

return new class extends Migration
{
    /**
     * Run the migrations to seed default branding, white-label, and feature flag settings.
     */
    public function up(): void
    {
        if (Schema::hasTable('game_settings')) {
            $defaultSettings = [
                // 1. Branding & White-Label Settings
                ['key' => 'white_label_enabled', 'value' => 'false', 'description' => 'Toggle white-label custom branding (false = official AERVYN)', 'category' => 'branding'],
                ['key' => 'white_label_product_name', 'value' => '', 'description' => 'Custom white-label product name', 'category' => 'branding'],
                ['key' => 'white_label_tagline', 'value' => '', 'description' => 'Custom white-label product tagline', 'category' => 'branding'],
                ['key' => 'white_label_logo_url', 'value' => '', 'description' => 'Custom buyer logo asset path/URL', 'category' => 'branding'],
                ['key' => 'white_label_favicon_url', 'value' => '', 'description' => 'Custom buyer favicon asset path/URL', 'category' => 'branding'],
                ['key' => 'white_label_company_name', 'value' => '', 'description' => 'Buyer company / publisher name', 'category' => 'branding'],
                ['key' => 'white_label_company_logo_url', 'value' => '', 'description' => 'Buyer corporate logo path/URL', 'category' => 'branding'],
                ['key' => 'white_label_support_email', 'value' => '', 'description' => 'Buyer customer support email address', 'category' => 'branding'],
                ['key' => 'white_label_website_url', 'value' => '', 'description' => 'Buyer official website URL', 'category' => 'branding'],
                ['key' => 'white_label_company_description', 'value' => '', 'description' => 'Buyer studio / company description', 'category' => 'branding'],
                ['key' => 'white_label_footer_text', 'value' => '', 'description' => 'Custom footer copyright statement', 'category' => 'branding'],
                ['key' => 'white_label_primary_color', 'value' => '#00D9FF', 'description' => 'Primary theme brand color (hex code)', 'category' => 'branding'],
                ['key' => 'white_label_secondary_color', 'value' => '#7047FF', 'description' => 'Secondary theme brand color (hex code)', 'category' => 'branding'],
                ['key' => 'white_label_accent_color', 'value' => '#F5B942', 'description' => 'Accent highlight brand color (hex code)', 'category' => 'branding'],
                ['key' => 'white_label_landing_title', 'value' => '', 'description' => 'Custom HTML title tag for landing page', 'category' => 'branding'],
                ['key' => 'white_label_landing_description', 'value' => '', 'description' => 'Custom HTML meta description for landing page', 'category' => 'branding'],

                // 2. Feature Flags
                ['key' => 'feature_demo_mode', 'value' => 'true', 'description' => 'Enable sandboxed buyer evaluation demo mode (/demo)', 'category' => 'features'],
                ['key' => 'feature_social', 'value' => 'true', 'description' => 'Enable online community & social layer (/social)', 'category' => 'features'],
                ['key' => 'feature_leaderboard', 'value' => 'true', 'description' => 'Enable global and social leaderboards', 'category' => 'features'],
                ['key' => 'feature_friends', 'value' => 'true', 'description' => 'Enable friend requests, lists, and search', 'category' => 'features'],
                ['key' => 'feature_challenges', 'value' => 'true', 'description' => 'Enable asynchronous player challenge duels', 'category' => 'features'],
                ['key' => 'feature_achievements', 'value' => 'true', 'description' => 'Enable achievements and progression unlocks', 'category' => 'features'],
                ['key' => 'feature_buyer_inquiry', 'value' => 'true', 'description' => 'Enable commercial buyer inquiry form and API', 'category' => 'features'],
                ['key' => 'feature_product_showcase', 'value' => 'true', 'description' => 'Enable commercial product specs showcase (/product)', 'category' => 'features'],
                ['key' => 'feature_white_label', 'value' => 'true', 'description' => 'Allow administrative white-label customization', 'category' => 'features'],
                ['key' => 'feature_analytics', 'value' => 'true', 'description' => 'Enable studio analytics telemetry collection', 'category' => 'features'],
                ['key' => 'feature_landing_page', 'value' => 'true', 'description' => 'Enable public marketing and showcase landing page (/)', 'category' => 'features'],
            ];

            foreach ($defaultSettings as $setting) {
                GameSetting::firstOrCreate(
                    ['key' => $setting['key']],
                    [
                        'value' => $setting['value'],
                        'description' => $setting['description'],
                        'category' => $setting['category'],
                    ]
                );
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasTable('game_settings')) {
            GameSetting::whereIn('category', ['branding', 'features'])->delete();
        }
    }
};
