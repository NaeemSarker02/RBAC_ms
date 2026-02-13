<?php

namespace App\Repositories;

use App\Models\User;
use App\Repositories\Contracts\UserRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class EloquentUserRepository extends BaseRepository implements UserRepositoryInterface
{
    /**
     * EloquentUserRepository constructor.
     *
     * @param User $model
     */
    public function __construct(User $model)
    {
        parent::__construct($model);
    }

    /**
     * Find user by email.
     *
     * @param string $email
     * @return User|null
     */
    public function findByEmail(string $email): ?User
    {
        return $this->model->where('email', $email)->first();
    }

    /**
     * Get all active users.
     *
     * @param array $columns
     * @return Collection
     */
    public function getActiveUsers(array $columns = ['*']): Collection
    {
        return $this->model->where('is_active', true)->get($columns);
    }

    /**
     * Get users with roles.
     *
     * @param int $perPage
     * @return LengthAwarePaginator
     */
    public function getUsersWithRoles(int $perPage = 15): LengthAwarePaginator
    {
        return $this->model->with(['roles.permissions'])->paginate($perPage);
    }

    /**
     * Get users by role.
     *
     * @param string $roleSlug
     * @return Collection
     */
    public function getUsersByRole(string $roleSlug): Collection
    {
        return $this->model->whereHas('roles', function ($query) use ($roleSlug) {
            $query->where('slug', $roleSlug);
        })->get();
    }

    /**
     * Activate user.
     *
     * @param int $id
     * @return bool
     */
    public function activateUser(int $id): bool
    {
        $user = $this->findOrFail($id);
        return $user->update(['is_active' => true]);
    }

    /**
     * Deactivate user.
     *
     * @param int $id
     * @return bool
     */
    public function deactivateUser(int $id): bool
    {
        $user = $this->findOrFail($id);
        return $user->update(['is_active' => false]);
    }

    /**
     * Update last login timestamp.
     *
     * @param int $id
     * @return bool
     */
    public function updateLastLogin(int $id): bool
    {
        $user = $this->findOrFail($id);
        return $user->update(['last_login_at' => now()]);
    }

    /**
     * Assign role to user.
     *
     * @param int $userId
     * @param int $roleId
     * @return bool
     */
    public function assignRole(int $userId, int $roleId): bool
    {
        $user = $this->findOrFail($userId);
        
        if (!$user->roles()->where('role_id', $roleId)->exists()) {
            $user->roles()->attach($roleId);
            return true;
        }
        
        return false;
    }

    /**
     * Remove role from user.
     *
     * @param int $userId
     * @param int $roleId
     * @return bool
     */
    public function removeRole(int $userId, int $roleId): bool
    {
        $user = $this->findOrFail($userId);
        $user->roles()->detach($roleId);
        return true;
    }

    /**
     * Sync user roles.
     *
     * @param int $userId
     * @param array $roleIds
     * @return array
     */
    public function syncRoles(int $userId, array $roleIds): array
    {
        $user = $this->findOrFail($userId);
        return $user->roles()->sync($roleIds);
    }

    /**
     * Search users by name or email.
     *
     * @param string $search
     * @param int $perPage
     * @return LengthAwarePaginator
     */
    public function searchUsers(string $search, int $perPage = 15): LengthAwarePaginator
    {
        return $this->model
            ->where(function ($query) use ($search) {
                $query->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            })
            ->with('roles')
            ->paginate($perPage);
    }
}