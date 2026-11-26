<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AdminActivityLog;
use App\Models\BlockedPlayer;
use App\Models\Challenge;
use App\Models\Friendship;
use App\Models\PlayerReport;
use App\Models\User;
use Illuminate\Http\Request;

class AdminSocialController extends Controller
{
    /**
     * Social moderation overview metrics.
     */
    public function index()
    {
        return response()->json([
            'status' => 'success',
            'data' => [
                'total_friendships' => Friendship::count() / 2, // symmetrical pairs
                'total_challenges' => Challenge::count(),
                'active_challenges' => Challenge::where('status', 'active')->count(),
                'completed_challenges' => Challenge::where('status', 'completed')->count(),
                'total_reports' => PlayerReport::count(),
                'pending_reports' => PlayerReport::where('status', 'new')->count(),
                'blocked_relationships' => BlockedPlayer::count(),
                'suspended_social_accounts' => User::where('is_social_suspended', true)->count(),
            ]
        ]);
    }

    /**
     * List player reports.
     */
    public function reports(Request $request)
    {
        $status = $request->query('status');

        $query = PlayerReport::with(['reporter', 'reportedUser', 'challenge', 'resolver'])->latest();

        if ($status && $status !== 'all') {
            $query->where('status', $status);
        }

        $reports = $query->paginate(20);

        return response()->json([
            'status' => 'success',
            'data' => $reports,
        ]);
    }

    /**
     * Triage and update a player report.
     */
    public function updateReport(Request $request, $id)
    {
        $admin = $request->user();

        $request->validate([
            'status' => 'required|in:new,reviewing,resolved,rejected',
            'admin_notes' => 'nullable|string|max:1000',
        ]);

        $report = PlayerReport::findOrFail($id);
        $report->status = $request->status;
        $report->admin_notes = $request->admin_notes;
        $report->resolved_by = $admin->id;
        $report->resolved_at = now();
        $report->save();

        AdminActivityLog::log(
            'REPORT_UPDATE',
            'player_report',
            (string) $report->id,
            [
                'status' => $report->status,
                'reported_user_id' => $report->reported_user_id,
                'admin_notes' => $report->admin_notes,
            ]
        );

        return response()->json([
            'status' => 'success',
            'message' => 'Report status updated.',
            'report' => $report,
        ]);
    }

    /**
     * List challenges for monitoring.
     */
    public function challenges(Request $request)
    {
        $challenges = Challenge::with(['challenger', 'opponent', 'winner'])
            ->latest()
            ->paginate(25);

        return response()->json([
            'status' => 'success',
            'data' => $challenges,
        ]);
    }

    /**
     * Suspend or reinstate a player's social permissions.
     */
    public function toggleSuspension(Request $request, $userId)
    {
        $request->validate([
            'suspend' => 'required|boolean',
            'reason' => 'nullable|string|max:255',
        ]);

        $user = User::findOrFail($userId);
        $user->is_social_suspended = $request->suspend;
        $user->social_suspended_reason = $request->suspend ? ($request->input('reason') ?: 'Suspended by admin moderation.') : null;
        $user->save();

        AdminActivityLog::log(
            $request->suspend ? 'SOCIAL_SUSPEND' : 'SOCIAL_UNSUSPEND',
            'user',
            (string) $user->id,
            ['reason' => $user->social_suspended_reason]
        );

        return response()->json([
            'status' => 'success',
            'message' => $request->suspend
                ? "Social access suspended for player {$user->name}."
                : "Social access reinstated for player {$user->name}.",
            'is_social_suspended' => $user->is_social_suspended,
        ]);
    }
}
