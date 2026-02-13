<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckActiveUser
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (!auth()->check()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthenticated. Please login to continue.',
            ], Response::HTTP_UNAUTHORIZED);
        }

        $user = auth()->user();

        if (!$user->is_active) {
            // Revoke all tokens for inactive user
            $user->tokens()->delete();

            return response()->json([
                'success' => false,
                'message' => 'Your account has been deactivated. Please contact support.',
            ], Response::HTTP_FORBIDDEN);
        }

        return $next($request);
    }
}