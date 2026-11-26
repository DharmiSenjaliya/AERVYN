<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AdminActivityLog;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class AdminActivityLogController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = AdminActivityLog::query();

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('admin_name', 'like', "%{$search}%")
                  ->orWhere('action', 'like', "%{$search}%")
                  ->orWhere('entity_type', 'like', "%{$search}%");
            });
        }

        if ($action = $request->input('action')) {
            $query->where('action', $action);
        }

        $perPage = min((int) $request->input('per_page', 20), 100);
        $logs = $query->orderByDesc('created_at')->paginate($perPage);

        return response()->json([
            'success' => true,
            'logs' => $logs,
        ]);
    }
}
