<?php

namespace App\Repositories\Contracts;

use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

interface UserRepositoryInterface extends RepositoryInterface
{
    /**
     * Find user by email.
     *
     * @param string $email
     * @return User|null
     */
    public function findByEmail(string $email): ?User;

    /**
     * Get all active users.
     *
     * @param array $columns
     * @return Collection
     */
    public function getActiveUsers(array $columns = ['*']): Collection;

    /**
     * Get users with roles.
     *
     * @param int $perPage
     * @return LengthAwarePaginator
     */
    public function getUsersWithRoles(int $perPage = 15): LengthAwarePaginator;

    /**
     * Get users by role.
     *
     * @param string $roleSlug
     * @return Collection
     */
    public function getUsersByRole(string $roleSlug): Collection;

    /**
     * Activate user.
     *
     * @param int $id
     * @return bool
     */
    public function activateUser(int $id): bool;

    /**
     * Deactivate user.
     *
     * @param int $id
     * @return bool
     */
    public function deactivateUser(int $id): bool;

    /**
     * Update last login timestamp.
     *
     * @param int $id
     * @return bool
     */
    public function updateLastLogin(int $id): bool;

    /**
     * Assign role to user.
     *
     * @param int $userId
     * @param int $roleId
     * @return bool
     */
    public function assignRole(int $userId, int $roleId): bool;

    /**
     * Remove role from user.
     *
     * @param int $userId
     * @param int $roleId
     * @return bool
     */
    public function removeRole(int $userId, int $roleId): bool;

    /**
     * Sync user roles.
     *
     * @param int $userId
     * @param array $roleIds
     * @return array
     */
    public function syncRoles(int $userId, array $roleIds): array;

    /**
     * Search users by name or email.
     *
     * @param string $search
     * @param int $perPage
     * @return LengthAwarePaginator
     */
    public function searchUsers(string $search, int $perPage = 15): LengthAwarePaginator;
}