<?php

namespace App\Http\Controllers;

use App\Models\PlayerProgress;
use App\Models\GameSession;
use Illuminate\Http\Request;

class GameController extends Controller
{
    /**
     * Get or create player progress for active world
     */
    public function getState(Request $request)
    {
        $user = $request->user();
        $worldId = $request->query('world', 'world_1');

        $progress = PlayerProgress::firstOrCreate(
            ['user_id' => $user->id, 'world_id' => $worldId],
            [
                'current_mission' => 'Awakening the Keystone',
                'current_step' => 1,
                'completed_objectives' => [],
                'inventory' => [],
                'checkpoint_id' => 'start_courtyard',
                'checkpoint_position' => ['x' => 0, 'y' => 1, 'z' => 6],
                'is_completed' => false,
                'playtime_seconds' => 0,
            ]
        );

        // Open or locate active game session
        $session = GameSession::firstOrCreate(
            ['user_id' => $user->id, 'world_id' => $worldId, 'completed' => false],
            [
                'started_at' => now(),
                'duration_seconds' => 0,
                'xp_earned' => 0,
            ]
        );

        return response()->json([
            'status' => 'success',
            'progress' => $progress,
            'session_id' => $session->id,
            'user' => [
                'name' => $user->name,
                'level' => $user->level,
                'xp' => $user->xp,
            ],
        ]);
    }

    /**
     * Save in-game progress (objectives, items collected, playtime)
     */
    public function saveProgress(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'world_id' => 'sometimes|string',
            'current_step' => 'sometimes|integer|min:1|max:10',
            'completed_objectives' => 'sometimes|array',
            'inventory' => 'sometimes|array',
            'checkpoint_id' => 'sometimes|string',
            'checkpoint_position' => 'sometimes|array',
            'playtime_increment' => 'sometimes|integer|min:0',
        ]);

        $worldId = $validated['world_id'] ?? 'world_1';
        $progress = PlayerProgress::where('user_id', $user->id)
            ->where('world_id', $worldId)
            ->first();

        if (! $progress) {
            $progress = new PlayerProgress(['user_id' => $user->id, 'world_id' => $worldId]);
        }

        if (isset($validated['current_step'])) {
            $progress->current_step = max($progress->current_step, $validated['current_step']);
        }

        if (isset($validated['completed_objectives'])) {
            $existing = $progress->completed_objectives ?? [];
            $progress->completed_objectives = array_values(array_unique(array_merge($existing, $validated['completed_objectives'])));
        }

        if (isset($validated['inventory'])) {
            $progress->inventory = $validated['inventory'];
        }

        if (isset($validated['checkpoint_id'])) {
            $progress->checkpoint_id = $validated['checkpoint_id'];
        }

        if (isset($validated['checkpoint_position'])) {
            $progress->checkpoint_position = $validated['checkpoint_position'];
        }

        if (!empty($validated['playtime_increment'])) {
            $progress->playtime_seconds += $validated['playtime_increment'];

            // Also update active session duration
            GameSession::where('user_id', $user->id)
                ->where('world_id', $worldId)
                ->where('completed', false)
                ->increment('duration_seconds', $validated['playtime_increment']);
        }

        $progress->save();

        return response()->json([
            'status' => 'success',
            'message' => 'Temporal progress saved to database.',
            'progress' => $progress,
        ]);
    }

    /**
     * Checkpoint reached notification
     */
    public function reachCheckpoint(Request $request)
    {
        $validated = $request->validate([
            'checkpoint_id' => 'required|string',
            'position' => 'required|array',
            'world_id' => 'sometimes|string',
        ]);

        $user = $request->user();
        $worldId = $validated['world_id'] ?? 'world_1';

        $progress = PlayerProgress::where('user_id', $user->id)
            ->where('world_id', $worldId)
            ->first();

        if ($progress) {
            $progress->checkpoint_id = $validated['checkpoint_id'];
            $progress->checkpoint_position = $validated['position'];
            $progress->save();
        }

        return response()->json([
            'status' => 'success',
            'message' => "Checkpoint '{$validated['checkpoint_id']}' recorded.",
        ]);
    }

    /**
     * Complete World 1 & grant XP securely
     */
    public function completeWorld(Request $request)
    {
        $user = $request->user();
        $worldId = $request->input('world_id', 'world_1');

        $progress = PlayerProgress::where('user_id', $user->id)
            ->where('world_id', $worldId)
            ->first();

        if (! $progress) {
            return response()->json(['status' => 'error', 'message' => 'Progress record not found.'], 404);
        }

        // Server-side validation: must have completed at least step 9 (puzzle/portal)
        if ($progress->current_step < 9) {
            return response()->json([
                'status' => 'error',
                'message' => 'Cannot complete world before activating the time portal.',
            ], 422);
        }

        $progress->current_step = 10;
        $progress->is_completed = true;
        $progress->save();

        // Award XP and calculate ascension level
        $xpReward = 500;
        $user->xp += $xpReward;
        if ($user->xp >= $user->level * 500) {
            $user->level += 1;
        }
        $user->save();

        // Complete session
        $session = GameSession::where('user_id', $user->id)
            ->where('world_id', $worldId)
            ->where('completed', false)
            ->latest()
            ->first();

        if ($session) {
            $session->completed = true;
            $session->ended_at = now();
            $session->xp_earned = $xpReward;
            $session->save();
        }

        return response()->json([
            'status' => 'success',
            'message' => 'World 1: The Lost Kingdom restored! Timeline portal stabilized.',
            'xp_awarded' => $xpReward,
            'new_level' => $user->level,
            'total_xp' => $user->xp,
            'progress' => $progress,
        ]);
    }

    /**
     * Reset run to step 1
     */
    public function resetRun(Request $request)
    {
        $user = $request->user();
        $worldId = $request->input('world_id', 'world_1');

        $progress = PlayerProgress::where('user_id', $user->id)
            ->where('world_id', $worldId)
            ->first();

        if ($progress) {
            $progress->current_step = 1;
            $progress->completed_objectives = [];
            $progress->inventory = [];
            $progress->checkpoint_id = 'start_courtyard';
            $progress->checkpoint_position = ['x' => 0, 'y' => 1, 'z' => 6];
            $progress->is_completed = false;
            $progress->save();
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Timeline run reset to start checkpoint.',
            'progress' => $progress,
        ]);
    }
}
