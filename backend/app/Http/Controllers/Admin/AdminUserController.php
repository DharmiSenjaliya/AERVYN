<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\AdminActivityLog;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class AdminUserController extends Controller
{
    protected array $adminRoles = ['super_admin', 'admin', 'game_manager', 'support_manager', 'analyst'];

    public function index(): JsonResponse
    {
        $admins = User::whereIn('role', $this->adminRoles)
            ->orderBy('id')
            ->get(['id', 'name', 'email', 'role', 'is_active', 'created_at', 'last_login_at']);

        return response()->json([
            'success' => true,
            'admins' => $admins,
            'available_roles' => [
                'super_admin' => 'Super Admin (Full Access)',
                'game_manager' => 'Game Manager (Worlds, Missions & Content)',
                'support_manager' => 'Support Manager (Feedback & Player Inquiries)',
                'analyst' => 'Analyst (Telemetry & Game Analytics)',
            ],
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'email' => 'required|email|max:150|unique:users,email',
            'password' => 'required|string|min:8|max:100',
            'role' => ['required', Rule::in($this->adminRoles)],
        ]);

        $admin = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'],
            'level' => 99,
            'xp' => 50000,
            'is_active' => true,
        ]);

        AdminActivityLog::log(
            'create_admin_user',
            'User',
            (string) $admin->id,
            [
                'created_admin_name' => $admin->name,
                'created_admin_email' => $admin->email,
                'role' => $admin->role,
            ]
        );

        return response()->json([
            'success' => true,
            'message' => "Admin user '{$admin->name}' created successfully.",
            'admin' => $admin->only(['id', 'name', 'email', 'role', 'is_active', 'created_at']),
        ], 201);
    }

    public function update(Request $request, $id): JsonResponse
    {
        $admin = User::whereIn('role', $this->adminRoles)->find($id);

        if (!$admin) {
            return response()->json([
                'success' => false,
                'message' => 'Admin user not found.'
            ], 404);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'email' => ['required', 'email', 'max:150', Rule::unique('users', 'email')->ignore($admin->id)],
            'role' => ['required', Rule::in($this->adminRoles)],
            'password' => 'nullable|string|min:8|max:100',
        ]);

        $oldRole = $admin->role;
        $admin->name = $validated['name'];
        $admin->email = $validated['email'];
        $admin->role = $validated['role'];

        if (!empty($validated['password'])) {
            $admin->password = Hash::make($validated['password']);
        }

        $admin->save();

        AdminActivityLog::log(
            'update_admin_user',
            'User',
            (string) $admin->id,
            [
                'admin_name' => $admin->name,
                'admin_email' => $admin->email,
                'old_role' => $oldRole,
                'new_role' => $admin->role,
            ]
        );

        return response()->json([
            'success' => true,
            'message' => "Admin account '{$admin->name}' updated successfully.",
            'admin' => $admin->only(['id', 'name', 'email', 'role', 'is_active', 'created_at']),
        ]);
    }

    public function toggleStatus(Request $request, $id): JsonResponse
    {
        $currentUserId = auth()->id();
        if ($currentUserId == $id) {
            return response()->json([
                'success' => false,
                'message' => 'You cannot deactivate your own administrative account.'
            ], 400);
        }

        $admin = User::whereIn('role', $this->adminRoles)->find($id);

        if (!$admin) {
            return response()->json([
                'success' => false,
                'message' => 'Admin user not found.'
            ], 404);
        }

        $admin->is_active = !$admin->is_active;
        $admin->save();

        $action = $admin->is_active ? 'activated' : 'deactivated';

        AdminActivityLog::log(
            "admin_{$action}",
            'User',
            (string) $admin->id,
            [
                'admin_name' => $admin->name,
                'is_active' => $admin->is_active,
            ]
        );

        return response()->json([
            'success' => true,
            'message' => "Admin account '{$admin->name}' {$action} successfully.",
            'is_active' => $admin->is_active,
        ]);
    }
}
