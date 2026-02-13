<?php

namespace App\Repositories\Contracts;

use App\Models\Permission;
use Illuminate\Database\Eloquent\Collection;

interface PermissionRepositoryInterface extends RepositoryInterface
{
    /**
     * Find permission by slug.
     *
     * @param string $slug
     * @return Permission|null
     */
    public function findBySlug(string $slug): ?Permission;

    /**
     * Get all active permissions.
     *
     * @return Collection
     */
    public function getActivePermissions(): Collection;

    /**
     * Get permissions by module.
     *
     * @param string $module
     * @return Collection
     */
    public function getPermissionsByModule(string $module): Collection;

    /**
     * Get all modules.
     *
     * @return array
     */
    public function getAllModules(): array;
}