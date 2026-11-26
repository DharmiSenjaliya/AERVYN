<?php

namespace App\Http\Controllers\Player;

use App\Http\Controllers\Controller;
use App\Models\GameSession;
use App\Models\PlayerProgress;
use App\Models\World;
use App\Services\PlayerProgressionService;
use Illuminate\Http\Request;

class PlayerStatisticsController extends Controller
{
    /**
     * Get comprehensive player statistics.
     */
    public function index(Request $request)
    {
        $user = $request->user();

        $allProgress = PlayerProgress::where('user_id', $user->id)->get()->keyBy('world_id');
        $allSessions = GameSession::where('user_id', $user->id)->get();

        $totalPlaytimeSeconds = $allProgress->sum('playtime_seconds');
        $totalSessions = $allSessions->count();

        // Count completed worlds
        $completedWorlds = $allProgress->where('is_completed', true)->count();

        // Count completed missions/objectives
        $completedMissions = 0;
        $totalCollectibles = 0;
        $puzzlesCompleted = 0;
        $bossVictories = 0;
        $endingSelected = null;
        $campaignCompleted = false;

        $inventoryBreakdown = [];

        foreach ($allProgress as $worldId => $p) {
            $objs = $p->completed_objectives ?? [];
            $completedMissions += count($objs);

            if (is_array($p->inventory)) {
                $totalCollectibles += count($p->inventory);
                foreach ($p->inventory as $item) {
                    $inventoryBreakdown[] = [
                        'id' => $item['id'] ?? 'item',
                        'name' => $item['name'] ?? 'Relic',
                        'world' => $worldId,
                        'collected_at' => $item['collected_at'] ?? null,
                    ];
                }
            }

            // Puzzles
            if (in_array('solve_ancient_door_puzzle', $objs) || in_array('puzzle_solved', $objs)) {
                $puzzlesCompleted++;
            }
            if ($worldId === 'world_2' && (in_array('calibrate_flux_terminal', $objs) || $p->is_completed)) {
                $puzzlesCompleted++;
            }
            if ($worldId === 'world_3' && (in_array('synchronize_phase_bridge', $objs) || $p->is_completed)) {
                $puzzlesCompleted++;
            }

            // Bosses
            if ($worldId === 'world_3' && $p->is_completed) {
                $bossVictories++; // Temporal Sentinel
            }
            if ($worldId === 'world_final' && $p->is_completed) {
                $bossVictories++; // Chronarch
            }

            if ($p->ending_selected) {
                $endingSelected = $p->ending_selected;
            }
            if ($p->campaign_completed) {
                $campaignCompleted = true;
            }
        }

        // Completion percentage
        $campaignPercent = min(100, $completedWorlds * 25);
        if ($campaignCompleted) {
            $campaignPercent = 100;
        }

        $hours = floor($totalPlaytimeSeconds / 3600);
        $mins = floor(($totalPlaytimeSeconds % 3600) / 60);

        // World breakdowns
        $worlds = World::orderBy('display_order')->get();
        $worldStats = $worlds->map(function ($w) use ($allProgress) {
            $p = $allProgress[$w->id] ?? null;
            return [
                'world_id' => $w->id,
                'title' => $w->title,
                'epoch' => $w->epoch,
                'is_completed' => (bool) ($p?->is_completed),
                'current_step' => $p?->current_step ?? 1,
                'playtime_seconds' => $p?->playtime_seconds ?? 0,
                'playtime_formatted' => $p ? floor($p->playtime_seconds / 60) . ' mins' : '0 mins',
                'items_collected' => is_array($p?->inventory) ? count($p->inventory) : 0,
                'checkpoint' => $p?->checkpoint_id ?? 'Start',
            ];
        });

        return response()->json([
            'status' => 'success',
            'data' => [
                'playtime' => [
                    'total_seconds' => $totalPlaytimeSeconds,
                    'formatted' => $hours > 0 ? "{$hours}h {$mins}m" : "{$mins}m",
                ],
                'sessions_count' => $totalSessions,
                'worlds_completed' => $completedWorlds,
                'missions_completed' => $completedMissions,
                'collectibles_discovered' => $totalCollectibles,
                'puzzles_completed' => $puzzlesCompleted,
                'boss_victories' => $bossVictories,
                'total_xp_earned' => $user->xp,
                'campaign_completion_percentage' => $campaignPercent,
                'campaign_completed' => $campaignCompleted,
                'ending_selected' => $endingSelected ? ($endingSelected === 'ending_a' ? 'Ending A: Temporal Equilibrium' : 'Ending B: Nexus Sovereign') : 'In Progress',
                'ending_raw' => $endingSelected,
                'world_breakdowns' => $worldStats,
                'inventory_items' => $inventoryBreakdown,
            ]
        ]);
    }
}
