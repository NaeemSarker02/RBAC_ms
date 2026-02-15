<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Gate;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The model to policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        // 'App\Models\Model' => 'App\Policies\ModelPolicy',
    ];

    /**
     * Register any authentication / authorization services.
     */
    public function boot(): void
    {
        // Super Admin Bypass - has all permissions
        Gate::before(function ($user, $ability) {
            if ($user->hasRole('super_admin')) {
                return true;
            }
        });

        // Define dynamic gates for each permission
        $this->registerPermissionGates();
    }

    /**
     * Register permission-based gates dynamically.
     *
     * @return void
     */
    protected function registerPermissionGates(): void
    {
        // You can define specific gates here or load them dynamically
        Gate::define('create-user', function ($user) {
            return $user->hasPermission('user_create');
        });

        Gate::define('edit-user', function ($user) {
            return $user->hasPermission('user_edit');
        });

        Gate::define('delete-user', function ($user) {
            return $user->hasPermission('user_delete');
        });

        Gate::define('view-user', function ($user) {
            return $user->hasPermission('user_view');
        });

        Gate::define('list-users', function ($user) {
            return $user->hasPermission('user_list');
        });

        // Role gates
        Gate::define('manage-roles', function ($user) {
            return $user->hasAnyPermission(['role_create', 'role_edit', 'role_delete']);
        });

        // Permission gates
        Gate::define('manage-permissions', function ($user) {
            return $user->hasAnyPermission(['permission_create', 'permission_edit', 'permission_delete']);
        });
    }
}