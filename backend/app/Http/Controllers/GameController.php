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

        $defaultMission = 'Awakening the Keystone';
        $defaultCheckpoint = 'start_courtyard';
        $defaultPos = ['x' => 0, 'y' => 1, 'z' => 6];

        if ($worldId === 'world_2') {
            $defaultMission = 'The Broken Present';
            $defaultCheckpoint = 'highway_overlook';
            $defaultPos = ['x' => 0, 'y' => 1, 'z' => 12];
        } elseif ($worldId === 'world_3') {
            $defaultMission = 'Arrival at the End of Time';
            $defaultCheckpoint = 'world_3_arrival';
            $defaultPos = ['x' => 0, 'y' => 2, 'z' => 24];
        }

        $progress = PlayerProgress::firstOrCreate(
            ['user_id' => $user->id, 'world_id' => $worldId],
            [
                'current_mission' => $defaultMission,
                'current_step' => 1,
                'completed_objectives' => [],
                'inventory' => [],
                'checkpoint_id' => $defaultCheckpoint,
                'checkpoint_position' => $defaultPos,
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
     * Complete World & grant XP securely
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

        // Server-side validation: must have completed core timeline step before victory
        $minStep = ($worldId === 'world_1') ? 9 : 6;
        if ($progress->current_step < $minStep) {
            return response()->json([
                'status' => 'error',
                'message' => 'Cannot complete world before fulfilling core timeline objectives.',
            ], 422);
        }

        $maxStep = ($worldId === 'world_1') ? 10 : 7;
        $progress->current_step = $maxStep;
        $progress->is_completed = true;
        $progress->save();

        // Award XP and calculate ascension level based on world difficulty
        $xpRewards = [
            'world_1' => 500,
            'world_2' => 750,
            'world_3' => 1000,
        ];
        $xpReward = $xpRewards[$worldId] ?? 500;
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

        $messages = [
            'world_1' => 'World 1: The Lost Kingdom restored! Timeline portal stabilized.',
            'world_2' => 'World 2: The Broken Present restored! Central Time Core repaired.',
            'world_3' => 'World 3: The Fractured Future restored! The Chronarch defeated and Timeline Engine stabilized.',
        ];
        $msg = $messages[$worldId] ?? 'Timeline successfully restored!';

        return response()->json([
            'status' => 'success',
            'message' => $msg,
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

        $defaultCp = 'start_courtyard';
        $defaultPos = ['x' => 0, 'y' => 1, 'z' => 6];

        if ($worldId === 'world_2') {
            $defaultCp = 'highway_overlook';
            $defaultPos = ['x' => 0, 'y' => 1, 'z' => 12];
        } elseif ($worldId === 'world_3') {
            $defaultCp = 'world_3_arrival';
            $defaultPos = ['x' => 0, 'y' => 2, 'z' => 24];
        }

        if ($progress) {
            $progress->current_step = 1;
            $progress->completed_objectives = [];
            $progress->inventory = [];
            $progress->checkpoint_id = $defaultCp;
            $progress->checkpoint_position = $defaultPos;
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
