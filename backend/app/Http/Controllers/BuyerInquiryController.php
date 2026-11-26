<?php

namespace App\Http\Controllers;

use App\Models\BuyerInquiry;
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
            'company' => 'nullable|string|max:150',
            'country' => 'nullable|string|max:100',
            'inquiry_type' => 'required|string|in:game_purchase,b2b_licensing,customization,reskin,technical_inquiry,partnership,other',
            'message' => 'required|string|min:10|max:3000',
        ]);

        $inquiry = BuyerInquiry::create([
            'name' => strip_tags($validated['name']),
            'email' => strtolower(trim($validated['email'])),
            'company' => isset($validated['company']) ? strip_tags($validated['company']) : null,
            'country' => isset($validated['country']) ? strip_tags($validated['country']) : null,
            'inquiry_type' => $validated['inquiry_type'],
            'message' => strip_tags($validated['message']),
            'status' => 'new',
            'ip_address' => $request->ip(),
        ]);

        return response()->json([
            'success' => true,
            'status' => 'success',
            'message' => 'Thank you for your inquiry. The AERVYN commercial licensing team will review your request and respond promptly.',
            'inquiry_id' => $inquiry->id,
        ], 201);
    }
}
