<?php

namespace App\Http\Controllers;

use App\Models\BuyerInquiry;
use App\Models\CommercialDemoTelemetry;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class BuyerInquiryController extends Controller
{
    /**
     * Store commercial buyer inquiry / B2B licensing request.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|min:2|max:100',
            'email' => 'required|email|max:150',
            'phone' => 'nullable|string|max:50',
            'company' => 'nullable|string|max:150',
            'country' => 'nullable|string|max:100',
            'inquiry_type' => 'required|string|in:game_purchase,b2b_licensing,customization,reskin,white_label,technical_inquiry,partnership,other',
            'budget_range' => 'nullable|string|max:50',
            'preferred_contact' => 'nullable|string|in:email,phone,whatsapp',
            'message' => 'required|string|min:10|max:3000',
        ]);

        // Auto-assign high priority for direct game buyouts or large budgets
        $priority = 'medium';
        if (in_array($validated['inquiry_type'], ['game_purchase', 'white_label'])) {
            $priority = 'high';
        }

        $inquiry = BuyerInquiry::create([
            'name' => strip_tags($validated['name']),
            'email' => strtolower(trim($validated['email'])),
            'phone' => isset($validated['phone']) ? strip_tags($validated['phone']) : null,
            'company' => isset($validated['company']) ? strip_tags($validated['company']) : null,
            'country' => isset($validated['country']) ? strip_tags($validated['country']) : null,
            'inquiry_type' => $validated['inquiry_type'],
            'budget_range' => isset($validated['budget_range']) ? strip_tags($validated['budget_range']) : null,
            'preferred_contact' => $validated['preferred_contact'] ?? 'email',
            'message' => strip_tags($validated['message']),
            'status' => 'new',
            'priority' => $priority,
            'ip_address' => $request->ip(),
        ]);

        return response()->json([
            'success' => true,
            'status' => 'success',
            'message' => 'Thank you for your inquiry. The AERVYN commercial licensing team will review your request and respond promptly.',
            'inquiry_id' => $inquiry->id,
        ], 201);
    }

    /**
     * Record sandboxed buyer demo milestone telemetry (zero PII)
     */
    public function recordDemoTelemetry(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'session_id' => 'required|string|max:64',
            'milestone_step' => 'required|integer|min:1|max:3',
            'completed' => 'required|boolean',
            'duration_seconds' => 'nullable|integer|min:0',
        ]);

        CommercialDemoTelemetry::create([
            'session_id' => $validated['session_id'],
            'milestone_step' => $validated['milestone_step'],
            'completed' => $validated['completed'],
            'duration_seconds' => $validated['duration_seconds'] ?? 0,
            'ip_address' => $request->ip(),
            'user_agent' => substr($request->userAgent() ?? '', 0, 500),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Demo telemetry recorded.',
        ]);
    }
}
