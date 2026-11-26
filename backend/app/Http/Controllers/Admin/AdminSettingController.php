<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\GameSetting;
use App\Models\AdminActivityLog;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

class AdminSettingController extends Controller
{
    public function index(): JsonResponse
    {
        $settings = GameSetting::all()->groupBy('category');

        return response()->json([
            'success' => true,
            'settings' => $settings,
        ]);
    }

    public function update(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'settings' => 'required|array',
            'settings.*.key' => 'required|string',
            'settings.*.value' => 'nullable|string|max:2000',
        ]);

        $updatedKeys = [];
        foreach ($validated['settings'] as $item) {
            GameSetting::where('key', $item['key'])->update(['value' => $item['value'] ?? '']);
            $updatedKeys[] = $item['key'];
        }

        AdminActivityLog::log(
            'update_settings',
            'GameSetting',
            null,
            ['updated_keys' => $updatedKeys]
        );

        return response()->json([
            'success' => true,
            'message' => 'System settings updated successfully.',
        ]);
    }

    public function toggleMaintenance(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'enabled' => 'required|boolean',
            'reason' => 'nullable|string|max:255',
        ]);

        $isMaintenance = $validated['enabled'] ? 'true' : 'false';
        GameSetting::set('maintenance_mode', $isMaintenance, 'Global server maintenance lock', 'maintenance');
        if (!empty($validated['reason'])) {
            GameSetting::set('maintenance_reason', $validated['reason'], 'Notice message during maintenance', 'maintenance');
        }

        AdminActivityLog::log(
            $validated['enabled'] ? 'enable_maintenance_mode' : 'disable_maintenance_mode',
            'GameSetting',
            'maintenance_mode',
            ['enabled' => $validated['enabled'], 'reason' => $validated['reason'] ?? null]
        );

        return response()->json([
            'success' => true,
            'message' => $validated['enabled'] ? 'Maintenance mode enabled.' : 'Maintenance mode disabled.',
            'maintenance_mode' => $validated['enabled'],
        ]);
    }

    public function changePassword(Request $request): JsonResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'current_password' => 'required|string',
            'new_password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);

        if (!Hash::check($validated['current_password'], $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Current password does not match our records.'
            ], 422);
        }

        $user->password = Hash::make($validated['new_password']);
        $user->save();

        AdminActivityLog::log(
            'change_admin_password',
            'User',
            (string) $user->id,
            ['admin_name' => $user->name]
        );

        return response()->json([
            'success' => true,
            'message' => 'Password changed successfully.',
        ]);
    }
}
