<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\PlayerProgress;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => $validated['password'],
            'role' => 'player',
            'level' => 1,
            'xp' => 0,
            'is_active' => true,
        ]);

        // Initialize default player progress for World 1
        PlayerProgress::create([
            'user_id' => $user->id,
            'world_id' => 'world_1',
            'current_mission' => 'Awakening the Keystone',
            'current_step' => 1,
            'completed_objectives' => [],
            'inventory' => [],
            'checkpoint_id' => 'start_courtyard',
            'checkpoint_position' => ['x' => 0, 'y' => 1, 'z' => 6],
            'playtime_seconds' => 0,
        ]);

        $token = $user->createToken('aervyn_player_token')->plainTextToken;

        return response()->json([
            'status' => 'success',
            'message' => 'Explorer account initialized successfully.',
            'user' => $user->load('progress'),
            'token' => $token,
        ], 201);
    }

    public function login(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $validated['email'])->first();

        if (! $user || ! Hash::check($validated['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials do not match our records.'],
            ]);
        }

        if ($user->is_banned) {
            return response()->json([
                'status' => 'error',
                'message' => 'This account has been suspended from the timeline continuum.',
            ], 403);
        }

        $user->update(['last_login_at' => now()]);

        // Revoke previous tokens for clean session
        $user->tokens()->delete();
        $token = $user->createToken('aervyn_session_token')->plainTextToken;

        return response()->json([
            'status' => 'success',
            'message' => 'Authentication successful.',
            'user' => $user->load('progress'),
            'token' => $token,
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Logged out successfully.',
        ]);
    }

    public function user(Request $request)
    {
        return response()->json([
            'status' => 'success',
            'user' => $request->user()->load('progress'),
        ]);
    }
}
