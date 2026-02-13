<?php

namespace App\Repositories;

use App\Models\Role;
use App\Repositories\Contracts\RoleRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class EloquentRoleRepository extends BaseRepository implements RoleRepositoryInterface
{
    /**
     * EloquentRoleRepository constructor.
     *
     * @param Role $model
     */
    public function __construct(Role $model)
    {
        parent::__construct($model);
    }

    /**
     * Find role by slug.
     *
     * @param string $slug
     * @return Role|null
     */
    public function findBySlug(string $slug): ?Role
    {
        return $this->model->where('slug', $slug)->first();
    }

    /**
     * Get all active roles.
     *
     * @return Collection
     */
    public function getActiveRoles(): Collection
    {
        return $this->model->where('is_active', true)->get();
    }

    /**
     * Get roles with permissions.
     *
     * @return Collection
     */
    public function getRolesWithPermissions(): Collection
    {
        return $this->model->with('permissions')->get();
    }

    /**
     * Assign permission to role.
     *
     * @param int $roleId
     * @param int $permissionId
     * @return bool
     */
    public function assignPermission(int $roleId, int $permissionId): bool
    {
        $role = $this->findOrFail($roleId);
        
        if (!$role->permissions()->where('permission_id', $permissionId)->exists()) {
            $role->permissions()->attach($permissionId);
            return true;
        }
        
        return false;
    }

    /**
     * Remove permission from role.
     *
     * @param int $roleId
     * @param int $permissionId
     * @return bool
     */
    public function removePermission(int $roleId, int $permissionId): bool
    {
        $role = $this->findOrFail($roleId);
        $role->permissions()->detach($permissionId);
        return true;
    }

    /**
     * Sync role permissions.
     *
     * @param int $roleId
     * @param array $permissionIds
     * @return array
     */
    public function syncPermissions(int $roleId, array $permissionIds): array
    {
        $role = $this->findOrFail($roleId);
        return $role->permissions()->sync($permissionIds);
    }
}