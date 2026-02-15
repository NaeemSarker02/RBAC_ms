<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Repositories\Contracts\UserRepositoryInterface;
use App\Services\PermissionService;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class UserController extends Controller
{
    use ApiResponseTrait;

    /**
     * @var UserRepositoryInterface
     */
    protected $userRepository;

    /**
     * @var PermissionService
     */
    protected $permissionService;

    /**
     * UserController constructor.
     *
     * @param UserRepositoryInterface $userRepository
     * @param PermissionService $permissionService
     */
    public function __construct(
        UserRepositoryInterface $userRepository,
        PermissionService $permissionService
    ) {
        $this->userRepository = $userRepository;
        $this->permissionService = $permissionService;
    }

    /**
     * Display a listing of users.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $perPage = $request->input('per_page', 15);
            $search = $request->input('search');

            if ($search) {
                $users = $this->userRepository->searchUsers($search, $perPage);
            } else {
                $users = $this->userRepository->getUsersWithRoles($perPage);
            }

            return $this->paginatedResponse($users, 'Users retrieved successfully');

        } catch (\Exception $e) {
            Log::error('Failed to retrieve users: ' . $e->getMessage());
            return $this->errorResponse('Failed to retrieve users.', 500);
        }
    }

    /**
     * Store a newly created user.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'name' => ['required', 'string', 'max:255'],
                'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
                'password' => [
                    'required',
                    'string',
                    'confirmed',
                    Password::min(8)->mixedCase()->numbers()->symbols()
                ],
                'role_ids' => ['nullable', 'array'],
                'role_ids.*' => ['integer', 'exists:roles,id'],
                'is_active' => ['nullable', 'boolean'],
            ]);

            $user = $this->userRepository->create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
                'is_active' => $validated['is_active'] ?? true,
            ]);

            // Assign roles if provided
            if (isset($validated['role_ids']) && !empty($validated['role_ids'])) {
                $this->userRepository->syncRoles($user->id, $validated['role_ids']);
            }

            // Clear permission cache
            $this->permissionService->clearUserPermissionsCache($user);

            $user = $this->userRepository->find($user->id);
            $user->load('roles.permissions');

            return $this->createdResponse(
                new UserResource($user),
                'User created successfully'
            );

        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->validationErrorResponse($e->errors());
        } catch (\Exception $e) {
            Log::error('Failed to create user: ' . $e->getMessage());
            return $this->errorResponse('Failed to create user.', 500);
        }
    }

    /**
     * Display the specified user.
     *
     * @param int $id
     * @return JsonResponse
     */
    public function show(int $id): JsonResponse
    {
        try {
            $user = $this->userRepository->find($id);

            if (!$user) {
                return $this->notFoundResponse('User not found');
            }

            $user->load('roles.permissions');

            return $this->successResponse(
                new UserResource($user),
                'User retrieved successfully'
            );

        } catch (\Exception $e) {
            Log::error('Failed to retrieve user: ' . $e->getMessage());
            return $this->errorResponse('Failed to retrieve user.', 500);
        }
    }

    /**
     * Update the specified user.
     *
     * @param Request $request
     * @param int $id
     * @return JsonResponse
     */
    public function update(Request $request, int $id): JsonResponse
    {
        try {
            $user = $this->userRepository->find($id);

            if (!$user) {
                return $this->notFoundResponse('User not found');
            }

            $validated = $request->validate([
                'name' => ['nullable', 'string', 'max:255'],
                'email' => ['nullable', 'string', 'email', 'max:255', Rule::unique('users')->ignore($id)],
                'password' => [
                    'nullable',
                    'string',
                    'confirmed',
                    Password::min(8)->mixedCase()->numbers()->symbols()
                ],
                'role_ids' => ['nullable', 'array'],
                'role_ids.*' => ['integer', 'exists:roles,id'],
                'is_active' => ['nullable', 'boolean'],
            ]);

            // Prepare update data
            $updateData = [];
            if (isset($validated['name'])) {
                $updateData['name'] = $validated['name'];
            }
            if (isset($validated['email'])) {
                $updateData['email'] = $validated['email'];
            }
            if (isset($validated['password'])) {
                $updateData['password'] = Hash::make($validated['password']);
            }
            if (isset($validated['is_active'])) {
                $updateData['is_active'] = $validated['is_active'];
            }

            // Update user
            if (!empty($updateData)) {
                $user = $this->userRepository->update($id, $updateData);
            }

            // Sync roles if provided
            if (isset($validated['role_ids'])) {
                $this->userRepository->syncRoles($user->id, $validated['role_ids']);
                // Clear permission cache
                $this->permissionService->clearUserPermissionsCache($user);
            }

            $user->load('roles.permissions');

            return $this->successResponse(
                new UserResource($user),
                'User updated successfully'
            );

        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->validationErrorResponse($e->errors());
        } catch (\Exception $e) {
            Log::error('Failed to update user: ' . $e->getMessage());
            return $this->errorResponse('Failed to update user.', 500);
        }
    }

    /**
     * Remove the specified user.
     *
     * @param int $id
     * @return JsonResponse
     */
    public function destroy(int $id): JsonResponse
    {
        try {
            $user = $this->userRepository->find($id);

            if (!$user) {
                return $this->notFoundResponse('User not found');
            }

            // Prevent self-deletion
            if (auth()->id() === $id) {
                return $this->errorResponse('You cannot delete your own account.', 400);
            }

            $this->userRepository->delete($id);

            // Clear permission cache
            $this->permissionService->clearUserPermissionsCache($user);

            return $this->successResponse(null, 'User deleted successfully');

        } catch (\Exception $e) {
            Log::error('Failed to delete user: ' . $e->getMessage());
            return $this->errorResponse('Failed to delete user.', 500);
        }
    }

    /**
     * Activate user.
     *
     * @param int $id
     * @return JsonResponse
     */
    public function activate(int $id): JsonResponse
    {
        try {
            $user = $this->userRepository->find($id);

            if (!$user) {
                return $this->notFoundResponse('User not found');
            }

            $this->userRepository->activateUser($id);

            return $this->successResponse(null, 'User activated successfully');

        } catch (\Exception $e) {
            Log::error('Failed to activate user: ' . $e->getMessage());
            return $this->errorResponse('Failed to activate user.', 500);
        }
    }

    /**
     * Deactivate user.
     *
     * @param int $id
     * @return JsonResponse
     */
    public function deactivate(int $id): JsonResponse
    {
        try {
            $user = $this->userRepository->find($id);

            if (!$user) {
                return $this->notFoundResponse('User not found');
            }

            // Prevent self-deactivation
            if (auth()->id() === $id) {
                return $this->errorResponse('You cannot deactivate your own account.', 400);
            }

            $this->userRepository->deactivateUser($id);

            // Revoke all tokens for deactivated user
            $user->tokens()->delete();

            return $this->successResponse(null, 'User deactivated successfully');

        } catch (\Exception $e) {
            Log::error('Failed to deactivate user: ' . $e->getMessage());
            return $this->errorResponse('Failed to deactivate user.', 500);
        }
    }
}