<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\GameSession;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class AdminSessionController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = GameSession::with('user:id,name,email');

        if ($worldId = $request->input('world_id')) {
            $query->where('world_id', $worldId);
        }

        if ($status = $request->input('status')) {
            if ($status === 'completed') {
                $query->where('completed', true);
            } elseif ($status === 'in_progress') {
                $query->where('completed', false);
            }
        }

        if ($search = $request->input('search')) {
            $query->whereHas('user', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $perPage = min((int) $request->input('per_page', 15), 100);
        $sessions = $query->orderByDesc('started_at')->paginate($perPage);

        // Format session duration for UI
        $sessions->getCollection()->transform(function ($session) {
            $durationSeconds = $session->duration_seconds;
            $mins = floor($durationSeconds / 60);
            $secs = $durationSeconds % 60;
            $durationFormatted = "{$mins}m {$secs}s";

            return array_merge($session->toArray(), [
                'duration_formatted' => $durationFormatted,
            ]);
        });

        return response()->json([
            'success' => true,
            'sessions' => $sessions,
        ]);
    }
}
