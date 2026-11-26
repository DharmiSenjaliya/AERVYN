<?php

namespace App\Http\Controllers;

use App\Models\GameSetting;
use Illuminate\Http\JsonResponse;

/**
 * Public Branding & Configuration Controller
 * Serves active branding specifications and public feature flags.
 */
class BrandingController extends Controller
{
    /**
     * Default Official AERVYN Brand Constants
     */
    public const DEFAULT_BRANDING = [
        'white_label_enabled' => false,
        'product_name' => 'AERVYN: ECHOES OF TIME',
        'tagline' => 'CHANGE THE PAST. SURVIVE THE PRESENT. DISCOVER THE FUTURE.',
        'logo_url' => '/assets/aervyn-logo.png',
        'favicon_url' => '/assets/aervyn-logo.png',
        'company_name' => 'AERVYN Game Studios',
        'company_logo_url' => '',
        'support_email' => 'support@aervyn.com',
        'website_url' => 'https://aervyn.game',
        'company_description' => 'An original, story-driven 3D adventure through fractured timelines.',
        'footer_text' => '© 2026 AERVYN: Echoes of Time. All rights reserved.',
        'primary_color' => '#00D9FF',
        'secondary_color' => '#7047FF',
        'accent_color' => '#F5B942',
        'landing_title' => 'AERVYN: ECHOES OF TIME — Commercial 3D Adventure Game',
        'landing_description' => 'Change the Past. Survive the Present. Discover the Future. A commercial 3D adventure game engineered with Three.js, React 19, and Laravel 12.',
    ];

    /**
     * Get computed public branding
     */
    public function getPublicBranding(): JsonResponse
    {
        $whiteLabelEnabled = GameSetting::get('white_label_enabled', 'false') === 'true';

        if (!$whiteLabelEnabled) {
            return response()->json([
                'success' => true,
                'branding' => self::DEFAULT_BRANDING,
            ]);
        }

        // When white label is enabled, return buyer customization with safe defaults
        $branding = [
            'white_label_enabled' => true,
            'product_name' => GameSetting::get('white_label_product_name') ?: self::DEFAULT_BRANDING['product_name'],
            'tagline' => GameSetting::get('white_label_tagline') ?: self::DEFAULT_BRANDING['tagline'],
            'logo_url' => GameSetting::get('white_label_logo_url') ?: self::DEFAULT_BRANDING['logo_url'],
            'favicon_url' => GameSetting::get('white_label_favicon_url') ?: self::DEFAULT_BRANDING['favicon_url'],
            'company_name' => GameSetting::get('white_label_company_name') ?: self::DEFAULT_BRANDING['company_name'],
            'company_logo_url' => GameSetting::get('white_label_company_logo_url') ?: self::DEFAULT_BRANDING['company_logo_url'],
            'support_email' => GameSetting::get('white_label_support_email') ?: self::DEFAULT_BRANDING['support_email'],
            'website_url' => GameSetting::get('white_label_website_url') ?: self::DEFAULT_BRANDING['website_url'],
            'company_description' => GameSetting::get('white_label_company_description') ?: self::DEFAULT_BRANDING['company_description'],
            'footer_text' => GameSetting::get('white_label_footer_text') ?: self::DEFAULT_BRANDING['footer_text'],
            'primary_color' => GameSetting::get('white_label_primary_color') ?: self::DEFAULT_BRANDING['primary_color'],
            'secondary_color' => GameSetting::get('white_label_secondary_color') ?: self::DEFAULT_BRANDING['secondary_color'],
            'accent_color' => GameSetting::get('white_label_accent_color') ?: self::DEFAULT_BRANDING['accent_color'],
            'landing_title' => GameSetting::get('white_label_landing_title') ?: self::DEFAULT_BRANDING['landing_title'],
            'landing_description' => GameSetting::get('white_label_landing_description') ?: self::DEFAULT_BRANDING['landing_description'],
        ];

        return response()->json([
            'success' => true,
            'branding' => $branding,
        ]);
    }

    /**
     * Get public feature flags
     */
    public function getPublicFeatures(): JsonResponse
    {
        $features = [
            'demo_mode' => GameSetting::get('feature_demo_mode', 'true') === 'true',
            'social' => GameSetting::get('feature_social', 'true') === 'true',
            'leaderboard' => GameSetting::get('feature_leaderboard', 'true') === 'true',
            'friends' => GameSetting::get('feature_friends', 'true') === 'true',
            'challenges' => GameSetting::get('feature_challenges', 'true') === 'true',
            'achievements' => GameSetting::get('feature_achievements', 'true') === 'true',
            'buyer_inquiry' => GameSetting::get('feature_buyer_inquiry', 'true') === 'true',
            'product_showcase' => GameSetting::get('feature_product_showcase', 'true') === 'true',
            'white_label' => GameSetting::get('feature_white_label', 'true') === 'true',
            'analytics' => GameSetting::get('feature_analytics', 'true') === 'true',
            'landing_page' => GameSetting::get('feature_landing_page', 'true') === 'true',
        ];

        return response()->json([
            'success' => true,
            'features' => $features,
        ]);
    }
}
