<?php

namespace App\Http\Controllers\Social;

use App\Http\Controllers\Controller;
use App\Models\Challenge;
use App\Models\FriendRequest;
use App\Models\Friendship;
use App\Models\SocialNotification;
use App\Services\SocialActivityService;
use Illuminate\Http\Request;

class SocialHubController extends Controller
{
    /**
     * Get player social hub summary.
     */
    public function index(Request $request)
    {
        $user = $request->user();

        // 1. Friend Counts
        $friendsCount = Friendship::where('user_id', $user->id)->count();

        // 2. Pending Requests
        $pendingReceivedCount = FriendRequest::where('receiver_id', $user->id)
            ->where('status', 'pending')
            ->count();

        // 3. Active Challenges
        $activeChallengesCount = Challenge::where(function ($q) use ($user) {
            $q->where('challenger_id', $user->id)
              ->orWhere('opponent_id', $user->id);
        })
        ->whereIn('status', ['pending', 'active'])
        ->count();

        // 4. Unread Notifications
        $unreadNotificationsCount = SocialNotification::where('user_id', $user->id)
            ->where('is_read', false)
            ->count();

        // 5. Recent Activity Feed
        $activityFeed = SocialActivityService::getFeed($user, 15);

        return response()->json([
            'status' => 'success',
            'data' => [
                'friends_count' => $friendsCount,
                'pending_requests_count' => $pendingReceivedCount,
                'active_challenges_count' => $activeChallengesCount,
                'unread_notifications_count' => $unreadNotificationsCount,
                'is_social_suspended' => (bool) $user->is_social_suspended,
                'social_suspended_reason' => $user->social_suspended_reason,
                'activity_feed' => $activityFeed,
            ]
        ]);
    }
}
