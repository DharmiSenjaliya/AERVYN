<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\BuyerDemoAccess;
use App\Models\BuyerDemoSession;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminBuyerDemoController extends Controller
{
    /**
     * List all buyer demo access links.
     */
    public function index(Request $request): JsonResponse
    {
        $query = BuyerDemoAccess::with('creator:id,name,email')
            ->orderByDesc('created_at');

        if ($request->has('status')) {
            $status = $request->get('status');
            if ($status === 'active') {
                $query->whereNull('revoked_at')
                      ->where(function ($q) {
                          $q->whereNull('expires_at')->orWhere('expires_at', '>', now());
                      })
                      ->where(function ($q) {
                          $q->whereNull('access_limit')->orWhereColumn('access_count', '<', 'access_limit');
                      });
            } elseif ($status === 'revoked') {
                $query->whereNotNull('revoked_at');
            } elseif ($status === 'expired') {
                $query->whereNotNull('expires_at')->where('expires_at', '<=', now());
            } elseif ($status === 'limit_reached') {
                $query->whereNotNull('access_limit')->whereColumn('access_count', '>=', 'access_limit');
            }
        }

        $links = $query->paginate(20);

        // Transform to append computed status and protect token hash
        $links->getCollection()->transform(function ($link) {
            $computedStatus = 'active';
            if ($link->revoked_at !== null) {
                $computedStatus = 'revoked';
            } elseif ($link->expires_at !== null && $link->expires_at->isPast()) {
                $computedStatus = 'expired';
            } elseif ($link->access_limit !== null && $link->access_count >= $link->access_limit) {
                $computedStatus = 'limit_reached';
            }

            return [
                'id' => $link->id,
                'buyer_name' => $link->buyer_name,
                'company' => $link->company,
                'email' => $link->email,
                'access_tier' => $link->access_tier,
                'access_limit' => $link->access_limit,
                'access_count' => $link->access_count,
                'expires_at' => $link->expires_at ? $link->expires_at->toIso8601String() : null,
                'revoked_at' => $link->revoked_at ? $link->revoked_at->toIso8601String() : null,
                'status' => $computedStatus,
                'internal_notes' => $link->internal_notes,
                'created_by' => $link->creator ? $link->creator->name : null,
                'created_at' => $link->created_at->toIso8601String(),
            ];
        });

        $kpis = [
            'total_links' => BuyerDemoAccess::count(),
            'active_links' => BuyerDemoAccess::whereNull('revoked_at')
                ->where(function ($q) {
                    $q->whereNull('expires_at')->orWhere('expires_at', '>', now());
                })
                ->where(function ($q) {
                    $q->whereNull('access_limit')->orWhereColumn('access_count', '<', 'access_limit');
                })->count(),
            'revoked_links' => BuyerDemoAccess::whereNotNull('revoked_at')->count(),
            'total_private_sessions' => BuyerDemoSession::where('is_private', true)->count(),
        ];

        return response()->json([
            'status' => 'success',
            'data' => $links,
            'kpis' => $kpis,
        ]);
    }

    /**
     * Generate a new private buyer demo link.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'buyer_name' => 'required|string|max:100',
            'company' => 'nullable|string|max:100',
            'email' => 'nullable|email|max:150',
            'access_tier' => 'nullable|string|in:standard,vip,evaluator',
            'access_limit' => 'nullable|integer|min:1|max:1000',
            'expires_in_days' => 'nullable|integer|min:1|max:365',
            'internal_notes' => 'nullable|string|max:2000',
        ]);

        $expiresAt = null;
        if (!empty($validated['expires_in_days'])) {
            $expiresAt = now()->addDays((int) $validated['expires_in_days']);
        }

        $result = BuyerDemoAccess::createSecureLink([
            'buyer_name' => $validated['buyer_name'],
            'company' => $validated['company'] ?? null,
            'email' => $validated['email'] ?? null,
            'access_tier' => $validated['access_tier'] ?? 'standard',
            'access_limit' => $validated['access_limit'] ?? 15,
            'expires_at' => $expiresAt,
            'internal_notes' => $validated['internal_notes'] ?? null,
            'created_by' => $request->user()->id ?? null,
        ]);

        $model = $result['model'];
        $plainToken = $result['plain_token'];

        return response()->json([
            'status' => 'success',
            'message' => 'Private buyer demo link created successfully.',
            'data' => [
                'id' => $model->id,
                'buyer_name' => $model->buyer_name,
                'company' => $model->company,
                'access_tier' => $model->access_tier,
                'access_limit' => $model->access_limit,
                'expires_at' => $model->expires_at ? $model->expires_at->toIso8601String() : null,
                'plain_token' => $plainToken,
                'demo_url' => url('/buyer-demo?token=' . $plainToken),
            ],
        ], 201);
    }

    /**
     * Revoke an active private demo link.
     */
    public function revoke(int $id): JsonResponse
    {
        $access = BuyerDemoAccess::findOrFail($id);

        if ($access->revoked_at !== null) {
            return response()->json([
                'status' => 'error',
                'message' => 'This link is already revoked.',
            ], 400);
        }

        $access->revoke();

        return response()->json([
            'status' => 'success',
            'message' => 'Buyer demo link revoked successfully. Future access attempts will be blocked.',
        ]);
    }

    /**
     * Return aggregate analytics for buyer demo engagement.
     */
    public function analytics(): JsonResponse
    {
        $totalSessions = BuyerDemoSession::count();
        $completedSessions = BuyerDemoSession::whereNotNull('completed_at')->count();
        $completionRate = $totalSessions > 0 ? round(($completedSessions / $totalSessions) * 100, 1) : 0;

        $feedbackCount = BuyerDemoSession::whereNotNull('feedback_score')->count();
        $avgFeedback = $feedbackCount > 0 ? round(BuyerDemoSession::whereNotNull('feedback_score')->avg('feedback_score'), 2) : 0;

        // Sections popularity breakdown
        $recentSessions = BuyerDemoSession::select('sections_viewed')->whereNotNull('sections_viewed')->limit(200)->get();
        $sectionCounts = [];
        foreach ($recentSessions as $sess) {
            $sections = $sess->sections_viewed ?? [];
            foreach ($sections as $sec) {
                $sectionCounts[$sec] = ($sectionCounts[$sec] ?? 0) + 1;
            }
        }
        arsort($sectionCounts);

        return response()->json([
            'status' => 'success',
            'data' => [
                'total_sessions' => $totalSessions,
                'completed_sessions' => $completedSessions,
                'completion_rate_pct' => $completionRate,
                'private_sessions' => BuyerDemoSession::where('is_private', true)->count(),
                'public_sessions' => BuyerDemoSession::where('is_private', false)->count(),
                'avg_feedback_score' => $avgFeedback,
                'feedback_total' => $feedbackCount,
                'popular_sections' => array_slice($sectionCounts, 0, 8, true),
            ],
        ]);
    }
}
