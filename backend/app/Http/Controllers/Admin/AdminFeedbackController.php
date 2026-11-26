<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Feedback;
use App\Models\AdminActivityLog;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class AdminFeedbackController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'player_name' => 'required|string|max:100',
            'player_email' => 'required|email|max:150',
            'category' => 'required|in:bug,gameplay,graphics,audio,general',
            'subject' => 'required|string|max:150',
            'message' => 'required|string|max:3000',
        ]);

        $feedback = Feedback::create([
            'user_id' => auth()->id(),
            'player_name' => $validated['player_name'],
            'player_email' => $validated['player_email'],
            'category' => $validated['category'],
            'subject' => $validated['subject'],
            'message' => $validated['message'],
            'status' => 'new',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Feedback submitted successfully. Thank you for helping us improve Aervyn!',
            'ticket_id' => $feedback->id,
        ], 201);
    }

    public function index(Request $request): JsonResponse
    {
        $query = Feedback::with('user:id,name,email');

        if ($status = $request->input('status')) {
            $query->where('status', $status);
        }

        if ($category = $request->input('category')) {
            $query->where('category', $category);
        }

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('subject', 'like', "%{$search}%")
                  ->orWhere('message', 'like', "%{$search}%")
                  ->orWhere('player_name', 'like', "%{$search}%");
            });
        }

        $perPage = min((int) $request->input('per_page', 15), 100);
        $feedbacks = $query->orderByDesc('created_at')->paginate($perPage);

        return response()->json([
            'success' => true,
            'feedbacks' => $feedbacks,
        ]);
    }

    public function update(Request $request, $id): JsonResponse
    {
        $feedback = Feedback::find($id);

        if (!$feedback) {
            return response()->json([
                'success' => false,
                'message' => 'Feedback record not found.'
            ], 404);
        }

        $validated = $request->validate([
            'status' => 'required|in:new,in_progress,resolved,rejected',
            'admin_notes' => 'nullable|string|max:2000',
        ]);

        $oldStatus = $feedback->status;
        $feedback->status = $validated['status'];
        if (isset($validated['admin_notes'])) {
            $feedback->admin_notes = $validated['admin_notes'];
        }

        if ($validated['status'] === 'resolved' && !$feedback->resolved_at) {
            $feedback->resolved_at = now();
        } elseif ($validated['status'] !== 'resolved') {
            $feedback->resolved_at = null;
        }

        $feedback->save();

        AdminActivityLog::log(
            'update_feedback',
            'Feedback',
            (string) $feedback->id,
            [
                'ticket_id' => $feedback->id,
                'old_status' => $oldStatus,
                'new_status' => $feedback->status,
                'admin_notes' => $feedback->admin_notes,
            ]
        );

        return response()->json([
            'success' => true,
            'message' => 'Feedback ticket updated successfully.',
            'feedback' => $feedback,
        ]);
    }
}
