<?php

namespace App\Http\Controllers\Social;

use App\Http\Controllers\Controller;
use App\Models\BlockedPlayer;
use App\Models\FriendRequest;
use App\Models\Friendship;
use App\Models\User;
use Illuminate\Http\Request;

class BlockController extends Controller
{
    /**
     * List all players blocked by the authenticated user.
     */
    public function index(Request $request)
    {
        $user = $request->user();

        $blocks = BlockedPlayer::where('user_id', $user->id)
            ->with('blockedUser')
            ->latest()
            ->get()
            ->map(function ($b) {
                $target = $b->blockedUser;
                return [
                    'id' => $b->id,
                    'blocked_user_id' => $b->blocked_user_id,
                    'username' => $target?->name ?? 'User',
                    'display_name' => $target?->display_name ?: ($target?->name ?? 'User'),
                    'avatar' => $target?->avatar ?: 'avatar_chrono_walker',
                    'reason' => $b->reason,
                    'blocked_at' => $b->created_at->toFormattedDateString(),
                ];
            });

        return response()->json([
            'status' => 'success',
            'data' => $blocks,
        ]);
    }

    /**
     * Block a player.
     */
    public function block(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'blocked_user_id' => 'required|integer|exists:users,id',
            'reason' => 'nullable|string|max:255',
        ]);

        $blockedUserId = (int) $request->blocked_user_id;

        if ($user->id === $blockedUserId) {
            return response()->json(['status' => 'error', 'message' => 'You cannot block yourself.'], 422);
        }

        $target = User::findOrFail($blockedUserId);

        // 1. Create block record
        BlockedPlayer::firstOrCreate(
            ['user_id' => $user->id, 'blocked_user_id' => $blockedUserId],
            ['reason' => $request->input('reason', 'Blocked by player')]
        );

        // 2. Sever any active friendships
        Friendship::where(function ($q) use ($user, $blockedUserId) {
            $q->where('user_id', $user->id)->where('friend_id', $blockedUserId);
        })->orWhere(function ($q) use ($user, $blockedUserId) {
            $q->where('user_id', $blockedUserId)->where('friend_id', $user->id);
        })->delete();

        // 3. Invalidate any pending friend requests
        FriendRequest::where(function ($q) use ($user, $blockedUserId) {
            $q->where('sender_id', $user->id)->where('receiver_id', $blockedUserId);
        })->orWhere(function ($q) use ($user, $blockedUserId) {
            $q->where('sender_id', $blockedUserId)->where('receiver_id', $user->id);
        })->where('status', 'pending')
          ->update(['status' => 'rejected']);

        return response()->json([
            'status' => 'success',
            'message' => "Player {$target->display_name} has been blocked.",
        ]);
    }

    /**
     * Unblock a player.
     */
    public function unblock(Request $request, $blockedUserId)
    {
        $user = $request->user();

        $deleted = BlockedPlayer::where('user_id', $user->id)
            ->where('blocked_user_id', $blockedUserId)
            ->delete();

        if (!$deleted) {
            return response()->json(['status' => 'error', 'message' => 'Block record not found.'], 404);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Player unblocked successfully.',
        ]);
    }
}
