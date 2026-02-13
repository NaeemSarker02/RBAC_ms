<?php

namespace App\Repositories;

use App\Models\Permission;
use App\Repositories\Contracts\PermissionRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class EloquentPermissionRepository extends BaseRepository implements PermissionRepositoryInterface
{
    /**
     * EloquentPermissionRepository constructor.
     *
     * @param Permission $model
     */
    public function __construct(Permission $model)
    {
        parent::__construct($model);
    }

    /**
     * Find permission by slug.
     *
     * @param string $slug
     * @return Permission|null
     */
    public function findBySlug(string $slug): ?Permission
    {
        return $this->model->where('slug', $slug)->first();
    }

    /**
     * Get all active permissions.
     *
     * @return Collection
     */
    public function getActivePermissions(): Collection
    {
        return $this->model->where('is_active', true)->get();
    }

    /**
     * Get permissions by module.
     *
     * @param string $module
     * @return Collection
     */
    public function getPermissionsByModule(string $module): Collection
    {
        return $this->model->where('module', $module)->get();
    }

    /**
     * Get all modules.
     *
     * @return array
     */
    public function getAllModules(): array
    {
        return $this->model
            ->whereNotNull('module')
            ->distinct()
            ->pluck('module')
            ->toArray();
    }
}