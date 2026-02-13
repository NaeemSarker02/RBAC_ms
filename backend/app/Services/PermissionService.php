<?php

namespace App\Services;

use App\Models\User;
use App\Repositories\Contracts\PermissionRepositoryInterface;
use Illuminate\Support\Facades\Cache;

class PermissionService
{
    /**
     * @var PermissionRepositoryInterface
     */
    protected $permissionRepository;

    /**
     * Cache duration in seconds (1 hour).
     *
     * @var int
     */
    protected $cacheDuration = 3600;

    /**
     * PermissionService constructor.
     *
     * @param PermissionRepositoryInterface $permissionRepository
     */
    public function __construct(PermissionRepositoryInterface $permissionRepository)
    {
        $this->permissionRepository = $permissionRepository;
    }

    /**
     * Get user permissions with caching.
     *
     * @param User $user
     * @return array
     */
    public function getUserPermissions(User $user): array
    {
        $cacheKey = "user_permissions_{$user->id}";

        return Cache::remember($cacheKey, $this->cacheDuration, function () use ($user) {
            $permissions = [];

            foreach ($user->roles as $role) {
                foreach ($role->permissions as $permission) {
                    if ($permission->is_active) {
                        $permissions[$permission->slug] = [
                            'id' => $permission->id,
                            'name' => $permission->name,
                            'slug' => $permission->slug,
                            'module' => $permission->module,
                            'description' => $permission->description,
                        ];
                    }
                }
            }

            return array_values($permissions);
        });
    }

    /**
     * Get user permission slugs only.
     *
     * @param User $user
     * @return array
     */
    public function getUserPermissionSlugs(User $user): array
    {
        $cacheKey = "user_permission_slugs_{$user->id}";

        return Cache::remember($cacheKey, $this->cacheDuration, function () use ($user) {
            $slugs = [];

            foreach ($user->roles as $role) {
                foreach ($role->permissions as $permission) {
                    if ($permission->is_active) {
                        $slugs[] = $permission->slug;
                    }
                }
            }

            return array_unique($slugs);
        });
    }

    /**
     * Check if user has permission.
     *
     * @param User $user
     * @param string $permissionSlug
     * @return bool
     */
    public function userHasPermission(User $user, string $permissionSlug): bool
    {
        $permissions = $this->getUserPermissionSlugs($user);
        return in_array($permissionSlug, $permissions);
    }

    /**
     * Check if user has any of the given permissions.
     *
     * @param User $user
     * @param array $permissionSlugs
     * @return bool
     */
    public function userHasAnyPermission(User $user, array $permissionSlugs): bool
    {
        $userPermissions = $this->getUserPermissionSlugs($user);
        return count(array_intersect($userPermissions, $permissionSlugs)) > 0;
    }

    /**
     * Check if user has all of the given permissions.
     *
     * @param User $user
     * @param array $permissionSlugs
     * @return bool
     */
    public function userHasAllPermissions(User $user, array $permissionSlugs): bool
    {
        $userPermissions = $this->getUserPermissionSlugs($user);
        return count(array_intersect($userPermissions, $permissionSlugs)) === count($permissionSlugs);
    }

    /**
     * Clear user permissions cache.
     *
     * @param User $user
     * @return void
     */
    public function clearUserPermissionsCache(User $user): void
    {
        Cache::forget("user_permissions_{$user->id}");
        Cache::forget("user_permission_slugs_{$user->id}");
    }

    /**
     * Clear all permissions cache.
     *
     * @return void
     */
    public function clearAllPermissionsCache(): void
    {
        Cache::flush();
    }

    /**
     * Get all permissions grouped by module.
     *
     * @return array
     */
    public function getPermissionsGroupedByModule(): array
    {
        $cacheKey = "permissions_grouped_by_module";

        return Cache::remember($cacheKey, $this->cacheDuration, function () {
            $permissions = $this->permissionRepository->getActivePermissions();
            $grouped = [];

            foreach ($permissions as $permission) {
                $module = $permission->module ?? 'general';
                
                if (!isset($grouped[$module])) {
                    $grouped[$module] = [];
                }

                $grouped[$module][] = [
                    'id' => $permission->id,
                    'name' => $permission->name,
                    'slug' => $permission->slug,
                    'description' => $permission->description,
                ];
            }

            return $grouped;
        });
    }

    /**
     * Get all active permissions.
     *
     * @return array
     */
    public function getAllActivePermissions(): array
    {
        $cacheKey = "all_active_permissions";

        return Cache::remember($cacheKey, $this->cacheDuration, function () {
            return $this->permissionRepository->getActivePermissions()
                ->map(function ($permission) {
                    return [
                        'id' => $permission->id,
                        'name' => $permission->name,
                        'slug' => $permission->slug,
                        'module' => $permission->module,
                        'description' => $permission->description,
                    ];
                })
                ->toArray();
        });
    }
}