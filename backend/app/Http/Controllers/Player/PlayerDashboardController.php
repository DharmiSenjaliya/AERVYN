<?php

namespace App\Http\Controllers\Player;

use App\Http\Controllers\Controller;
use App\Models\Achievement;
use App\Models\Collectible;
use App\Models\GameSession;
use App\Models\Mission;
use App\Models\PlayerProgress;
use App\Models\World;
use App\Services\AchievementService;
use App\Services\PlayerProgressionService;
use Illuminate\Http\Request;

class PlayerDashboardController extends Controller
{
    /**
     * Get real-time player telemetry dashboard metrics.
     */
    public function dashboard(Request $request)
    {
        $user = $request->user();

        // 1. Sync achievements to ensure up-to-date state
        AchievementService::syncForUser($user);
        $user->refresh();

        // 2. Progression info
        $progression = PlayerProgressionService::getLevelInfo($user->xp);

        // 3. Player progress records
        $allProgress = PlayerProgress::where('user_id', $user->id)->get();
        $progressByWorld = $allProgress->keyBy('world_id');

        $totalPlaytimeSeconds = 0;
        $totalItemsCount = 0;
        $completedWorldsCount = 0;
        $campaignCompleted = false;
        $endingSelected = null;

        foreach ($allProgress as $p) {
            $totalPlaytimeSeconds += ($p->playtime_seconds ?? 0);
            if (is_array($p->inventory)) {
                $totalItemsCount += count($p->inventory);
            }
            if ($p->is_completed) {
                $completedWorldsCount++;
            }
            if ($p->campaign_completed) {
                $campaignCompleted = true;
            }
            if ($p->ending_selected) {
                $endingSelected = $p->ending_selected;
            }
        }

        // Playtime formatted
        $hours = floor($totalPlaytimeSeconds / 3600);
        $mins = floor(($totalPlaytimeSeconds % 3600) / 60);
        $playtimeFormatted = $hours > 0 ? "{$hours}h {$mins}m" : "{$mins}m";

        // 4. Current World & Active Mission
        $activeWorldId = 'world_1';
        if (isset($progressByWorld['world_final']) && !$progressByWorld['world_final']->is_completed) {
            $activeWorldId = 'world_final';
        } elseif (isset($progressByWorld['world_3']) && !$progressByWorld['world_3']->is_completed) {
            $activeWorldId = 'world_3';
        } elseif (isset($progressByWorld['world_2']) && !$progressByWorld['world_2']->is_completed) {
            $activeWorldId = 'world_2';
        }

        $activeProgress = $progressByWorld[$activeWorldId] ?? null;
        $activeWorldModel = World::find($activeWorldId);

        // 5. Campaign completion percent
        // 4 worlds * 25% each
        $campaignPercent = min(100, $completedWorldsCount * 25);
        if ($campaignCompleted) {
            $campaignPercent = 100;
        }

        // 6. Achievements summary
        $totalAchievements = Achievement::count();
        $unlockedAchievements = $user->achievements()->count();
        $recentAchievements = $user->achievements()
            ->orderByPivot('unlocked_at', 'desc')
            ->take(4)
            ->get(['achievements.id', 'achievements.title', 'achievements.description', 'achievements.icon', 'achievements.xp_reward']);

        // 7. Recent Sessions & Activity
        $recentSessions = GameSession::where('user_id', $user->id)
            ->orderBy('started_at', 'desc')
            ->take(5)
            ->get();

        // 8. Available Worlds catalog with unlock flags
        $allWorlds = World::orderBy('display_order')->get();
        $worldCards = $allWorlds->map(function ($w) use ($progressByWorld, $completedWorldsCount) {
            $p = $progressByWorld[$w->id] ?? null;
            $unlocked = true;
            if ($w->id === 'world_2') {
                $unlocked = isset($progressByWorld['world_1']) && $progressByWorld['world_1']->is_completed;
            } elseif ($w->id === 'world_3') {
                $unlocked = isset($progressByWorld['world_2']) && $progressByWorld['world_2']->is_completed;
            } elseif ($w->id === 'world_final') {
                $unlocked = isset($progressByWorld['world_3']) && $progressByWorld['world_3']->is_completed;
            }

            return [
                'id' => $w->id,
                'title' => $w->title,
                'epoch' => $w->epoch,
                'description' => $w->description,
                'is_unlocked' => $unlocked,
                'is_completed' => (bool) ($p?->is_completed),
                'current_step' => $p?->current_step ?? 1,
                'thumbnail_url' => $w->thumbnail_url ?: '/assets/aervyn-logo.png',
            ];
        });

        return response()->json([
            'status' => 'success',
            'data' => [
                'user' => [
                    'id' => $user->id,
                    'username' => $user->name,
                    'display_name' => $user->display_name ?: $user->name,
                    'email' => $user->email,
                    'avatar' => $user->avatar ?: 'avatar_chrono_walker',
                    'role' => $user->role,
                    'level' => $progression['level'],
                    'xp' => $user->xp,
                    'rank_title' => $progression['rank_title'],
                    'level_progress_percent' => $progression['progress_percent'],
                    'next_level_xp' => $progression['next_level_xp'],
                    'created_at' => $user->created_at->toFormattedDateString(),
                ],
                'campaign' => [
                    'current_world_id' => $activeWorldId,
                    'current_world_title' => $activeWorldModel?->title ?? 'World 1: The Lost Kingdom',
                    'current_mission_title' => $activeProgress?->current_mission ?? 'Awakening the Keystone',
                    'current_step' => $activeProgress?->current_step ?? 1,
                    'completed_worlds_count' => $completedWorldsCount,
                    'total_worlds' => 4,
                    'campaign_percent' => $campaignPercent,
                    'campaign_completed' => $campaignCompleted,
                    'ending_selected' => $endingSelected,
                ],
                'playtime' => [
                    'total_seconds' => $totalPlaytimeSeconds,
                    'formatted' => $playtimeFormatted,
                ],
                'achievements' => [
                    'unlocked_count' => $unlockedAchievements,
                    'total_count' => $totalAchievements,
                    'percent' => $totalAchievements > 0 ? round(($unlockedAchievements / $totalAchievements) * 100) : 0,
                    'recent' => $recentAchievements,
                ],
                'collectibles' => [
                    'discovered_count' => $totalItemsCount,
                    'total_catalog' => Collectible::count(),
                ],
                'recent_sessions' => $recentSessions,
                'worlds' => $worldCards,
            ]
        ]);
    }
}
