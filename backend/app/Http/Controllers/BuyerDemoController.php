<?php

namespace App\Http\Controllers;

use App\Models\BuyerDemoAccess;
use App\Models\BuyerDemoSession;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class BuyerDemoController extends Controller
{
    /**
     * Validate a buyer demo access token server-side.
     */
    public function validateToken(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'token' => 'required|string|max:128',
        ]);

        $tokenHash = hash('sha256', $validated['token']);
        $access = BuyerDemoAccess::where('token_hash', $tokenHash)->first();

        if (!$access) {
            return response()->json([
                'status' => 'error',
                'message' => 'Invalid or unrecognized buyer demo access token.',
            ], 404);
        }

        if ($access->revoked_at !== null) {
            return response()->json([
                'status' => 'error',
                'message' => 'This commercial demo access token has been revoked by administration.',
            ], 403);
        }

        if ($access->expires_at !== null && $access->expires_at->isPast()) {
            return response()->json([
                'status' => 'error',
                'message' => 'This commercial demo access token expired on ' . $access->expires_at->toFormattedDateString() . '.',
            ], 410);
        }

        if ($access->access_limit !== null && $access->access_count >= $access->access_limit) {
            return response()->json([
                'status' => 'error',
                'message' => 'This commercial demo link has reached its maximum permitted session limit.',
            ], 429);
        }

        // Increment access counter safely
        $access->recordAccess();

        return response()->json([
            'status' => 'success',
            'message' => 'Access token verified. Welcome to the AERVYN Interactive Product Showcase.',
            'data' => [
                'access_id' => $access->id,
                'buyer_name' => $access->buyer_name,
                'company' => $access->company,
                'access_tier' => $access->access_tier,
                'access_count' => $access->access_count,
                'access_limit' => $access->access_limit,
                'expires_at' => $access->expires_at ? $access->expires_at->toIso8601String() : null,
            ],
        ]);
    }

    /**
     * Ping or record demo walkthrough progress (sections viewed, completion).
     */
    public function recordSessionPing(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'session_id' => 'required|string|max:64',
            'token' => 'nullable|string|max:128',
            'section_id' => 'nullable|string|max:64',
            'completed' => 'nullable|boolean',
        ]);

        $accessId = null;
        $isPrivate = false;
        $buyerRef = null;

        if (!empty($validated['token'])) {
            $tokenHash = hash('sha256', $validated['token']);
            $access = BuyerDemoAccess::where('token_hash', $tokenHash)->first();
            if ($access && $access->isValid()) {
                $accessId = $access->id;
                $isPrivate = true;
                $buyerRef = $access->buyer_name . ($access->company ? ' (' . $access->company . ')' : '');
            }
        }

        $session = BuyerDemoSession::firstOrNew(['session_id' => $validated['session_id']]);

        if (!$session->exists) {
            $session->access_id = $accessId;
            $session->is_private = $isPrivate;
            $session->buyer_reference = $buyerRef;
            $session->started_at = now();
            $session->ip_address = $request->ip();
            $session->user_agent = substr($request->userAgent() ?? '', 0, 500);
            $session->sections_viewed = [];
        }

        $session->last_active_at = now();

        if (!empty($validated['section_id'])) {
            $sections = $session->sections_viewed ?? [];
            if (!in_array($validated['section_id'], $sections, true)) {
                $sections[] = $validated['section_id'];
                $session->sections_viewed = $sections;
            }
        }

        if (!empty($validated['completed']) && $session->completed_at === null) {
            $session->completed_at = now();
        }

        $session->save();

        return response()->json([
            'status' => 'success',
            'session_id' => $session->session_id,
        ]);
    }

    /**
     * Submit buyer evaluation feedback.
     */
    public function submitFeedback(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'session_id' => 'required|string|max:64',
            'score' => 'required|integer|min:1|max:5',
            'notes' => 'nullable|string|max:2000',
        ]);

        $session = BuyerDemoSession::where('session_id', $validated['session_id'])->first();

        if ($session) {
            $session->update([
                'feedback_score' => $validated['score'],
                'feedback_notes' => $validated['notes'],
            ]);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Thank you for your evaluation feedback.',
        ]);
    }

    /**
     * Provide safe, isolated read-only sample player statistics for the showcase.
     * Contains ZERO live player PII or production user data.
     */
    public function getShowcaseSampleData(): JsonResponse
    {
        return response()->json([
            'status' => 'success',
            'disclaimer' => 'DEMO DATA — NOT LIVE PLAYER STATISTICS',
            'data' => [
                'sample_profile' => [
                    'callsign' => 'Operative_Echo7',
                    'level' => 14,
                    'xp' => 14250,
                    'next_level_xp' => 18000,
                    'campaign_progress' => 'World 3: The Fractured Future',
                    'playtime_hours' => 6.4,
                    'chrono_shards' => 38,
                    'achievements_unlocked' => 11,
                    'total_achievements' => 16,
                ],
                'sample_achievements' => [
                    ['id' => 'first_keystone', 'name' => 'First Keystone', 'desc' => 'Recovered the lost Chrono Keystone in World 1', 'unlocked' => true, 'rarity' => 'Common'],
                    ['id' => 'temporal_divergence', 'name' => 'Temporal Divergence', 'desc' => 'Triggered your first era phase-shift portal', 'unlocked' => true, 'rarity' => 'Rare'],
                    ['id' => 'circuit_master', 'name' => 'Circuit Master', 'desc' => 'Solved the urban circuit puzzle in under 60 seconds', 'unlocked' => true, 'rarity' => 'Uncommon'],
                    ['id' => 'quantum_alignment', 'name' => 'Quantum Alignment', 'desc' => 'Synchronized all 3 laser nodes in World 3', 'unlocked' => true, 'rarity' => 'Rare'],
                    ['id' => 'chronarch_slayer', 'name' => 'Chronarch Confronted', 'desc' => 'Survived the telegraphed Phase 2 cosmic shockwave', 'unlocked' => false, 'rarity' => 'Epic'],
                ],
                'sample_inventory' => [
                    ['item' => 'Chrono Keystone (Ancient)', 'type' => 'Artifact', 'qty' => 1, 'power' => 'Opens World 1 Gateway'],
                    ['item' => 'Frequency Tuner', 'type' => 'Gadget', 'qty' => 1, 'power' => 'Calibrates laser nodes'],
                    ['item' => 'Temporal Battery Cell', 'type' => 'Consumable', 'qty' => 4, 'power' => 'Restores Chrono Energy'],
                ],
                'sample_leaderboard' => [
                    ['rank' => 1, 'player' => 'VortexWalker', 'score' => 9840, 'speedrun_time' => '18:42'],
                    ['rank' => 2, 'player' => 'TimelineZero', 'score' => 9210, 'speedrun_time' => '21:15'],
                    ['rank' => 3, 'player' => 'ChronoGhost', 'score' => 8850, 'speedrun_time' => '22:04'],
                    ['rank' => 4, 'player' => 'Operative_Echo7 (Demo Profile)', 'score' => 8420, 'speedrun_time' => '24:30'],
                ],
            ],
        ]);
    }
}
