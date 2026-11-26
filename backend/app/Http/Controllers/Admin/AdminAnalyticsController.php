<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\PlayerProgress;
use App\Models\GameSession;
use App\Models\World;
use App\Models\Mission;
use App\Models\Collectible;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class AdminAnalyticsController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $range = $request->input('range', '30d');
        $startDate = match ($range) {
            '7d' => now()->subDays(7),
            '90d' => now()->subDays(90),
            'all' => now()->subYears(5),
            default => now()->subDays(30),
        };

        // 1. Core Activity Metrics (DAU, WAU, MAU)
        $totalRegistered = User::where('role', 'player')->count();
        $wau = User::where('role', 'player')
            ->where(function ($q) {
                $q->where('last_login_at', '>=', now()->subDays(7))
                  ->orWhereHas('sessions', fn($sq) => $sq->where('started_at', '>=', now()->subDays(7)));
            })->count();

        $mau = User::where('role', 'player')
            ->where(function ($q) {
                $q->where('last_login_at', '>=', now()->subDays(30))
                  ->orWhereHas('sessions', fn($sq) => $sq->where('started_at', '>=', now()->subDays(30)));
            })->count();

        // Daily Registrations Trend over selected range
        $registrationsTrend = User::where('role', 'player')
            ->where('created_at', '>=', $startDate)
            ->select(DB::raw('DATE(created_at) as date'), DB::raw('count(*) as count'))
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        // Daily Active Sessions Trend over selected range
        $sessionsTrend = GameSession::where('started_at', '>=', $startDate)
            ->select(DB::raw('DATE(started_at) as date'), DB::raw('count(*) as session_count'), DB::raw('round(avg(duration_seconds) / 60) as avg_duration_mins'))
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        // 2. Session Durations
        $totalSessionsCount = GameSession::count();
        $avgDurationSeconds = GameSession::avg('duration_seconds') ?: 0;
        $avgDurationMins = round($avgDurationSeconds / 60, 1);

        // 3. World Popularity
        $worldPopularity = World::orderBy('display_order')->get()->map(function ($w) {
            $sessionsCount = GameSession::where('world_id', $w->id)->count();
            $playersCount = PlayerProgress::where('world_id', $w->id)->count();
            $completedCount = PlayerProgress::where('world_id', $w->id)->where('is_completed', true)->count();
            return [
                'world_id' => $w->id,
                'title' => $w->title,
                'epoch' => $w->epoch,
                'sessions' => $sessionsCount,
                'players' => $playersCount,
                'completions' => $completedCount,
            ];
        });

        // 4. Campaign & Endings Distribution
        $completedCampaigns = PlayerProgress::where('campaign_completed', true)->count();
        $campaignCompletionRate = $totalRegistered > 0 ? round(($completedCampaigns / $totalRegistered) * 100, 1) : 0;

        $endingA = PlayerProgress::where('ending_selected', 'ending_a')->count();
        $endingB = PlayerProgress::where('ending_selected', 'ending_b')->count();
        $totalEndings = $endingA + $endingB;
        $endingARate = $totalEndings > 0 ? round(($endingA / $totalEndings) * 100, 1) : 50.0;
        $endingBRate = $totalEndings > 0 ? round(($endingB / $totalEndings) * 100, 1) : 50.0;

        // 5. Most Collected Items
        $allProgress = PlayerProgress::whereNotNull('inventory')->get(['inventory']);
        $itemTally = [];
        foreach ($allProgress as $prog) {
            if (is_array($prog->inventory)) {
                foreach ($prog->inventory as $item) {
                    $itemId = is_array($item) ? ($item['id'] ?? 'item') : (string)$item;
                    $itemTally[$itemId] = ($itemTally[$itemId] ?? 0) + 1;
                }
            }
        }
        arsort($itemTally);
        $topItems = [];
        foreach (array_slice($itemTally, 0, 6, true) as $itemId => $count) {
            $collectible = Collectible::find($itemId);
            $topItems[] = [
                'id' => $itemId,
                'name' => $collectible?->name ?? ucwords(str_replace('_', ' ', $itemId)),
                'times_collected' => $count,
            ];
        }

        // 6. Commonly Abandoned Missions / Drop-offs
        $dropoffs = [];
        $worlds = World::all();
        foreach ($worlds as $world) {
            $maxStep = Mission::where('world_id', $world->id)->max('step_number') ?: 1;
            // Players stuck in an uncompleted state
            $stuckProgress = PlayerProgress::where('world_id', $world->id)
                ->where('is_completed', false)
                ->select('current_step', DB::raw('count(*) as player_count'))
                ->groupBy('current_step')
                ->orderByDesc('player_count')
                ->first();

            if ($stuckProgress) {
                $mission = Mission::where('world_id', $world->id)
                    ->where('step_number', $stuckProgress->current_step)
                    ->first();
                $dropoffs[] = [
                    'world_id' => $world->id,
                    'world_title' => $world->title,
                    'step_number' => $stuckProgress->current_step,
                    'mission_title' => $mission?->title ?? "Step {$stuckProgress->current_step}",
                    'players_at_step' => $stuckProgress->player_count,
                ];
            }
        }

        $hasSufficientData = $totalRegistered >= 5 && $totalSessionsCount >= 3;

        return response()->json([
            'success' => true,
            'has_sufficient_data' => $hasSufficientData,
            'summary' => [
                'total_players' => $totalRegistered,
                'wau' => $wau,
                'mau' => $mau,
                'total_sessions' => $totalSessionsCount,
                'avg_session_duration_mins' => $avgDurationMins,
                'campaign_completion_rate' => $campaignCompletionRate,
                'completed_campaigns' => $completedCampaigns,
            ],
            'registrations_trend' => $registrationsTrend,
            'sessions_trend' => $sessionsTrend,
            'world_popularity' => $worldPopularity,
            'endings' => [
                'ending_a' => $endingA,
                'ending_b' => $endingB,
                'ending_a_rate' => $endingARate,
                'ending_b_rate' => $endingBRate,
                'total' => $totalEndings,
            ],
            'top_items' => $topItems,
            'dropoffs' => $dropoffs,
        ]);
    }
}
