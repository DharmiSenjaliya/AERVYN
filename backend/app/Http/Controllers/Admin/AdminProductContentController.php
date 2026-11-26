<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\GameSetting;
use App\Models\AdminActivityLog;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class AdminProductContentController extends Controller
{
    /**
     * Default Commercial Product CMS Content
     */
    public const DEFAULT_CONTENT = [
        'hero_title' => 'AERVYN: ECHOES OF TIME',
        'hero_tagline' => 'CHANGE THE PAST. SURVIVE THE PRESENT. DISCOVER THE FUTURE.',
        'hero_intro' => 'An original, story-driven 3D adventure through fractured timelines. Uncover the mystery of the ancient Chrono Keystone, traverse corrupted eras, solve environmental puzzles, and restore the continuum.',
        'overview_heading' => 'A High-Performance Web-First 3D Gaming Product',
        'overview_text' => 'AERVYN: ECHOES OF TIME is a standalone, browser-executable 3D action-adventure title that demonstrates the full potential of contemporary WebGL and real-time graphics on the open web. Built without external binary bloat, it delivers seamless cross-platform performance and instant load times.',
        'cta_demo_label' => 'PLAY DEMO',
        'cta_explore_label' => 'EXPLORE PRODUCT',
        'cta_quote_label' => 'REQUEST A QUOTE',
        'contact_email' => 'licensing@aervyn.game',
        'contact_phone' => '+1 (555) 019-2834',
        'package_a_name' => 'Package A — Complete Game',
        'package_a_desc' => 'Full AERVYN game source code, React frontend, Laravel backend, MySQL database, 3D engine, campaign worlds, and documentation.',
        'package_b_name' => 'Package B — Game + Customization',
        'package_b_desc' => 'Everything in Complete Game PLUS branding customization, logo replacement, UI theme adaptation, and selected content customization.',
        'package_c_name' => 'Package C — White-Label Edition',
        'package_c_desc' => 'Everything in Package B PLUS complete buyer rebranding, company identity integration, white-label portal, and custom deployment configuration.',
    ];

    /**
     * Get product content CMS data
     */
    public function index(): JsonResponse
    {
        $settings = GameSetting::where('category', 'product_content')->pluck('value', 'key')->toArray();

        $content = [];
        foreach (self::DEFAULT_CONTENT as $key => $defaultVal) {
            $content[$key] = $settings[$key] ?? $defaultVal;
        }

        return response()->json([
            'success' => true,
            'content' => $content,
            'defaults' => self::DEFAULT_CONTENT,
        ]);
    }

    /**
     * Update product content CMS data with validation
     */
    public function update(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'hero_title' => 'nullable|string|max:150',
            'hero_tagline' => 'nullable|string|max:250',
            'hero_intro' => 'nullable|string|max:1000',
            'overview_heading' => 'nullable|string|max:200',
            'overview_text' => 'nullable|string|max:2000',
            'cta_demo_label' => 'nullable|string|max:50',
            'cta_explore_label' => 'nullable|string|max:50',
            'cta_quote_label' => 'nullable|string|max:50',
            'contact_email' => 'nullable|email|max:100',
            'contact_phone' => 'nullable|string|max:50',
            'package_a_name' => 'nullable|string|max:100',
            'package_a_desc' => 'nullable|string|max:500',
            'package_b_name' => 'nullable|string|max:100',
            'package_b_desc' => 'nullable|string|max:500',
            'package_c_name' => 'nullable|string|max:100',
            'package_c_desc' => 'nullable|string|max:500',
        ]);

        foreach ($validated as $key => $val) {
            if ($val !== null) {
                GameSetting::set($key, strip_tags($val), 'Product content CMS: ' . $key, 'product_content');
            }
        }

        AdminActivityLog::log('UPDATE_PRODUCT_CONTENT', 'game_settings', 'product_content');

        return response()->json([
            'success' => true,
            'message' => 'Product content CMS updated successfully.',
        ]);
    }

    /**
     * Reset product content CMS to defaults
     */
    public function reset(): JsonResponse
    {
        GameSetting::where('category', 'product_content')->delete();

        AdminActivityLog::log('RESET_PRODUCT_CONTENT', 'game_settings', 'product_content');

        return response()->json([
            'success' => true,
            'message' => 'Product content reset to defaults.',
            'defaults' => self::DEFAULT_CONTENT,
        ]);
    }
}
