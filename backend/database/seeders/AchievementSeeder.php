<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Achievement;
use App\Models\User;
use App\Models\UserAchievement;
use App\Services\PlayerProgressionService;

class AchievementSeeder extends Seeder
{
    public function run(): void
    {
        $achievements = [
            // Explorer
            [
                'id' => 'first_steps',
                'title' => 'First Steps',
                'description' => 'Begin your journey and take your first steps in the ancient kingdom.',
                'category' => 'explorer',
                'icon' => 'Footprints',
                'condition_type' => 'game_start',
                'condition_target' => 'world_1',
                'xp_reward' => 50,
            ],
            [
                'id' => 'kingdom_explorer',
                'title' => 'Kingdom Explorer',
                'description' => 'Fully explore the Lost Kingdom and discover all secret courtyards.',
                'category' => 'explorer',
                'icon' => 'Compass',
                'condition_type' => 'world_explore',
                'condition_target' => 'world_1',
                'xp_reward' => 150,
            ],
            [
                'id' => 'city_explorer',
                'title' => 'City Explorer',
                'description' => 'Navigate the ruins of the Broken Present and reach the High Transit Line.',
                'category' => 'explorer',
                'icon' => 'MapPin',
                'condition_type' => 'world_explore',
                'condition_target' => 'world_2',
                'xp_reward' => 200,
            ],
            [
                'id' => 'future_explorer',
                'title' => 'Future Explorer',
                'description' => 'Traverse the anti-gravity bridges of the Fractured Future.',
                'category' => 'explorer',
                'icon' => 'Globe',
                'condition_type' => 'world_explore',
                'condition_target' => 'world_3',
                'xp_reward' => 250,
            ],

            // Collector
            [
                'id' => 'first_artifact',
                'title' => 'First Artifact',
                'description' => 'Find and interact with your first ancient temporal artifact.',
                'category' => 'collector',
                'icon' => 'Sparkles',
                'condition_type' => 'item_collect',
                'condition_target' => 'first_item',
                'xp_reward' => 100,
            ],
            [
                'id' => 'energy_hunter',
                'title' => 'Energy Hunter',
                'description' => 'Collect all 3 Energy Fragments scattered across the Lost Kingdom.',
                'category' => 'collector',
                'icon' => 'Zap',
                'condition_type' => 'fragments_complete',
                'condition_target' => 'world_1',
                'xp_reward' => 200,
            ],
            [
                'id' => 'core_collector',
                'title' => 'Core Collector',
                'description' => 'Gather all Quantum Cores required to stabilize the Present timeline.',
                'category' => 'collector',
                'icon' => 'Cpu',
                'condition_type' => 'cores_complete',
                'condition_target' => 'world_2',
                'xp_reward' => 300,
            ],
            [
                'id' => 'chrono_master',
                'title' => 'Chrono Master',
                'description' => 'Collect all Chrono Shards across the floating future islands.',
                'category' => 'collector',
                'icon' => 'Layers',
                'condition_type' => 'shards_complete',
                'condition_target' => 'world_3',
                'xp_reward' => 400,
            ],

            // Mission
            [
                'id' => 'first_mission_complete',
                'title' => 'First Mission Complete',
                'description' => 'Successfully complete your first story mission.',
                'category' => 'mission',
                'icon' => 'CheckCircle',
                'condition_type' => 'mission_complete',
                'condition_target' => 'any',
                'xp_reward' => 100,
            ],
            [
                'id' => 'kingdom_savior',
                'title' => 'Kingdom Savior',
                'description' => 'Unlock the ancient castle gates and activate the epoch portal.',
                'category' => 'mission',
                'icon' => 'Shield',
                'condition_type' => 'world_complete',
                'condition_target' => 'world_1',
                'xp_reward' => 250,
            ],
            [
                'id' => 'present_restored',
                'title' => 'Present Restored',
                'description' => 'Reactivate the Quantum Reactor and resolve present anomalies.',
                'category' => 'mission',
                'icon' => 'Activity',
                'condition_type' => 'world_complete',
                'condition_target' => 'world_2',
                'xp_reward' => 350,
            ],
            [
                'id' => 'future_defender',
                'title' => 'Future Defender',
                'description' => 'Neutralize temporal collapses across the floating future sanctuary.',
                'category' => 'mission',
                'icon' => 'ShieldCheck',
                'condition_type' => 'world_complete',
                'condition_target' => 'world_3',
                'xp_reward' => 450,
            ],

            // Puzzle
            [
                'id' => 'puzzle_beginner',
                'title' => 'Puzzle Beginner',
                'description' => 'Solve your first ancient resonance alignment puzzle.',
                'category' => 'puzzle',
                'icon' => 'Key',
                'condition_type' => 'puzzle_solve',
                'condition_target' => 'puzzle_1',
                'xp_reward' => 100,
            ],
            [
                'id' => 'puzzle_master',
                'title' => 'Puzzle Master',
                'description' => 'Calibrate three energy nodes without resetting the matrix.',
                'category' => 'puzzle',
                'icon' => 'Sliders',
                'condition_type' => 'puzzle_solve',
                'condition_target' => 'puzzle_master',
                'xp_reward' => 250,
            ],
            [
                'id' => 'time_manipulator',
                'title' => 'Time Manipulator',
                'description' => 'Synchronize the anti-gravity Phase Bridge in the Fractured Future.',
                'category' => 'puzzle',
                'icon' => 'Clock',
                'condition_type' => 'puzzle_solve',
                'condition_target' => 'phase_bridge',
                'xp_reward' => 350,
            ],

            // Boss
            [
                'id' => 'first_boss_victory',
                'title' => 'First Boss Victory',
                'description' => 'Defeat a high-threat temporal guardian in combat.',
                'category' => 'boss',
                'icon' => 'Swords',
                'condition_type' => 'boss_defeat',
                'condition_target' => 'guardian',
                'xp_reward' => 300,
            ],
            [
                'id' => 'chronarch_defeated',
                'title' => 'Chronarch Defeated',
                'description' => 'Overcome the Chronarch entity at the Zero Horizon singularity.',
                'category' => 'boss',
                'icon' => 'Skull',
                'condition_type' => 'boss_defeat',
                'condition_target' => 'chronarch',
                'xp_reward' => 600,
            ],

            // Campaign
            [
                'id' => 'story_completed',
                'title' => 'Story Completed',
                'description' => 'Reach the climax of the journey and make the final epoch choice.',
                'category' => 'campaign',
                'icon' => 'Award',
                'condition_type' => 'campaign_complete',
                'condition_target' => 'world_final',
                'xp_reward' => 500,
            ],
            [
                'id' => 'timeline_restored',
                'title' => 'Timeline Restored',
                'description' => 'Choose to stabilize the timelines and restore temporal equilibrium (Ending A).',
                'category' => 'campaign',
                'icon' => 'Sun',
                'condition_type' => 'ending_choice',
                'condition_target' => 'ending_a',
                'xp_reward' => 500,
            ],
            [
                'id' => 'new_timeline_created',
                'title' => 'New Timeline Created',
                'description' => 'Choose to harness the Chrono Core and forge a new unwritten destiny (Ending B).',
                'category' => 'campaign',
                'icon' => 'Orbit',
                'condition_type' => 'ending_choice',
                'condition_target' => 'ending_b',
                'xp_reward' => 500,
            ],
        ];

        foreach ($achievements as $ach) {
            Achievement::updateOrCreate(['id' => $ach['id']], $ach);
        }

        // Initialize players with display names and titles if unset
        $players = User::where('role', 'player')->get();
        foreach ($players as $index => $player) {
            if (!$player->display_name) {
                $player->display_name = $player->name;
            }
            if (!$player->avatar) {
                $presets = ['avatar_chrono_walker', 'avatar_rift_seeker', 'avatar_quantum_pilot', 'avatar_time_guardian'];
                $player->avatar = $presets[$index % count($presets)];
            }
            $levelInfo = PlayerProgressionService::getLevelInfo($player->xp);
            $player->level = $levelInfo['level'];
            $player->title = $levelInfo['rank_title'];
            $player->save();
        }
    }
}
