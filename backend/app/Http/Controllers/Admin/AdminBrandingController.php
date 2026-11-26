<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Controllers\BrandingController;
use App\Models\GameSetting;
use App\Models\AdminActivityLog;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\File;

/**
 * Professional White-Label & Product Branding Management
 * Allows studio administrators and enterprise buyers to configure
 * product branding, logos, color themes, and feature flags.
 */
class AdminBrandingController extends Controller
{
    /**
     * Get complete branding settings and defaults
     */
    public function index(): JsonResponse
    {
        $settings = GameSetting::where('category', 'branding')->pluck('value', 'key')->toArray();

        return response()->json([
            'success' => true,
            'white_label_enabled' => ($settings['white_label_enabled'] ?? 'false') === 'true',
            'branding' => [
                'product_name' => $settings['white_label_product_name'] ?? '',
                'tagline' => $settings['white_label_tagline'] ?? '',
                'logo_url' => $settings['white_label_logo_url'] ?? '',
                'favicon_url' => $settings['white_label_favicon_url'] ?? '',
                'company_name' => $settings['white_label_company_name'] ?? '',
                'company_logo_url' => $settings['white_label_company_logo_url'] ?? '',
                'support_email' => $settings['white_label_support_email'] ?? '',
                'website_url' => $settings['white_label_website_url'] ?? '',
                'company_description' => $settings['white_label_company_description'] ?? '',
                'footer_text' => $settings['white_label_footer_text'] ?? '',
                'primary_color' => $settings['white_label_primary_color'] ?? '#00D9FF',
                'secondary_color' => $settings['white_label_secondary_color'] ?? '#7047FF',
                'accent_color' => $settings['white_label_accent_color'] ?? '#F5B942',
                'landing_title' => $settings['white_label_landing_title'] ?? '',
                'landing_description' => $settings['white_label_landing_description'] ?? '',
            ],
            'defaults' => BrandingController::DEFAULT_BRANDING,
        ]);
    }

    /**
     * Update branding settings
     */
    public function update(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'white_label_enabled' => 'required|boolean',
            'product_name' => 'nullable|string|max:100',
            'tagline' => 'nullable|string|max:200',
            'company_name' => 'nullable|string|max:100',
            'company_description' => 'nullable|string|max:500',
            'support_email' => 'nullable|email|max:100',
            'website_url' => 'nullable|url|max:255',
            'footer_text' => 'nullable|string|max:255',
            'primary_color' => ['nullable', 'regex:/^#[0-9a-fA-F]{6}$/'],
            'secondary_color' => ['nullable', 'regex:/^#[0-9a-fA-F]{6}$/'],
            'accent_color' => ['nullable', 'regex:/^#[0-9a-fA-F]{6}$/'],
            'landing_title' => 'nullable|string|max:150',
            'landing_description' => 'nullable|string|max:300',
        ]);

        GameSetting::set('white_label_enabled', $validated['white_label_enabled'] ? 'true' : 'false', 'Toggle white-label custom branding', 'branding');
        GameSetting::set('white_label_product_name', $validated['product_name'] ?? '', 'Custom product name', 'branding');
        GameSetting::set('white_label_tagline', $validated['tagline'] ?? '', 'Custom product tagline', 'branding');
        GameSetting::set('white_label_company_name', $validated['company_name'] ?? '', 'Buyer company name', 'branding');
        GameSetting::set('white_label_company_description', $validated['company_description'] ?? '', 'Buyer company description', 'branding');
        GameSetting::set('white_label_support_email', $validated['support_email'] ?? '', 'Buyer support email', 'branding');
        GameSetting::set('white_label_website_url', $validated['website_url'] ?? '', 'Buyer website URL', 'branding');
        GameSetting::set('white_label_footer_text', $validated['footer_text'] ?? '', 'Custom footer copyright text', 'branding');
        GameSetting::set('white_label_primary_color', $validated['primary_color'] ?? '#00D9FF', 'Primary brand color', 'branding');
        GameSetting::set('white_label_secondary_color', $validated['secondary_color'] ?? '#7047FF', 'Secondary brand color', 'branding');
        GameSetting::set('white_label_accent_color', $validated['accent_color'] ?? '#F5B942', 'Accent brand color', 'branding');
        GameSetting::set('white_label_landing_title', $validated['landing_title'] ?? '', 'Custom landing title', 'branding');
        GameSetting::set('white_label_landing_description', $validated['landing_description'] ?? '', 'Custom landing description', 'branding');

        AdminActivityLog::log(
            'update_branding_settings',
            'Branding',
            'white_label',
            ['white_label_enabled' => $validated['white_label_enabled']]
        );

        return response()->json([
            'success' => true,
            'message' => 'Product branding configuration updated successfully.',
        ]);
    }

    /**
     * Upload custom white-label logo
     */
    public function uploadLogo(Request $request): JsonResponse
    {
        $request->validate([
            'logo' => 'required|file|mimes:png,jpg,jpeg,webp,svg|max:2048',
        ]);

        $file = $request->file('logo');
        $uploadDir = public_path('uploads/branding');

        if (!File::isDirectory($uploadDir)) {
            File::makeDirectory($uploadDir, 0755, true, true);
        }

        $extension = $file->getClientOriginalExtension();
        $safeName = 'custom_logo_' . time() . '_' . substr(md5(uniqid()), 0, 8) . '.' . $extension;
        $file->move($uploadDir, $safeName);

        $url = '/uploads/branding/' . $safeName;
        GameSetting::set('white_label_logo_url', $url, 'Custom buyer logo asset', 'branding');

        AdminActivityLog::log(
            'upload_branding_logo',
            'Branding',
            'logo',
            ['filename' => $safeName, 'url' => $url]
        );

        return response()->json([
            'success' => true,
            'message' => 'Custom white-label logo uploaded successfully.',
            'logo_url' => $url,
        ]);
    }

    /**
     * Upload custom white-label favicon
     */
    public function uploadFavicon(Request $request): JsonResponse
    {
        $request->validate([
            'favicon' => 'required|file|mimes:png,ico,svg|max:1024',
        ]);

        $file = $request->file('favicon');
        $uploadDir = public_path('uploads/branding');

        if (!File::isDirectory($uploadDir)) {
            File::makeDirectory($uploadDir, 0755, true, true);
        }

        $extension = $file->getClientOriginalExtension();
        $safeName = 'custom_favicon_' . time() . '_' . substr(md5(uniqid()), 0, 8) . '.' . $extension;
        $file->move($uploadDir, $safeName);

        $url = '/uploads/branding/' . $safeName;
        GameSetting::set('white_label_favicon_url', $url, 'Custom buyer favicon asset', 'branding');

        AdminActivityLog::log(
            'upload_branding_favicon',
            'Branding',
            'favicon',
            ['filename' => $safeName, 'url' => $url]
        );

        return response()->json([
            'success' => true,
            'message' => 'Custom white-label favicon uploaded successfully.',
            'favicon_url' => $url,
        ]);
    }

    /**
     * Reset branding strictly to official AERVYN defaults
     */
    public function resetToDefault(): JsonResponse
    {
        GameSetting::set('white_label_enabled', 'false', 'Toggle white-label custom branding', 'branding');
        GameSetting::set('white_label_product_name', '', 'Custom product name', 'branding');
        GameSetting::set('white_label_tagline', '', 'Custom product tagline', 'branding');
        GameSetting::set('white_label_logo_url', '', 'Custom buyer logo asset', 'branding');
        GameSetting::set('white_label_favicon_url', '', 'Custom buyer favicon asset', 'branding');
        GameSetting::set('white_label_company_name', '', 'Buyer company name', 'branding');
        GameSetting::set('white_label_company_logo_url', '', 'Buyer corporate logo', 'branding');
        GameSetting::set('white_label_support_email', '', 'Buyer support email', 'branding');
        GameSetting::set('white_label_website_url', '', 'Buyer website URL', 'branding');
        GameSetting::set('white_label_company_description', '', 'Buyer company description', 'branding');
        GameSetting::set('white_label_footer_text', '', 'Custom footer copyright text', 'branding');
        GameSetting::set('white_label_primary_color', '#00D9FF', 'Primary brand color', 'branding');
        GameSetting::set('white_label_secondary_color', '#7047FF', 'Secondary brand color', 'branding');
        GameSetting::set('white_label_accent_color', '#F5B942', 'Accent brand color', 'branding');
        GameSetting::set('white_label_landing_title', '', 'Custom landing title', 'branding');
        GameSetting::set('white_label_landing_description', '', 'Custom landing description', 'branding');

        AdminActivityLog::log(
            'reset_branding_to_default',
            'Branding',
            'all',
            ['action' => 'restored_aervyn_official_identity']
        );

        return response()->json([
            'success' => true,
            'message' => 'Branding successfully reset to official AERVYN: ECHOES OF TIME defaults.',
            'defaults' => BrandingController::DEFAULT_BRANDING,
        ]);
    }

    /**
     * Get feature flags
     */
    public function getFeatures(): JsonResponse
    {
        $settings = GameSetting::where('category', 'features')->pluck('value', 'key')->toArray();

        $features = [
            'demo_mode' => ($settings['feature_demo_mode'] ?? 'true') === 'true',
            'social' => ($settings['feature_social'] ?? 'true') === 'true',
            'leaderboard' => ($settings['feature_leaderboard'] ?? 'true') === 'true',
            'friends' => ($settings['feature_friends'] ?? 'true') === 'true',
            'challenges' => ($settings['feature_challenges'] ?? 'true') === 'true',
            'achievements' => ($settings['feature_achievements'] ?? 'true') === 'true',
            'buyer_inquiry' => ($settings['feature_buyer_inquiry'] ?? 'true') === 'true',
            'product_showcase' => ($settings['feature_product_showcase'] ?? 'true') === 'true',
            'white_label' => ($settings['feature_white_label'] ?? 'true') === 'true',
            'analytics' => ($settings['feature_analytics'] ?? 'true') === 'true',
            'landing_page' => ($settings['feature_landing_page'] ?? 'true') === 'true',
        ];

        return response()->json([
            'success' => true,
            'features' => $features,
        ]);
    }

    /**
     * Update feature flags
     */
    public function updateFeatures(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'features' => 'required|array',
            'features.demo_mode' => 'nullable|boolean',
            'features.social' => 'nullable|boolean',
            'features.leaderboard' => 'nullable|boolean',
            'features.friends' => 'nullable|boolean',
            'features.challenges' => 'nullable|boolean',
            'features.achievements' => 'nullable|boolean',
            'features.buyer_inquiry' => 'nullable|boolean',
            'features.product_showcase' => 'nullable|boolean',
            'features.white_label' => 'nullable|boolean',
            'features.analytics' => 'nullable|boolean',
            'features.landing_page' => 'nullable|boolean',
        ]);

        foreach ($validated['features'] as $key => $val) {
            GameSetting::set('feature_' . $key, $val ? 'true' : 'false', 'Feature flag for ' . $key, 'features');
        }

        AdminActivityLog::log(
            'update_feature_flags',
            'GameSetting',
            'features',
            $validated['features']
        );

        return response()->json([
            'success' => true,
            'message' => 'Feature flags updated successfully.',
            'features' => $validated['features'],
        ]);
    }
}
