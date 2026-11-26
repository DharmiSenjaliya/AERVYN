<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\BuyerInquiry;
use App\Models\AdminActivityLog;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class AdminInquiryController extends Controller
{
    /**
     * List buyer inquiries with pagination and filters.
     */
    public function index(Request $request): JsonResponse
    {
        $status = $request->query('status');
        $type = $request->query('type');
        $search = trim($request->query('q', ''));

        $query = BuyerInquiry::latest();

        if ($status && $status !== 'all') {
            $query->where('status', $status);
        }

        if ($type && $type !== 'all') {
            $query->where('inquiry_type', $type);
        }

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'LIKE', "%{$search}%")
                  ->orWhere('email', 'LIKE', "%{$search}%")
                  ->orWhere('company', 'LIKE', "%{$search}%")
                  ->orWhere('country', 'LIKE', "%{$search}%");
            });
        }

        $inquiries = $query->paginate(20);

        return response()->json([
            'success' => true,
            'status' => 'success',
            'data' => $inquiries->items(),
            'pagination' => [
                'current_page' => $inquiries->currentPage(),
                'last_page' => $inquiries->lastPage(),
                'total' => $inquiries->total(),
            ],
            'metrics' => [
                'total' => BuyerInquiry::count(),
                'new' => BuyerInquiry::where('status', 'new')->count(),
                'contacted' => BuyerInquiry::where('status', 'contacted')->count(),
                'qualified' => BuyerInquiry::where('status', 'qualified')->count(),
                'closed' => BuyerInquiry::where('status', 'closed')->count(),
            ]
        ]);
    }

    /**
     * Update inquiry status and administrative resolution notes.
     */
    public function update(Request $request, $id): JsonResponse
    {
        $request->validate([
            'status' => 'required|in:new,contacted,qualified,closed',
            'admin_notes' => 'nullable|string|max:2000',
        ]);

        $inquiry = BuyerInquiry::findOrFail($id);
        $inquiry->status = $request->status;
        $inquiry->admin_notes = $request->admin_notes;
        $inquiry->save();

        AdminActivityLog::log(
            'INQUIRY_UPDATE',
            'buyer_inquiry',
            (string) $inquiry->id,
            [
                'status' => $inquiry->status,
                'email' => $inquiry->email,
                'company' => $inquiry->company,
                'type' => $inquiry->inquiry_type,
            ]
        );

        return response()->json([
            'success' => true,
            'status' => 'success',
            'message' => 'Buyer inquiry status updated.',
            'data' => $inquiry,
        ]);
    }
}
