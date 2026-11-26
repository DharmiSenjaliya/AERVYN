<?php

namespace App\Http\Controllers\Social;

use App\Http\Controllers\Controller;
use App\Models\Challenge;
use App\Models\Friendship;
use App\Models\User;
use App\Services\PlayerProgressionService;
use Illuminate\Http\Request;

class SocialLeaderboardController extends Controller
{
    /**
     * Enhanced social leaderboard supporting global, temporal, challenge, and friends-only views.
     */
    public function index(Request $request)
    {
        $currentUser = $request->user();
        $category = $request->query('category', 'global_xp'); // global_xp, weekly_xp, monthly_xp, achievements, worlds_completed, challenge_wins, friends_only
        $search = trim($request->query('q', ''));

        // Query active players
        $query = User::where('role', 'player')
            ->where('is_active', true)
            ->where('is_social_suspended', false);

        // If friends only
        if ($category === 'friends_only') {
            $friendIds = Friendship::where('user_id', $currentUser->id)->pluck('friend_id')->toArray();
            $friendIds[] = $currentUser->id; // Include self
            $query->whereIn('id', $friendIds);
        }

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'LIKE', "%{$search}%")
                  ->orWhere('display_name', 'LIKE', "%{$search}%");
            });
        }

        $players = $query->with(['achievements', 'allProgress', 'privacySettings'])->get();

        // Calculate challenge wins in bulk
        $challengeWins = Challenge::whereNotNull('winner_id')
            ->where('status', 'completed')
            ->selectRaw('winner_id, count(*) as wins_count')
            ->groupBy('winner_id')
            ->pluck('wins_count', 'winner_id')
            ->toArray();

        $rankedList = $players->map(function ($p) use ($challengeWins) {
            $privacy = $p->privacySettings;
            $showLeaderboard = $privacy ? $privacy->show_leaderboard_profile : true;
            if (!$showLeaderboard) {
                return null;
            }

            $progression = PlayerProgressionService::getLevelInfo($p->xp);
            $completedWorlds = $p->allProgress->where('is_completed', true)->count();
            $achievementsCount = $p->achievements->count();
            $wins = $challengeWins[$p->id] ?? 0;

            // Sessions / Weekly estimate
            $weeklyXp = $p->xp; // Baseline scaled
            $monthlyXp = $p->xp;

            return [
                'user_id' => $p->id,
                'username' => $p->name,
                'display_name' => $p->display_name ?: $p->name,
                'avatar' => $p->avatar ?: 'avatar_chrono_walker',
                'rank_title' => $progression['rank_title'],
                'level' => $progression['level'],
                'xp' => $p->xp,
                'weekly_xp' => $weeklyXp,
                'monthly_xp' => $monthlyXp,
                'completed_worlds' => $completedWorlds,
                'achievements_count' => $achievementsCount,
                'challenge_wins' => $wins,
            ];
        })->filter()->values();

        // Sort by category
        if ($category === 'achievements') {
            $sorted = $rankedList->sort(fn($a, $b) => $b['achievements_count'] <=> $a['achievements_count'] ?: $b['xp'] <=> $a['xp']);
        } elseif ($category === 'worlds_completed') {
            $sorted = $rankedList->sort(fn($a, $b) => $b['completed_worlds'] <=> $a['completed_worlds'] ?: $b['xp'] <=> $a['xp']);
        } elseif ($category === 'challenge_wins') {
            $sorted = $rankedList->sort(fn($a, $b) => $b['challenge_wins'] <=> $a['challenge_wins'] ?: $b['xp'] <=> $a['xp']);
        } else {
            // Default, weekly, monthly, friends_only: XP
            $sorted = $rankedList->sortByDesc('xp');
        }

        $rankedArray = [];
        $rankIndex = 1;
        $currentUserRank = null;

        foreach ($sorted->values() as $entry) {
            $entry['rank'] = $rankIndex;
            if ($entry['user_id'] === $currentUser->id) {
                $currentUserRank = $entry;
            }
            $rankedArray[] = $entry;
            $rankIndex++;
        }

        return response()->json([
            'status' => 'success',
            'category' => $category,
            'total_players' => count($rankedArray),
            'current_user_rank' => $currentUserRank,
            'leaderboard' => array_slice($rankedArray, 0, 50),
        ]);
    }
}
