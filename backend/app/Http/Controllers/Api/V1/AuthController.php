<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Resources\UserResource;
use App\Services\AuthService;
use App\Services\PermissionService;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    use ApiResponseTrait;

    /**
     * @var AuthService
     */
    protected $authService;

    /**
     * @var PermissionService
     */
    protected $permissionService;

    /**
     * AuthController constructor.
     *
     * @param AuthService $authService
     * @param PermissionService $permissionService
     */
    public function __construct(
        AuthService $authService,
        PermissionService $permissionService
    ) {
        $this->authService = $authService;
        $this->permissionService = $permissionService;
    }

    /**
     * Register a new user.
     *
     * @param RegisterRequest $request
     * @return JsonResponse
     */
    public function register(RegisterRequest $request): JsonResponse
    {
        try {
            $result = $this->authService->register($request->validated());

            return $this->createdResponse([
                'user' => new UserResource($result['user']),
                'access_token' => $result['token'],
                'token_type' => $result['token_type'],
            ], 'User registered successfully');

        } catch (ValidationException $e) {
            return $this->validationErrorResponse($e->errors());
        } catch (\Exception $e) {
            Log::error('Registration failed: ' . $e->getMessage());
            return $this->errorResponse('Registration failed. Please try again.', 500);
        }
    }

    /**
     * Login user.
     *
     * @param LoginRequest $request
     * @return JsonResponse
     */
    public function login(LoginRequest $request): JsonResponse
    {
        try {
            $credentials = $request->only('email', 'password');
            $deviceName = $request->input('device_name', 'web');

            $result = $this->authService->login($credentials, $deviceName);

            // Get user permissions
            $permissions = $this->permissionService->getUserPermissions($result['user']);

            return $this->successResponse([
                'user' => new UserResource($result['user']),
                'permissions' => $permissions,
                'access_token' => $result['token'],
                'token_type' => $result['token_type'],
            ], 'Login successful');

        } catch (ValidationException $e) {
            return $this->validationErrorResponse($e->errors());
        } catch (\Exception $e) {
            Log::error('Login failed: ' . $e->getMessage());
            return $this->errorResponse('Login failed. Please try again.', 500);
        }
    }

    /**
     * Get authenticated user profile.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function profile(Request $request): JsonResponse
    {
        try {
            $user = $this->authService->getAuthenticatedUser($request->user());
            $permissions = $this->permissionService->getUserPermissions($user);

            return $this->successResponse([
                'user' => new UserResource($user),
                'permissions' => $permissions,
            ], 'Profile retrieved successfully');

        } catch (\Exception $e) {
            Log::error('Failed to retrieve profile: ' . $e->getMessage());
            return $this->errorResponse('Failed to retrieve profile.', 500);
        }
    }

    /**
     * Logout user (revoke current token).
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function logout(Request $request): JsonResponse
    {
        try {
            $this->authService->logout($request->user());

            return $this->successResponse(null, 'Logged out successfully');

        } catch (\Exception $e) {
            Log::error('Logout failed: ' . $e->getMessage());
            return $this->errorResponse('Logout failed. Please try again.', 500);
        }
    }

    /**
     * Logout from all devices (revoke all tokens).
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function logoutAll(Request $request): JsonResponse
    {
        try {
            $this->authService->logoutAll($request->user());

            return $this->successResponse(null, 'Logged out from all devices successfully');

        } catch (\Exception $e) {
            Log::error('Logout all failed: ' . $e->getMessage());
            return $this->errorResponse('Logout failed. Please try again.', 500);
        }
    }

    /**
     * Refresh access token.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function refreshToken(Request $request): JsonResponse
    {
        try {
            $deviceName = $request->input('device_name', 'web');
            $result = $this->authService->refreshToken($request->user(), $deviceName);

            return $this->successResponse([
                'access_token' => $result['token'],
                'token_type' => $result['token_type'],
            ], 'Token refreshed successfully');

        } catch (\Exception $e) {
            Log::error('Token refresh failed: ' . $e->getMessage());
            return $this->errorResponse('Failed to refresh token.', 500);
        }
    }

    /**
     * Get user permissions.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function permissions(Request $request): JsonResponse
    {
        try {
            $permissions = $this->permissionService->getUserPermissions($request->user());

            return $this->successResponse([
                'permissions' => $permissions,
            ], 'Permissions retrieved successfully');

        } catch (\Exception $e) {
            Log::error('Failed to retrieve permissions: ' . $e->getMessage());
            return $this->errorResponse('Failed to retrieve permissions.', 500);
        }
    }
}