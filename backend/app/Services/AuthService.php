<?php

namespace App\Services;

use App\Models\User;
use App\Repositories\Contracts\UserRepositoryInterface;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthService
{
    /**
     * @var UserRepositoryInterface
     */
    protected $userRepository;

    /**
     * AuthService constructor.
     *
     * @param UserRepositoryInterface $userRepository
     */
    public function __construct(UserRepositoryInterface $userRepository)
    {
        $this->userRepository = $userRepository;
    }

    /**
     * Register a new user.
     *
     * @param array $data
     * @return array
     */
    public function register(array $data): array
    {
        // Check if email already exists
        if ($this->userRepository->findByEmail($data['email'])) {
            throw ValidationException::withMessages([
                'email' => ['The email has already been taken.'],
            ]);
        }

        // Create user
        $user = $this->userRepository->create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'is_active' => true,
        ]);

        // Assign default role if provided
        if (isset($data['role_id'])) {
            $this->userRepository->assignRole($user->id, $data['role_id']);
        }

        // Generate token
        $token = $user->createToken('auth_token')->plainTextToken;

        // Update last login
        $this->userRepository->updateLastLogin($user->id);

        return [
            'user' => $user->load('roles.permissions'),
            'token' => $token,
            'token_type' => 'Bearer',
        ];
    }

    /**
     * Login user.
     *
     * @param array $credentials
     * @param string|null $deviceName
     * @return array
     * @throws ValidationException
     */
    public function login(array $credentials, ?string $deviceName = null): array
    {
        // Find user by email
        $user = $this->userRepository->findByEmail($credentials['email']);

        // Validate user and password
        if (!$user || !Hash::check($credentials['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        // Check if user is active
        if (!$user->is_active) {
            throw ValidationException::withMessages([
                'email' => ['Your account has been deactivated. Please contact support.'],
            ]);
        }

        // Generate token
        $tokenName = $deviceName ?? 'auth_token';
        $token = $user->createToken($tokenName)->plainTextToken;

        // Update last login
        $this->userRepository->updateLastLogin($user->id);

        return [
            'user' => $user->load('roles.permissions'),
            'token' => $token,
            'token_type' => 'Bearer',
        ];
    }

    /**
     * Logout user (revoke current token).
     *
     * @param User $user
     * @return bool
     */
    public function logout(User $user): bool
    {
        // Revoke current token
        $user->currentAccessToken()->delete();
        
        return true;
    }

    /**
     * Logout from all devices (revoke all tokens).
     *
     * @param User $user
     * @return bool
     */
    public function logoutAll(User $user): bool
    {
        // Revoke all tokens
        $user->tokens()->delete();
        
        return true;
    }

    /**
     * Get authenticated user with roles and permissions.
     *
     * @param User $user
     * @return User
     */
    public function getAuthenticatedUser(User $user): User
    {
        return $user->load('roles.permissions');
    }

    /**
     * Refresh token.
     *
     * @param User $user
     * @param string|null $deviceName
     * @return array
     */
    public function refreshToken(User $user, ?string $deviceName = null): array
    {
        // Revoke current token
        $user->currentAccessToken()->delete();

        // Generate new token
        $tokenName = $deviceName ?? 'auth_token';
        $token = $user->createToken($tokenName)->plainTextToken;

        return [
            'token' => $token,
            'token_type' => 'Bearer',
        ];
    }
}