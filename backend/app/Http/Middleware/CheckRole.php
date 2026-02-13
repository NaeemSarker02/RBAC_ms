<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        if (!auth()->check()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthenticated. Please login to continue.',
            ], Response::HTTP_UNAUTHORIZED);
        }

        $user = auth()->user();

        // Check if user has any of the required roles
        if (!empty($roles)) {
            $hasRole = $user->hasAnyRole($roles);

            if (!$hasRole) {
                return response()->json([
                    'success' => false,
                    'message' => 'You do not have the required role to access this resource.',
                    'required_roles' => $roles,
                ], Response::HTTP_FORBIDDEN);
            }
        }

        return $next($request);
    }
}