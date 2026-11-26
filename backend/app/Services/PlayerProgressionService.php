<?php

namespace App\Services;

use App\Models\User;

class PlayerProgressionService
{
    public const RANKS = [
        1 => ['min' => 0, 'max' => 249, 'title' => 'Novice Explorer'],
        2 => ['min' => 250, 'max' => 599, 'title' => 'Chrono Walker'],
        3 => ['min' => 600, 'max' => 1099, 'title' => 'Rift Traveler'],
        4 => ['min' => 1100, 'max' => 1799, 'title' => 'Temporal Adept'],
        5 => ['min' => 1800, 'max' => 2699, 'title' => 'Timeline Weaver'],
        6 => ['min' => 2700, 'max' => 3799, 'title' => 'Quantum Sentinel'],
        7 => ['min' => 3800, 'max' => 5099, 'title' => 'Epoch Guardian'],
        8 => ['min' => 5100, 'max' => 6599, 'title' => 'Time Lord'],
        9 => ['min' => 6600, 'max' => 8299, 'title' => 'Master of Chronos'],
        10 => ['min' => 8300, 'max' => 999999, 'title' => 'Eternal Architect'],
    ];

    /**
     * Calculate level, rank title, and progress percentages from XP.
     */
    public static function getLevelInfo(int $xp): array
    {
        $xp = max(0, $xp);
        $level = 1;
        $rankTitle = self::RANKS[1]['title'];
        $currentMin = 0;
        $nextTarget = self::RANKS[2]['min'];

        foreach (self::RANKS as $lvl => $data) {
            if ($xp >= $data['min']) {
                $level = $lvl;
                $rankTitle = $data['title'];
                $currentMin = $data['min'];
                $nextTarget = isset(self::RANKS[$lvl + 1]) ? self::RANKS[$lvl + 1]['min'] : ($data['max'] + 1);
            }
        }

        $range = max(1, $nextTarget - $currentMin);
        $progressInRange = min($range, max(0, $xp - $currentMin));
        $percent = min(100, round(($progressInRange / $range) * 100));

        return [
            'level' => $level,
            'xp' => $xp,
            'rank_title' => $rankTitle,
            'current_level_min_xp' => $currentMin,
            'next_level_xp' => $nextTarget,
            'xp_needed' => max(0, $nextTarget - $xp),
            'progress_percent' => $percent,
        ];
    }

    /**
     * Award XP to user and update their level and title.
     */
    public static function awardXp(User $user, int $amount, ?string $reason = null): array
    {
        $oldXp = $user->xp;
        $newXp = max(0, $oldXp + $amount);
        $oldLevel = $user->level;

        $info = self::getLevelInfo($newXp);

        $user->xp = $newXp;
        $user->level = $info['level'];
        $user->title = $info['rank_title'];
        $user->save();

        $leveledUp = $user->level > $oldLevel;

        return [
            'xp_awarded' => $amount,
            'total_xp' => $newXp,
            'old_level' => $oldLevel,
            'new_level' => $user->level,
            'leveled_up' => $leveledUp,
            'rank_title' => $user->title,
            'reason' => $reason,
        ];
    }
}
