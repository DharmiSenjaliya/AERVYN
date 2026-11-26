<?php

namespace App\Http\Controllers\Player;

use App\Http\Controllers\Controller;
use App\Models\PlayerProgress;
use App\Models\User;
use App\Services\PlayerProgressionService;
use Illuminate\Http\Request;

class PlayerLeaderboardController extends Controller
{
    /**
     * Get global leaderboard rankings.
     */
    public function index(Request $request)
    {
        $currentUser = $request->user();
        $filter = $request->query('filter', 'xp'); // xp, campaign, achievements

        // Query active players
        $players = User::where('role', 'player')
            ->where('is_active', true)
            ->with(['achievements', 'allProgress'])
            ->get();

        $rankedList = $players->map(function ($p) {
            $progression = PlayerProgressionService::getLevelInfo($p->xp);
            $completedWorlds = $p->allProgress->where('is_completed', true)->count();
            $campaignCompleted = $p->allProgress->contains('campaign_completed', true);
            $endingSelected = $p->allProgress->firstWhere('ending_selected', '!==', null)?->ending_selected;
            $achievementsCount = $p->achievements->count();
            $totalPlaytime = $p->allProgress->sum('playtime_seconds');

            return [
                'user_id' => $p->id,
                'username' => $p->name,
                'display_name' => $p->display_name ?: $p->name,
                'avatar' => $p->avatar ?: 'avatar_chrono_walker',
                'level' => $progression['level'],
                'xp' => $p->xp,
                'rank_title' => $progression['rank_title'],
                'completed_worlds' => $completedWorlds,
                'campaign_completed' => $campaignCompleted,
                'ending_selected' => $endingSelected,
                'achievements_count' => $achievementsCount,
                'total_playtime_seconds' => $totalPlaytime,
                'created_at' => $p->created_at->toFormattedDateString(),
            ];
        });

        // Sort based on filter
        if ($filter === 'campaign') {
            $sorted = $rankedList->sort(function ($a, $b) {
                if ($a['campaign_completed'] !== $b['campaign_completed']) {
                    return $b['campaign_completed'] <=> $a['campaign_completed'];
                }
                if ($a['completed_worlds'] !== $b['completed_worlds']) {
                    return $b['completed_worlds'] <=> $a['completed_worlds'];
                }
                return $b['xp'] <=> $a['xp'];
            });
        } elseif ($filter === 'achievements') {
            $sorted = $rankedList->sort(function ($a, $b) {
                if ($a['achievements_count'] !== $b['achievements_count']) {
                    return $b['achievements_count'] <=> $a['achievements_count'];
                }
                return $b['xp'] <=> $a['xp'];
            });
        } else {
            // Default: XP
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
            'filter' => $filter,
            'total_players' => count($rankedArray),
            'current_user_rank' => $currentUserRank,
            'leaderboard' => array_slice($rankedArray, 0, 50),
        ]);
    }
}
