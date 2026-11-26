<?php

namespace App\Services;

use App\Models\SocialNotification;
use App\Models\User;

class SocialNotificationService
{
    /**
     * Dispatch a notification to a player.
     */
    public static function notify(
        int|User $user,
        string $type,
        string $title,
        string $message,
        ?string $actionUrl = null,
        ?array $data = null
    ): SocialNotification {
        $userId = $user instanceof User ? $user->id : $user;

        // Prevent duplicate unread notifications of exact same type and message within a short window
        $existing = SocialNotification::where('user_id', $userId)
            ->where('type', $type)
            ->where('message', $message)
            ->where('is_read', false)
            ->where('created_at', '>=', now()->subMinutes(10))
            ->first();

        if ($existing) {
            return $existing;
        }

        return SocialNotification::create([
            'user_id' => $userId,
            'type' => $type,
            'title' => $title,
            'message' => $message,
            'action_url' => $actionUrl,
            'data' => $data,
            'is_read' => false,
        ]);
    }
}
