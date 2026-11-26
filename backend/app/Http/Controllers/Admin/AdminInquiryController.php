<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\BuyerInquiry;
use App\Models\CommercialDemoTelemetry;
use App\Models\AdminActivityLog;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\StreamedResponse;

class AdminInquiryController extends Controller
{
    /**
     * List buyer inquiries with pagination, priority, and filters.
     */
    public function index(Request $request): JsonResponse
    {
        $status = $request->query('status');
        $priority = $request->query('priority');
        $type = $request->query('type');
        $search = trim($request->query('q', ''));

        $query = BuyerInquiry::latest();

        if ($status && $status !== 'all') {
            $query->where('status', $status);
        }

        if ($priority && $priority !== 'all') {
            $query->where('priority', $priority);
        }

        if ($type && $type !== 'all') {
            $query->where('inquiry_type', $type);
        }

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'LIKE', "%{$search}%")
                  ->orWhere('email', 'LIKE', "%{$search}%")
                  ->orWhere('company', 'LIKE', "%{$search}%")
                  ->orWhere('country', 'LIKE', "%{$search}%")
                  ->orWhere('phone', 'LIKE', "%{$search}%")
                  ->orWhere('message', 'LIKE', "%{$search}%");
            });
        }

        $inquiries = $query->paginate(25);

        // Demo telemetry summary
        $totalDemos = CommercialDemoTelemetry::count();
        $completedDemos = CommercialDemoTelemetry::where('completed', true)->count();
        $demoCompletionRate = $totalDemos > 0 ? round(($completedDemos / $totalDemos) * 100, 1) : 0;

        return response()->json([
            'success' => true,
            'status' => 'success',
            'data' => $inquiries->items(),
            'pagination' => [
                'current_page' => $inquiries->currentPage(),
                'last_page' => $inquiries->lastPage(),
                'total' => $inquiries->total(),
            ],
            'kpis' => [
                'total' => BuyerInquiry::count(),
                'new' => BuyerInquiry::where('status', 'new')->count(),
                'contacted' => BuyerInquiry::where('status', 'contacted')->count(),
                'discussion' => BuyerInquiry::where('status', 'discussion')->count(),
                'demo_sent' => BuyerInquiry::where('status', 'demo_sent')->count(),
                'negotiation' => BuyerInquiry::where('status', 'negotiation')->count(),
                'qualified' => BuyerInquiry::where('status', 'qualified')->count(),
                'won' => BuyerInquiry::where('status', 'won')->count(),
                'lost' => BuyerInquiry::where('status', 'lost')->count(),
                'closed' => BuyerInquiry::where('status', 'closed')->count(),
                'urgent_priority' => BuyerInquiry::where('priority', 'urgent')->count(),
                'high_priority' => BuyerInquiry::where('priority', 'high')->count(),
            ],
            'demo_stats' => [
                'total_demos' => $totalDemos,
                'completed_demos' => $completedDemos,
                'completion_rate_percent' => $demoCompletionRate,
            ]
        ]);
    }

    /**
     * Show single inquiry detail
     */
    public function show($id): JsonResponse
    {
        $inquiry = BuyerInquiry::findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $inquiry,
        ]);
    }

    /**
     * Update inquiry status, priority, and CRM notes.
     */
    public function update(Request $request, $id): JsonResponse
    {
        $request->validate([
            'status' => 'required|in:new,contacted,discussion,demo_sent,negotiation,won,lost,qualified,closed',
            'priority' => 'nullable|in:low,medium,high,urgent',
            'admin_notes' => 'nullable|string|max:3000',
            'follow_up_date' => 'nullable|date',
            'follow_up_notes' => 'nullable|string|max:2000',
        ]);

        $inquiry = BuyerInquiry::findOrFail($id);
        $inquiry->status = $request->status;
        if ($request->has('priority') && $request->priority) {
            $inquiry->priority = $request->priority;
        }
        $inquiry->admin_notes = $request->admin_notes;
        $inquiry->follow_up_date = $request->follow_up_date;
        $inquiry->follow_up_notes = $request->follow_up_notes;
        $inquiry->save();

        AdminActivityLog::log(
            'INQUIRY_UPDATE',
            'buyer_inquiry',
            (string) $inquiry->id,
            [
                'status' => $inquiry->status,
                'priority' => $inquiry->priority,
                'email' => $inquiry->email,
                'company' => $inquiry->company,
                'type' => $inquiry->inquiry_type,
            ]
        );

        return response()->json([
            'success' => true,
            'status' => 'success',
            'message' => 'Buyer inquiry updated successfully.',
            'data' => $inquiry,
        ]);
    }

    /**
     * Export buyer inquiries as safe CSV
     */
    public function exportCsv(Request $request): StreamedResponse
    {
        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="aervyn_buyer_leads_' . date('Y-m-d') . '.csv"',
            'Pragma' => 'no-cache',
            'Cache-Control' => 'must-revalidate, post-check=0, pre-check=0',
            'Expires' => '0',
        ];

        AdminActivityLog::log('EXPORT_BUYER_LEADS', 'buyer_inquiry', null, ['date' => date('Y-m-d')]);

        return response()->stream(function () {
            $handle = fopen('php://output', 'w');
            fputcsv($handle, ['ID', 'Date', 'Name', 'Email', 'Phone', 'Company', 'Country', 'Inquiry Type', 'Budget Range', 'Preferred Contact', 'Status', 'Priority', 'Follow Up Date', 'Admin Notes']);

            BuyerInquiry::chunk(100, function ($leads) use ($handle) {
                foreach ($leads as $lead) {
                    fputcsv($handle, [
                        $lead->id,
                        $lead->created_at->format('Y-m-d H:i'),
                        $lead->name,
                        $lead->email,
                        $lead->phone ?? '',
                        $lead->company ?? '',
                        $lead->country ?? '',
                        $lead->inquiry_type,
                        $lead->budget_range ?? '',
                        $lead->preferred_contact ?? 'email',
                        $lead->status,
                        $lead->priority,
                        $lead->follow_up_date ? $lead->follow_up_date->format('Y-m-d') : '',
                        str_replace(["\r", "\n"], ' ', $lead->admin_notes ?? ''),
                    ]);
                }
            });

            fclose($handle);
        }, 200, $headers);
    }

    /**
     * Get commercial conversion telemetry analytics
     */
    public function analytics(): JsonResponse
    {
        $totalDemos = CommercialDemoTelemetry::count();
        $completedDemos = CommercialDemoTelemetry::where('completed', true)->count();
        $m1 = CommercialDemoTelemetry::where('milestone_step', '>=', 1)->count();
        $m2 = CommercialDemoTelemetry::where('milestone_step', '>=', 2)->count();
        $m3 = CommercialDemoTelemetry::where('milestone_step', '>=', 3)->count();

        $byType = BuyerInquiry::selectRaw('inquiry_type, count(*) as count')
            ->groupBy('inquiry_type')
            ->pluck('count', 'inquiry_type');

        $byStatus = BuyerInquiry::selectRaw('status, count(*) as count')
            ->groupBy('status')
            ->pluck('count', 'status');

        $byPriority = BuyerInquiry::selectRaw('priority, count(*) as count')
            ->groupBy('priority')
            ->pluck('count', 'priority');

        return response()->json([
            'success' => true,
            'demo_funnel' => [
                'total_starts' => $totalDemos,
                'milestone_1_fragment' => $m1,
                'milestone_2_puzzle' => $m2,
                'milestone_3_portal' => $m3,
                'completions' => $completedDemos,
                'completion_rate' => $totalDemos > 0 ? round(($completedDemos / $totalDemos) * 100, 1) : 0,
            ],
            'leads_by_type' => $byType,
            'leads_by_status' => $byStatus,
            'leads_by_priority' => $byPriority,
        ]);
    }
}
