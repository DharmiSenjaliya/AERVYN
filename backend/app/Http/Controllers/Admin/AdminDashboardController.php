<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\PlayerProgress;
use App\Models\GameSession;
use App\Models\Feedback;
use App\Models\World;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class AdminDashboardController extends Controller
{
    public function stats(Request $request): JsonResponse
    {
        // 1. Player Metrics
        $totalRegisteredPlayers = User::where('role', 'player')->count();
        $newPlayersToday = User::where('role', 'player')->whereDate('created_at', today())->count();
        $newPlayersThisWeek = User::where('role', 'player')->where('created_at', '>=', now()->subDays(7))->count();
        
        $activePlayers = User::where('role', 'player')
            ->where(function ($q) {
                $q->where('last_login_at', '>=', now()->subDays(7))
                  ->orWhereHas('sessions', function ($sq) {
                      $sq->where('started_at', '>=', now()->subDays(7));
                  });
            })->count();

        // 2. Gameplay & Session Metrics
        $totalGameSessions = GameSession::count();
        $completedCampaigns = PlayerProgress::where('campaign_completed', true)->count();
        $totalWorldsCompleted = PlayerProgress::where('is_completed', true)->count();
        
        // Count of all mission objectives/steps achieved
        $totalMissionsCompleted = PlayerProgress::sum('current_step');

        // Completion Rate (% of players who completed at least one world)
        $playersWithCompletedWorld = PlayerProgress::where('is_completed', true)->distinct('user_id')->count('user_id');
        $averageCompletionRate = $totalRegisteredPlayers > 0
            ? round(($playersWithCompletedWorld / $totalRegisteredPlayers) * 100, 1)
            : 0;

        // 3. Support & Feedback Metrics
        $totalFeedback = Feedback::count();
        $reportedIssues = Feedback::whereIn('status', ['new', 'in_progress'])->count();

        // 4. World Breakdown
        $worldStats = World::orderBy('display_order')->get()->map(function ($world) {
            $progressCount = PlayerProgress::where('world_id', $world->id)->count();
            $completedCount = PlayerProgress::where('world_id', $world->id)->where('is_completed', true)->count();
            return [
                'id' => $world->id,
                'title' => $world->title,
                'epoch' => $world->epoch,
                'is_active' => $world->is_active,
                'active_players' => $progressCount,
                'completed_players' => $completedCount,
            ];
        });

        // 5. Ending Breakdown (Ending A vs Ending B)
        $endingA = PlayerProgress::where('ending_selected', 'ending_a')->count();
        $endingB = PlayerProgress::where('ending_selected', 'ending_b')->count();

        // 6. Recent Registrations
        $recentPlayers = User::where('role', 'player')
            ->orderByDesc('created_at')
            ->limit(5)
            ->get(['id', 'name', 'email', 'level', 'xp', 'is_active', 'is_banned', 'created_at', 'last_login_at']);

        // 7. Recent Sessions
        $recentSessions = GameSession::with('user:id,name,email')
            ->orderByDesc('started_at')
            ->limit(5)
            ->get();

        return response()->json([
            'success' => true,
            'metrics' => [
                'total_registered_players' => $totalRegisteredPlayers,
                'active_players' => $activePlayers,
                'new_players_today' => $newPlayersToday,
                'new_players_this_week' => $newPlayersThisWeek,
                'total_game_sessions' => $totalGameSessions,
                'completed_campaigns' => $completedCampaigns,
                'total_worlds_completed' => $totalWorldsCompleted,
                'total_missions_completed' => (int) $totalMissionsCompleted,
                'average_completion_rate' => $averageCompletionRate,
                'total_feedback' => $totalFeedback,
                'reported_issues' => $reportedIssues,
            ],
            'world_stats' => $worldStats,
            'endings' => [
                'ending_a' => $endingA,
                'ending_b' => $endingB,
                'total' => $endingA + $endingB,
            ],
            'recent_players' => $recentPlayers,
            'recent_sessions' => $recentSessions,
        ]);
    }
}
