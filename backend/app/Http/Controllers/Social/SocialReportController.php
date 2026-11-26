<?php

namespace App\Http\Controllers\Social;

use App\Http\Controllers\Controller;
use App\Models\PlayerReport;
use App\Models\User;
use Illuminate\Http\Request;

class SocialReportController extends Controller
{
    /**
     * Submit a report against a player or challenge abuse.
     */
    public function store(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'reported_user_id' => 'required|integer|exists:users,id',
            'challenge_id' => 'nullable|integer|exists:challenges,id',
            'category' => 'required|string|in:harassment,cheating,abuse,inappropriate_content,suspicious_activity,other',
            'reason' => 'required|string|min:5|max:1000',
        ]);

        if ($user->id === (int) $validated['reported_user_id']) {
            return response()->json(['status' => 'error', 'message' => 'You cannot report yourself.'], 422);
        }

        $report = PlayerReport::create([
            'reporter_id' => $user->id,
            'reported_user_id' => $validated['reported_user_id'],
            'challenge_id' => $validated['challenge_id'] ?? null,
            'category' => $validated['category'],
            'reason' => $validated['reason'],
            'status' => 'new',
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Report submitted for staff review. Thank you for keeping the AERVYN community safe.',
            'report_id' => $report->id,
        ], 201);
    }
}
