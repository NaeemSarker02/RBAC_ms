<?php

namespace App\Http\Middleware;

use App\Services\PermissionService;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckPermission
{
    /**
     * @var PermissionService
     */
    protected $permissionService;

    /**
     * CheckPermission constructor.
     *
     * @param PermissionService $permissionService
     */
    public function __construct(PermissionService $permissionService)
    {
        $this->permissionService = $permissionService;
    }

    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string ...$permissions): Response
    {
        if (!auth()->check()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthenticated. Please login to continue.',
            ], Response::HTTP_UNAUTHORIZED);
        }

        $user = auth()->user();

        // Super Admin bypass (if configured in Gate)
        if ($user->hasRole('super_admin')) {
            return $next($request);
        }

        // Check if user has any of the required permissions
        if (!empty($permissions)) {
            $hasPermission = $this->permissionService->userHasAnyPermission($user, $permissions);

            if (!$hasPermission) {
                return response()->json([
                    'success' => false,
                    'message' => 'You do not have permission to perform this action.',
                    'required_permissions' => $permissions,
                ], Response::HTTP_FORBIDDEN);
            }
        }

        return $next($request);
    }
}