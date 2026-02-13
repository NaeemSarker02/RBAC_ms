<?php

namespace App\Repositories\Contracts;

use App\Models\Role;
use Illuminate\Database\Eloquent\Collection;

interface RoleRepositoryInterface extends RepositoryInterface
{
    /**
     * Find role by slug.
     *
     * @param string $slug
     * @return Role|null
     */
    public function findBySlug(string $slug): ?Role;

    /**
     * Get all active roles.
     *
     * @return Collection
     */
    public function getActiveRoles(): Collection;

    /**
     * Get roles with permissions.
     *
     * @return Collection
     */
    public function getRolesWithPermissions(): Collection;

    /**
     * Assign permission to role.
     *
     * @param int $roleId
     * @param int $permissionId
     * @return bool
     */
    public function assignPermission(int $roleId, int $permissionId): bool;

    /**
     * Remove permission from role.
     *
     * @param int $roleId
     * @param int $permissionId
     * @return bool
     */
    public function removePermission(int $roleId, int $permissionId): bool;

    /**
     * Sync role permissions.
     *
     * @param int $roleId
     * @param array $permissionIds
     * @return array
     */
    public function syncPermissions(int $roleId, array $permissionIds): array;
}