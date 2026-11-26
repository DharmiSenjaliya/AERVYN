<?php

namespace App\Http\Controllers\Social;

use App\Http\Controllers\Controller;
use App\Models\BlockedPlayer;
use App\Models\FriendRequest;
use App\Models\Friendship;
use App\Models\User;
use App\Services\PlayerProgressionService;
use App\Services\SocialNotificationService;
use Illuminate\Http\Request;

class FriendController extends Controller
{
    /**
     * List all accepted friends for the authenticated player.
     */
    public function index(Request $request)
    {
        $user = $request->user();

        $friendships = Friendship::where('user_id', $user->id)
            ->with(['friend.achievements', 'friend.allProgress'])
            ->get();

        $friends = $friendships->map(function ($f) {
            $friend = $f->friend;
            if (!$friend) return null;

            $progression = PlayerProgressionService::getLevelInfo($friend->xp);
            $completedWorlds = $friend->allProgress->where('is_completed', true)->count();

            return [
                'id' => $friend->id,
                'username' => $friend->name,
                'display_name' => $friend->display_name ?: $friend->name,
                'avatar' => $friend->avatar ?: 'avatar_chrono_walker',
                'rank_title' => $progression['rank_title'],
                'level' => $progression['level'],
                'xp' => $friend->xp,
                'completed_worlds' => $completedWorlds,
                'achievements_count' => $friend->achievements->count(),
                'friends_since' => $f->created_at->toFormattedDateString(),
            ];
        })->filter()->values();

        return response()->json([
            'status' => 'success',
            'total' => $friends->count(),
            'data' => $friends,
        ]);
    }

    /**
     * Get pending received and sent friend requests.
     */
    public function requests(Request $request)
    {
        $user = $request->user();

        // Received
        $received = FriendRequest::where('receiver_id', $user->id)
            ->where('status', 'pending')
            ->with('sender')
            ->latest()
            ->get()
            ->map(function ($r) {
                $sender = $r->sender;
                $prog = $sender ? PlayerProgressionService::getLevelInfo($sender->xp) : null;
                return [
                    'request_id' => $r->id,
                    'user_id' => $sender?->id,
                    'username' => $sender?->name,
                    'display_name' => $sender?->display_name ?: $sender?->name,
                    'avatar' => $sender?->avatar ?: 'avatar_chrono_walker',
                    'rank_title' => $prog ? $prog['rank_title'] : 'Novice Explorer',
                    'level' => $prog ? $prog['level'] : 1,
                    'sent_at' => $r->created_at->diffForHumans(),
                ];
            });

        // Sent
        $sent = FriendRequest::where('sender_id', $user->id)
            ->where('status', 'pending')
            ->with('receiver')
            ->latest()
            ->get()
            ->map(function ($r) {
                $receiver = $r->receiver;
                $prog = $receiver ? PlayerProgressionService::getLevelInfo($receiver->xp) : null;
                return [
                    'request_id' => $r->id,
                    'user_id' => $receiver?->id,
                    'username' => $receiver?->name,
                    'display_name' => $receiver?->display_name ?: $receiver?->name,
                    'avatar' => $receiver?->avatar ?: 'avatar_chrono_walker',
                    'rank_title' => $prog ? $prog['rank_title'] : 'Novice Explorer',
                    'level' => $prog ? $prog['level'] : 1,
                    'sent_at' => $r->created_at->diffForHumans(),
                ];
            });

        return response()->json([
            'status' => 'success',
            'received' => $received,
            'sent' => $sent,
        ]);
    }

    /**
     * Send a friend request.
     */
    public function sendRequest(Request $request)
    {
        $sender = $request->user();

        if ($sender->is_social_suspended) {
            return response()->json([
                'status' => 'error',
                'message' => 'Your social capabilities are currently suspended: ' . ($sender->social_suspended_reason ?: 'Contact staff.')
            ], 403);
        }

        $request->validate([
            'receiver_id' => 'required|integer|exists:users,id',
        ]);

        $receiverId = (int) $request->receiver_id;

        // 1. Cannot friend self
        if ($sender->id === $receiverId) {
            return response()->json(['status' => 'error', 'message' => 'You cannot send a friend request to yourself.'], 422);
        }

        $receiver = User::findOrFail($receiverId);

        // 2. Check blocks
        if ($sender->hasBlocked($receiverId) || $receiver->hasBlocked($sender->id)) {
            return response()->json(['status' => 'error', 'message' => 'Unable to connect with this player.'], 403);
        }

        // 3. Check receiver's privacy settings
        if (!$receiver->getPrivacy()->allow_friend_requests) {
            return response()->json(['status' => 'error', 'message' => 'This player is not currently accepting friend requests.'], 403);
        }

        // 4. Check already friends
        if ($sender->isFriendWith($receiverId)) {
            return response()->json(['status' => 'error', 'message' => 'You are already friends with this player.'], 422);
        }

        // 5. Check if receiver already sent sender a request (auto-accept!)
        $inverse = FriendRequest::where('sender_id', $receiverId)
            ->where('receiver_id', $sender->id)
            ->where('status', 'pending')
            ->first();

        if ($inverse) {
            $inverse->status = 'accepted';
            $inverse->save();

            Friendship::firstOrCreate(['user_id' => $sender->id, 'friend_id' => $receiverId]);
            Friendship::firstOrCreate(['user_id' => $receiverId, 'friend_id' => $sender->id]);

            SocialNotificationService::notify(
                $receiver,
                'friend_request_accepted',
                'Friend Request Accepted',
                "{$sender->display_name} connected with you! You are now friends.",
                '/social/friends'
            );

            return response()->json([
                'status' => 'success',
                'message' => "Mutual request detected! You and {$receiver->display_name} are now friends.",
                'is_friend' => true,
            ]);
        }

        // 6. Check existing pending request
        $existing = FriendRequest::where('sender_id', $sender->id)
            ->where('receiver_id', $receiverId)
            ->where('status', 'pending')
            ->first();

        if ($existing) {
            return response()->json(['status' => 'error', 'message' => 'Friend request is already pending.'], 422);
        }

        $friendRequest = FriendRequest::updateOrCreate(
            ['sender_id' => $sender->id, 'receiver_id' => $receiverId],
            ['status' => 'pending']
        );

        // Notify receiver
        SocialNotificationService::notify(
            $receiver,
            'friend_request_received',
            'New Friend Request',
            "{$sender->display_name} sent you a friend request.",
            '/social/requests',
            ['sender_id' => $sender->id]
        );

        return response()->json([
            'status' => 'success',
            'message' => "Friend request sent to {$receiver->display_name}.",
            'request' => $friendRequest,
        ], 201);
    }

    /**
     * Accept a received friend request.
     */
    public function acceptRequest(Request $request, $id)
    {
        $user = $request->user();

        $friendRequest = FriendRequest::where('id', $id)
            ->where('receiver_id', $user->id)
            ->where('status', 'pending')
            ->first();

        if (!$friendRequest) {
            return response()->json(['status' => 'error', 'message' => 'Pending request not found.'], 404);
        }

        $sender = User::findOrFail($friendRequest->sender_id);

        $friendRequest->status = 'accepted';
        $friendRequest->save();

        // Create bidirectional friendship
        Friendship::firstOrCreate(['user_id' => $user->id, 'friend_id' => $sender->id]);
        Friendship::firstOrCreate(['user_id' => $sender->id, 'friend_id' => $user->id]);

        // Notify sender
        SocialNotificationService::notify(
            $sender,
            'friend_request_accepted',
            'Friend Request Accepted',
            "{$user->display_name} accepted your friend request! You are now friends.",
            '/social/friends'
        );

        return response()->json([
            'status' => 'success',
            'message' => "You and {$sender->display_name} are now friends.",
        ]);
    }

    /**
     * Reject a received friend request.
     */
    public function rejectRequest(Request $request, $id)
    {
        $user = $request->user();

        $friendRequest = FriendRequest::where('id', $id)
            ->where('receiver_id', $user->id)
            ->where('status', 'pending')
            ->first();

        if (!$friendRequest) {
            return response()->json(['status' => 'error', 'message' => 'Pending request not found.'], 404);
        }

        $friendRequest->status = 'rejected';
        $friendRequest->save();

        return response()->json([
            'status' => 'success',
            'message' => 'Friend request rejected.',
        ]);
    }

    /**
     * Cancel a sent friend request.
     */
    public function cancelRequest(Request $request, $id)
    {
        $user = $request->user();

        $friendRequest = FriendRequest::where('id', $id)
            ->where('sender_id', $user->id)
            ->where('status', 'pending')
            ->first();

        if (!$friendRequest) {
            return response()->json(['status' => 'error', 'message' => 'Pending request not found.'], 404);
        }

        $friendRequest->status = 'cancelled';
        $friendRequest->save();

        return response()->json([
            'status' => 'success',
            'message' => 'Friend request cancelled.',
        ]);
    }

    /**
     * Remove a friend.
     */
    public function removeFriend(Request $request, $friendId)
    {
        $user = $request->user();

        // Remove bidirectional links
        $deleted = Friendship::where(function ($q) use ($user, $friendId) {
            $q->where('user_id', $user->id)->where('friend_id', $friendId);
        })->orWhere(function ($q) use ($user, $friendId) {
            $q->where('user_id', $friendId)->where('friend_id', $user->id);
        })->delete();

        if (!$deleted) {
            return response()->json(['status' => 'error', 'message' => 'Friendship record not found.'], 404);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Friend removed from your friends list.',
        ]);
    }
}
