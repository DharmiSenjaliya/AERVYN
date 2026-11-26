<?php

namespace App\Http\Controllers\Social;

use App\Http\Controllers\Controller;
use App\Models\BlockedPlayer;
use App\Models\Challenge;
use App\Models\FriendRequest;
use App\Models\Friendship;
use App\Models\PlayerProgress;
use App\Models\User;
use App\Services\PlayerProgressionService;
use Illuminate\Http\Request;

class PlayerSearchController extends Controller
{
    /**
     * Search players by username or display name with relationship tags.
     */
    public function search(Request $request)
    {
        $currentUser = $request->user();
        $query = trim($request->query('q', ''));

        if (strlen($query) < 2) {
            return response()->json([
                'status' => 'success',
                'total' => 0,
                'data' => [],
                'message' => 'Please provide at least 2 characters to search.',
            ]);
        }

        // Get blocked IDs
        $blockedIds = BlockedPlayer::where('user_id', $currentUser->id)
            ->pluck('blocked_user_id')
            ->toArray();

        $blockedByIds = BlockedPlayer::where('blocked_user_id', $currentUser->id)
            ->pluck('user_id')
            ->toArray();

        $excludeIds = array_unique(array_merge([$currentUser->id], $blockedIds, $blockedByIds));

        // Query active players
        $players = User::where('role', 'player')
            ->where('is_active', true)
            ->whereNotIn('id', $excludeIds)
            ->where(function ($q) use ($query) {
                $q->where('name', 'LIKE', "%{$query}%")
                  ->orWhere('display_name', 'LIKE', "%{$query}%");
            })
            ->with(['achievements', 'allProgress'])
            ->paginate(15);

        // Fetch current user's relationships in bulk
        $friendIds = Friendship::where('user_id', $currentUser->id)->pluck('friend_id')->toArray();
        $sentRequestIds = FriendRequest::where('sender_id', $currentUser->id)
            ->where('status', 'pending')
            ->pluck('receiver_id')
            ->toArray();
        $receivedRequestIds = FriendRequest::where('receiver_id', $currentUser->id)
            ->where('status', 'pending')
            ->pluck('sender_id')
            ->toArray();

        $results = $players->getCollection()->map(function ($p) use (
            $friendIds,
            $sentRequestIds,
            $receivedRequestIds
        ) {
            $progression = PlayerProgressionService::getLevelInfo($p->xp);
            $completedWorlds = $p->allProgress->where('is_completed', true)->count();
            $achievementsCount = $p->achievements->count();

            // Determine state
            $relationship = 'not_connected';
            if (in_array($p->id, $friendIds)) {
                $relationship = 'friends';
            } elseif (in_array($p->id, $sentRequestIds)) {
                $relationship = 'request_sent';
            } elseif (in_array($p->id, $receivedRequestIds)) {
                $relationship = 'request_received';
            }

            return [
                'id' => $p->id,
                'username' => $p->name,
                'display_name' => $p->display_name ?: $p->name,
                'avatar' => $p->avatar ?: 'avatar_chrono_walker',
                'rank_title' => $progression['rank_title'],
                'level' => $progression['level'],
                'xp' => $p->xp,
                'completed_worlds' => $completedWorlds,
                'achievements_count' => $achievementsCount,
                'relationship' => $relationship,
            ];
        });

        return response()->json([
            'status' => 'success',
            'current_page' => $players->currentPage(),
            'total' => $players->total(),
            'last_page' => $players->lastPage(),
            'data' => $results,
        ]);
    }

    /**
     * View public profile of another player respecting privacy controls.
     */
    public function publicProfile(Request $request, $id)
    {
        $currentUser = $request->user();
        $targetUser = User::where('id', $id)->where('is_active', true)->first();

        if (!$targetUser) {
            return response()->json(['status' => 'error', 'message' => 'Player not found.'], 404);
        }

        // Check blocks
        if ($currentUser->hasBlocked($targetUser->id)) {
            return response()->json([
                'status' => 'error',
                'message' => 'You have blocked this player.',
                'is_blocked' => true,
            ], 403);
        }

        if ($targetUser->hasBlocked($currentUser->id)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Player profile is unavailable.',
            ], 403);
        }

        $privacy = $targetUser->getPrivacy();
        if (!$privacy->show_public_profile && $currentUser->id !== $targetUser->id) {
            return response()->json([
                'status' => 'restricted',
                'message' => 'This player has set their profile to private.',
                'data' => [
                    'id' => $targetUser->id,
                    'username' => $targetUser->name,
                    'display_name' => $targetUser->display_name ?: $targetUser->name,
                    'avatar' => $targetUser->avatar ?: 'avatar_chrono_walker',
                    'is_private' => true,
                ]
            ]);
        }

        $progression = PlayerProgressionService::getLevelInfo($targetUser->xp);
        $allProgress = PlayerProgress::where('user_id', $targetUser->id)->get();
        $completedWorlds = $allProgress->where('is_completed', true)->count();
        $campaignCompleted = $allProgress->contains('campaign_completed', true);
        $endingSelected = $privacy->show_selected_ending
            ? $allProgress->firstWhere('ending_selected', '!==', null)?->ending_selected
            : null;

        // Challenge stats if permitted
        $challengeStats = null;
        if ($privacy->show_challenge_statistics) {
            $totalChallenges = Challenge::where(function ($q) use ($targetUser) {
                $q->where('challenger_id', $targetUser->id)
                  ->orWhere('opponent_id', $targetUser->id);
            })->where('status', 'completed')->count();

            $wins = Challenge::where('winner_id', $targetUser->id)->count();

            $challengeStats = [
                'total_completed' => $totalChallenges,
                'wins' => $wins,
                'win_rate' => $totalChallenges > 0 ? round(($wins / $totalChallenges) * 100, 1) : 0,
            ];
        }

        // Achievements list if permitted
        $achievements = [];
        if ($privacy->show_achievements) {
            $achievements = $targetUser->achievements()
                ->take(8)
                ->get(['achievements.id', 'achievements.title', 'achievements.description', 'achievements.icon', 'achievements.xp_reward']);
        }

        return response()->json([
            'status' => 'success',
            'data' => [
                'id' => $targetUser->id,
                'username' => $targetUser->name,
                'display_name' => $targetUser->display_name ?: $targetUser->name,
                'avatar' => $targetUser->avatar ?: 'avatar_chrono_walker',
                'bio' => $targetUser->bio,
                'rank_title' => $progression['rank_title'],
                'level' => $progression['level'],
                'xp' => $targetUser->xp,
                'registration_date' => $targetUser->created_at->toFormattedDateString(),
                'completed_worlds' => $completedWorlds,
                'campaign_completed' => $campaignCompleted,
                'ending_selected' => $endingSelected,
                'achievements_count' => $targetUser->achievements()->count(),
                'recent_achievements' => $achievements,
                'challenge_stats' => $challengeStats,
                'is_friend' => $currentUser->isFriendWith($targetUser->id),
                'can_send_friend_request' => $privacy->allow_friend_requests && !$currentUser->isFriendWith($targetUser->id),
            ]
        ]);
    }
}
