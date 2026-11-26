<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\PlayerProgress;
use App\Models\GameSession;
use App\Models\AdminActivityLog;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class AdminPlayerController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = User::where('role', 'player');

        // Search by name or email
        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        // Status Filter
        if ($status = $request->input('status')) {
            if ($status === 'active') {
                $query->where('is_active', true)->where('is_banned', false);
            } elseif ($status === 'suspended') {
                $query->where(function ($q) {
                    $q->where('is_active', false)->orWhere('is_banned', true);
                });
            }
        }

        // Registration Date Range Filter
        if ($startDate = $request->input('start_date')) {
            $query->whereDate('created_at', '>=', $startDate);
        }
        if ($endDate = $request->input('end_date')) {
            $query->whereDate('created_at', '<=', $endDate);
        }

        $perPage = min((int) $request->input('per_page', 15), 100);
        $players = $query->withCount('sessions')
            ->orderByDesc('created_at')
            ->paginate($perPage, ['id', 'name', 'email', 'level', 'xp', 'is_active', 'is_banned', 'created_at', 'last_login_at']);

        return response()->json([
            'success' => true,
            'players' => $players,
        ]);
    }

    public function show($id): JsonResponse
    {
        $player = User::where('role', 'player')->find($id);

        if (!$player) {
            return response()->json([
                'success' => false,
                'message' => 'Player not found.'
            ], 404);
        }

        // Get progress across all worlds
        $allProgress = PlayerProgress::where('user_id', $player->id)->get();
        $completedWorlds = $allProgress->where('is_completed', true)->pluck('world_id')->toArray();
        $campaignCompleted = $allProgress->where('campaign_completed', true)->first();
        $endingSelected = $campaignCompleted?->ending_selected;

        // Aggregate collected items
        $allItems = [];
        foreach ($allProgress as $prog) {
            if (is_array($prog->inventory)) {
                $allItems = array_merge($allItems, $prog->inventory);
            }
        }
        $uniqueItems = array_values(array_unique($allItems));

        // Total playtime
        $totalPlaytimeSeconds = $allProgress->sum('playtime_seconds');
        $hours = floor($totalPlaytimeSeconds / 3600);
        $mins = floor(($totalPlaytimeSeconds % 3600) / 60);
        $playtimeFormatted = "{$hours}h {$mins}m";

        // Recent Sessions
        $recentSessions = GameSession::where('user_id', $player->id)
            ->orderByDesc('started_at')
            ->limit(10)
            ->get();

        return response()->json([
            'success' => true,
            'player' => [
                'id' => $player->id,
                'name' => $player->name,
                'email' => $player->email,
                'level' => $player->level,
                'xp' => $player->xp,
                'is_active' => $player->is_active,
                'is_banned' => $player->is_banned,
                'created_at' => $player->created_at,
                'last_login_at' => $player->last_login_at,
                'total_playtime_formatted' => $playtimeFormatted,
                'total_playtime_seconds' => $totalPlaytimeSeconds,
                'completed_worlds' => $completedWorlds,
                'campaign_completed' => (bool) $campaignCompleted,
                'ending_selected' => $endingSelected,
                'unique_items' => $uniqueItems,
                'progress_records' => $allProgress,
                'recent_sessions' => $recentSessions,
            ],
        ]);
    }

    public function updateStatus(Request $request, $id): JsonResponse
    {
        $player = User::where('role', 'player')->find($id);

        if (!$player) {
            return response()->json([
                'success' => false,
                'message' => 'Player not found.'
            ], 404);
        }

        $validated = $request->validate([
            'action' => 'required|in:activate,suspend,reactivate',
            'reason' => 'nullable|string|max:255',
        ]);

        $action = $validated['action'];
        $oldState = ['is_active' => $player->is_active, 'is_banned' => $player->is_banned];

        if ($action === 'suspend') {
            $player->is_active = false;
            $player->is_banned = true;
        } elseif ($action === 'activate' || $action === 'reactivate') {
            $player->is_active = true;
            $player->is_banned = false;
        }

        $player->save();

        AdminActivityLog::log(
            "player_{$action}",
            'Player',
            (string) $player->id,
            [
                'player_name' => $player->name,
                'player_email' => $player->email,
                'reason' => $validated['reason'] ?? null,
                'old_state' => $oldState,
                'new_state' => ['is_active' => $player->is_active, 'is_banned' => $player->is_banned],
            ]
        );

        return response()->json([
            'success' => true,
            'message' => "Player account has been successfully {$action}d.",
            'player' => [
                'id' => $player->id,
                'is_active' => $player->is_active,
                'is_banned' => $player->is_banned,
            ],
        ]);
    }
}
