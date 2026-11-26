<?php

namespace App\Http\Controllers\Player;

use App\Http\Controllers\Controller;
use App\Models\PlayerProgress;
use App\Services\PlayerProgressionService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

class PlayerProfileController extends Controller
{
    /**
     * Get player profile details.
     */
    public function show(Request $request)
    {
        $user = $request->user();
        $progression = PlayerProgressionService::getLevelInfo($user->xp);

        $allProgress = PlayerProgress::where('user_id', $user->id)->get();
        $totalPlaytimeSeconds = $allProgress->sum('playtime_seconds');
        $completedWorlds = $allProgress->where('is_completed', true)->count();
        $completedMissions = $allProgress->sum(function ($p) {
            return is_array($p->completed_objectives) ? count($p->completed_objectives) : 0;
        });

        $hours = floor($totalPlaytimeSeconds / 3600);
        $mins = floor(($totalPlaytimeSeconds % 3600) / 60);

        return response()->json([
            'status' => 'success',
            'data' => [
                'username' => $user->name,
                'display_name' => $user->display_name ?: $user->name,
                'email' => $user->email,
                'avatar' => $user->avatar ?: 'avatar_chrono_walker',
                'bio' => $user->bio ?: 'Temporal explorer navigating the fracture of time.',
                'title' => $progression['rank_title'],
                'level' => $progression['level'],
                'xp' => $user->xp,
                'next_level_xp' => $progression['next_level_xp'],
                'level_progress_percent' => $progression['progress_percent'],
                'registration_date' => $user->created_at->toFormattedDateString(),
                'account_status' => $user->is_active ? ($user->is_banned ? 'Suspended' : 'Active') : 'Inactive',
                'total_playtime' => $hours > 0 ? "{$hours}h {$mins}m" : "{$mins}m",
                'completed_worlds' => $completedWorlds,
                'completed_missions' => $completedMissions,
                'achievements_count' => $user->achievements()->count(),
                'avatar_presets' => [
                    ['id' => 'avatar_default', 'name' => 'Aervyn Initiate', 'color' => '#00f0ff'],
                    ['id' => 'avatar_chrono_walker', 'name' => 'Chrono Walker', 'color' => '#a855f7'],
                    ['id' => 'avatar_rift_seeker', 'name' => 'Rift Seeker', 'color' => '#3b82f6'],
                    ['id' => 'avatar_quantum_pilot', 'name' => 'Quantum Pilot', 'color' => '#10b981'],
                    ['id' => 'avatar_time_guardian', 'name' => 'Epoch Guardian', 'color' => '#ffd700'],
                    ['id' => 'avatar_singularity', 'name' => 'Singularity Weaver', 'color' => '#ec4899'],
                ],
            ]
        ]);
    }

    /**
     * Update allowed profile fields (Display Name, Avatar, Bio).
     * Strictly protects level, xp, rank, achievements, and completion.
     */
    public function update(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'display_name' => 'required|string|min:2|max:50',
            'avatar' => 'required|string|in:avatar_default,avatar_chrono_walker,avatar_rift_seeker,avatar_quantum_pilot,avatar_time_guardian,avatar_singularity',
            'bio' => 'nullable|string|max:300',
        ]);

        $user->display_name = $validated['display_name'];
        $user->avatar = $validated['avatar'];
        $user->bio = $validated['bio'] ?? null;
        $user->save();

        return response()->json([
            'status' => 'success',
            'message' => 'Profile updated successfully.',
            'data' => [
                'display_name' => $user->display_name,
                'avatar' => $user->avatar,
                'bio' => $user->bio,
            ]
        ]);
    }

    /**
     * Change player account password.
     */
    public function changePassword(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'current_password' => 'required|string',
            'new_password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);

        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json([
                'status' => 'error',
                'message' => 'The provided current password does not match our records.'
            ], 422);
        }

        $user->password = Hash::make($request->new_password);
        $user->save();

        return response()->json([
            'status' => 'success',
            'message' => 'Password changed successfully.'
        ]);
    }
}
