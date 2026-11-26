<?php

namespace App\Http\Controllers\Player;

use App\Http\Controllers\Controller;
use App\Models\Achievement;
use App\Services\AchievementService;
use App\Services\PlayerProgressionService;
use Illuminate\Http\Request;

class PlayerAchievementController extends Controller
{
    /**
     * Get all achievements with player's unlocked status.
     */
    public function index(Request $request)
    {
        $user = $request->user();

        // Automatically sync to award any earned achievements
        AchievementService::syncForUser($user);
        $user->refresh();

        $unlockedRecords = $user->userAchievements()->get()->keyBy('achievement_id');
        $allAchievements = Achievement::orderBy('created_at')->get();

        $categories = [
            'explorer' => 'Explorer',
            'collector' => 'Collector',
            'mission' => 'Mission',
            'puzzle' => 'Puzzle',
            'boss' => 'Boss Victories',
            'campaign' => 'Campaign & Endings',
        ];

        $mapped = $allAchievements->map(function ($ach) use ($unlockedRecords) {
            $isUnlocked = isset($unlockedRecords[$ach->id]);
            $record = $unlockedRecords[$ach->id] ?? null;

            return [
                'id' => $ach->id,
                'title' => $ach->title,
                'description' => $ach->description,
                'category' => $ach->category,
                'icon' => $ach->icon,
                'xp_reward' => $ach->xp_reward,
                'condition_type' => $ach->condition_type,
                'condition_target' => $ach->condition_target,
                'is_unlocked' => $isUnlocked,
                'unlocked_at' => $isUnlocked && $record?->unlocked_at ? $record->unlocked_at->toFormattedDateString() : null,
                'xp_awarded' => $isUnlocked ? ($record->xp_awarded ?? $ach->xp_reward) : 0,
            ];
        });

        $totalCount = $mapped->count();
        $unlockedCount = $mapped->where('is_unlocked', true)->count();
        $totalXpFromAchievements = $mapped->where('is_unlocked', true)->sum('xp_awarded');

        return response()->json([
            'status' => 'success',
            'data' => [
                'total_count' => $totalCount,
                'unlocked_count' => $unlockedCount,
                'completion_percent' => $totalCount > 0 ? round(($unlockedCount / $totalCount) * 100) : 0,
                'total_xp_awarded' => $totalXpFromAchievements,
                'categories' => $categories,
                'achievements' => $mapped->values(),
            ]
        ]);
    }

    /**
     * Check and sync achievements on demand.
     */
    public function check(Request $request)
    {
        $user = $request->user();
        $newlyUnlocked = AchievementService::syncForUser($user);
        $user->refresh();

        $progression = PlayerProgressionService::getLevelInfo($user->xp);

        return response()->json([
            'status' => 'success',
            'new_unlocks_count' => count($newlyUnlocked),
            'newly_unlocked' => $newlyUnlocked,
            'progression' => $progression,
        ]);
    }
}
