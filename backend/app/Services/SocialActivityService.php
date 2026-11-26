<?php

namespace App\Services;

use App\Models\BlockedPlayer;
use App\Models\SocialActivity;
use App\Models\User;

class SocialActivityService
{
    /**
     * Record a public social activity.
     */
    public static function log(User $user, string $activityType, string $description, ?array $metadata = null): ?SocialActivity
    {
        $privacy = $user->getPrivacy();
        if (!$privacy->show_public_profile) {
            return null;
        }

        return SocialActivity::create([
            'user_id' => $user->id,
            'activity_type' => $activityType,
            'description' => $description,
            'metadata' => $metadata,
        ]);
    }

    /**
     * Get recent social activities for a viewer.
     */
    public static function getFeed(User $viewer, int $limit = 25): array
    {
        // Exclude blocked or blocking users
        $blockedIds = BlockedPlayer::where('user_id', $viewer->id)
            ->pluck('blocked_user_id')
            ->toArray();

        $blockedByIds = BlockedPlayer::where('blocked_user_id', $viewer->id)
            ->pluck('user_id')
            ->toArray();

        $excludeIds = array_unique(array_merge($blockedIds, $blockedByIds));

        $activities = SocialActivity::with('user')
            ->whereNotIn('user_id', $excludeIds)
            ->whereHas('user', function ($q) {
                $q->where('is_active', true)
                  ->where('is_social_suspended', false);
            })
            ->latest()
            ->take($limit)
            ->get();

        return $activities->map(function ($act) use ($viewer) {
            $user = $act->user;
            return [
                'id' => $act->id,
                'user_id' => $act->user_id,
                'username' => $user?->name ?? 'Explorer',
                'display_name' => $user?->display_name ?: ($user?->name ?? 'Explorer'),
                'avatar' => $user?->avatar ?: 'avatar_chrono_walker',
                'rank_title' => $user?->title ?: 'Novice Explorer',
                'activity_type' => $act->activity_type,
                'description' => $act->description,
                'metadata' => $act->metadata,
                'created_at' => $act->created_at->diffForHumans(),
                'is_friend' => $viewer->isFriendWith($act->user_id),
                'is_self' => $viewer->id === $act->user_id,
            ];
        })->toArray();
    }
}
