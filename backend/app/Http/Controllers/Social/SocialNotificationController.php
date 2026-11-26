<?php

namespace App\Http\Controllers\Social;

use App\Http\Controllers\Controller;
use App\Models\SocialNotification;
use Illuminate\Http\Request;

class SocialNotificationController extends Controller
{
    /**
     * Get player's social notifications.
     */
    public function index(Request $request)
    {
        $user = $request->user();

        $notifications = SocialNotification::where('user_id', $user->id)
            ->latest()
            ->paginate(20);

        $unreadCount = SocialNotification::where('user_id', $user->id)
            ->where('is_read', false)
            ->count();

        $items = $notifications->getCollection()->map(function ($n) {
            return [
                'id' => $n->id,
                'type' => $n->type,
                'title' => $n->title,
                'message' => $n->message,
                'action_url' => $n->action_url,
                'data' => $n->data,
                'is_read' => $n->is_read,
                'created_at' => $n->created_at->diffForHumans(),
            ];
        });

        return response()->json([
            'status' => 'success',
            'unread_count' => $unreadCount,
            'total' => $notifications->total(),
            'current_page' => $notifications->currentPage(),
            'data' => $items,
        ]);
    }

    /**
     * Mark a notification as read.
     */
    public function markRead(Request $request, $id)
    {
        $user = $request->user();

        $notification = SocialNotification::where('id', $id)
            ->where('user_id', $user->id)
            ->first();

        if (!$notification) {
            return response()->json(['status' => 'error', 'message' => 'Notification not found.'], 404);
        }

        $notification->is_read = true;
        $notification->read_at = now();
        $notification->save();

        return response()->json([
            'status' => 'success',
            'message' => 'Notification marked as read.',
        ]);
    }

    /**
     * Mark all notifications as read.
     */
    public function markAllRead(Request $request)
    {
        $user = $request->user();

        SocialNotification::where('user_id', $user->id)
            ->where('is_read', false)
            ->update([
                'is_read' => true,
                'read_at' => now(),
            ]);

        return response()->json([
            'status' => 'success',
            'message' => 'All notifications marked as read.',
        ]);
    }
}
