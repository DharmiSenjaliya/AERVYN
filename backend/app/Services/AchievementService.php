<?php

namespace App\Services;

use App\Models\Achievement;
use App\Models\PlayerProgress;
use App\Models\User;
use App\Models\UserAchievement;

class AchievementService
{
    /**
     * Inspect player progress records and automatically unlock eligible achievements.
     * Prevents duplicate rewards and returns newly unlocked achievements.
     *
     * @param User $user
     * @return array Newly unlocked achievements
     */
    public static function syncForUser(User $user): array
    {
        $allProgress = PlayerProgress::where('user_id', $user->id)->get();
        if ($allProgress->isEmpty()) {
            return [];
        }

        $alreadyUnlocked = UserAchievement::where('user_id', $user->id)
            ->pluck('achievement_id')
            ->toArray();

        $progressByWorld = [];
        $totalItemsCount = 0;
        $totalObjectivesCount = 0;
        $hasEndingA = false;
        $hasEndingB = false;
        $campaignCompleted = false;

        foreach ($allProgress as $p) {
            $progressByWorld[$p->world_id] = $p;
            $items = is_array($p->inventory) ? count($p->inventory) : 0;
            $totalItemsCount += $items;
            $objs = is_array($p->completed_objectives) ? count($p->completed_objectives) : 0;
            $totalObjectivesCount += $objs;

            if ($p->ending_selected === 'ending_a') {
                $hasEndingA = true;
            } elseif ($p->ending_selected === 'ending_b') {
                $hasEndingB = true;
            }
            if ($p->campaign_completed) {
                $campaignCompleted = true;
            }
        }

        $w1 = $progressByWorld['world_1'] ?? null;
        $w2 = $progressByWorld['world_2'] ?? null;
        $w3 = $progressByWorld['world_3'] ?? null;
        $wFinal = $progressByWorld['world_final'] ?? null;

        // Conditions matrix
        $eligible = [];

        // 1. Explorer
        if ($w1) {
            $eligible[] = 'first_steps';
        }
        if ($w1 && ($w1->current_step >= 2 || $w1->is_completed)) {
            $eligible[] = 'kingdom_explorer';
        }
        if ($w2 && ($w2->current_step >= 1 || $w2->is_completed)) {
            $eligible[] = 'city_explorer';
        }
        if ($w3 && ($w3->current_step >= 1 || $w3->is_completed)) {
            $eligible[] = 'future_explorer';
        }

        // 2. Collector
        if ($totalItemsCount >= 1) {
            $eligible[] = 'first_artifact';
        }
        if ($w1 && is_array($w1->inventory) && count(array_filter($w1->inventory, fn($i) => str_contains($i['id'] ?? '', 'energy_fragment') || str_contains($i['name'] ?? '', 'Fragment'))) >= 3) {
            $eligible[] = 'energy_hunter';
        } elseif ($w1 && is_array($w1->inventory) && count($w1->inventory) >= 3) {
            $eligible[] = 'energy_hunter';
        }
        if ($w2 && is_array($w2->inventory) && count($w2->inventory) >= 2) {
            $eligible[] = 'core_collector';
        }
        if ($w3 && is_array($w3->inventory) && count($w3->inventory) >= 2) {
            $eligible[] = 'chrono_master';
        }

        // 3. Missions
        if ($totalObjectivesCount >= 1 || ($w1 && $w1->current_step >= 2)) {
            $eligible[] = 'first_mission_complete';
        }
        if ($w1 && $w1->is_completed) {
            $eligible[] = 'kingdom_savior';
        }
        if ($w2 && $w2->is_completed) {
            $eligible[] = 'present_restored';
        }
        if ($w3 && $w3->is_completed) {
            $eligible[] = 'future_defender';
        }

        // 4. Puzzles
        if ($w1 && in_array('solve_ancient_door_puzzle', $w1->completed_objectives ?? [])) {
            $eligible[] = 'puzzle_beginner';
        } elseif ($w1 && $w1->is_completed) {
            $eligible[] = 'puzzle_beginner';
        }
        if ($w2 && ($w2->is_completed || in_array('calibrate_flux_terminal', $w2->completed_objectives ?? []))) {
            $eligible[] = 'puzzle_master';
        }
        if ($w3 && ($w3->is_completed || in_array('synchronize_phase_bridge', $w3->completed_objectives ?? []))) {
            $eligible[] = 'time_manipulator';
        }

        // 5. Boss
        if ($w3 && $w3->is_completed) {
            $eligible[] = 'first_boss_victory';
        }
        if ($wFinal && $wFinal->is_completed) {
            $eligible[] = 'chronarch_defeated';
        }

        // 6. Campaign
        if ($campaignCompleted || ($wFinal && $wFinal->is_completed)) {
            $eligible[] = 'story_completed';
        }
        if ($hasEndingA) {
            $eligible[] = 'timeline_restored';
        }
        if ($hasEndingB) {
            $eligible[] = 'new_timeline_created';
        }

        $newlyUnlocked = [];
        $toUnlock = array_diff(array_unique($eligible), $alreadyUnlocked);

        foreach ($toUnlock as $achId) {
            $achievement = Achievement::find($achId);
            if (!$achievement) {
                continue;
            }

            // Guarantee no race conditions / duplicates
            $record = UserAchievement::firstOrCreate(
                ['user_id' => $user->id, 'achievement_id' => $achievement->id],
                [
                    'unlocked_at' => now(),
                    'xp_awarded' => $achievement->xp_reward,
                ]
            );

            if ($record->wasRecentlyCreated) {
                // Award XP safely
                PlayerProgressionService::awardXp($user, $achievement->xp_reward, "Achievement: {$achievement->title}");

                $newlyUnlocked[] = [
                    'id' => $achievement->id,
                    'title' => $achievement->title,
                    'description' => $achievement->description,
                    'category' => $achievement->category,
                    'icon' => $achievement->icon,
                    'xp_reward' => $achievement->xp_reward,
                    'unlocked_at' => $record->unlocked_at->toIso8601String(),
                ];
            }
        }

        return $newlyUnlocked;
    }
}
