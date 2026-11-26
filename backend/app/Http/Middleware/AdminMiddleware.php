<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthenticated.'
            ], 401);
        }

        if (!$user->isAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'Forbidden. Administrator privileges required.'
            ], 403);
        }

        if ($user->is_banned || !$user->is_active) {
            return response()->json([
                'success' => false,
                'message' => 'Your administrative account has been deactivated.'
            ], 403);
        }

        return $next($request);
    }
}
