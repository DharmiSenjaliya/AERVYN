<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Mission;
use App\Models\PlayerProgress;
use App\Models\AdminActivityLog;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class AdminMissionController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Mission::with('world:id,title,epoch');

        if ($worldId = $request->input('world_id')) {
            $query->where('world_id', $worldId);
        }

        $missions = $query->orderBy('world_id')->orderBy('step_number')->get()->map(function ($m) {
            // Count players who reached or exceeded this step
            $reachedCount = PlayerProgress::where('world_id', $m->world_id)
                ->where('current_step', '>=', $m->step_number)
                ->count();

            return [
                'id' => $m->id,
                'world_id' => $m->world_id,
                'world_title' => $m->world?->title,
                'title' => $m->title,
                'description' => $m->description,
                'step_number' => $m->step_number,
                'objectives' => $m->objectives,
                'xp_reward' => $m->xp_reward,
                'is_active' => $m->is_active,
                'players_reached' => $reachedCount,
                'updated_at' => $m->updated_at,
            ];
        });

        return response()->json([
            'success' => true,
            'missions' => $missions,
        ]);
    }

    public function show($id): JsonResponse
    {
        $mission = Mission::with('world:id,title,epoch')->find($id);

        if (!$mission) {
            return response()->json([
                'success' => false,
                'message' => 'Mission not found.'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'mission' => $mission,
        ]);
    }

    public function update(Request $request, $id): JsonResponse
    {
        $mission = Mission::find($id);

        if (!$mission) {
            return response()->json([
                'success' => false,
                'message' => 'Mission not found.'
            ], 404);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:150',
            'description' => 'required|string|max:1000',
            'objectives' => 'nullable|array',
            'xp_reward' => 'required|integer|min:0|max:5000',
            'is_active' => 'required|boolean',
        ]);

        $oldState = $mission->only(['title', 'description', 'objectives', 'xp_reward', 'is_active']);
        $mission->update($validated);

        AdminActivityLog::log(
            'update_mission',
            'Mission',
            $mission->id,
            [
                'mission_id' => $mission->id,
                'world_id' => $mission->world_id,
                'old_state' => $oldState,
                'new_state' => $validated,
            ]
        );

        return response()->json([
            'success' => true,
            'message' => "Mission '{$mission->title}' updated successfully.",
            'mission' => $mission,
        ]);
    }
}
