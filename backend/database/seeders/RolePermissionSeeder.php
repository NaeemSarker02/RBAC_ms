<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class RolePermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create Permissions
        $permissions = [
            // User Management
            [
                'name' => 'Create User',
                'slug' => 'user_create',
                'module' => 'users',
                'description' => 'Create new users in the system',
            ],
            [
                'name' => 'Edit User',
                'slug' => 'user_edit',
                'module' => 'users',
                'description' => 'Edit existing users',
            ],
            [
                'name' => 'View User',
                'slug' => 'user_view',
                'module' => 'users',
                'description' => 'View user details',
            ],
            [
                'name' => 'Delete User',
                'slug' => 'user_delete',
                'module' => 'users',
                'description' => 'Delete users from the system',
            ],
            [
                'name' => 'List Users',
                'slug' => 'user_list',
                'module' => 'users',
                'description' => 'View list of all users',
            ],

            // Role Management
            [
                'name' => 'Create Role',
                'slug' => 'role_create',
                'module' => 'roles',
                'description' => 'Create new roles',
            ],
            [
                'name' => 'Edit Role',
                'slug' => 'role_edit',
                'module' => 'roles',
                'description' => 'Edit existing roles',
            ],
            [
                'name' => 'View Role',
                'slug' => 'role_view',
                'module' => 'roles',
                'description' => 'View role details',
            ],
            [
                'name' => 'Delete Role',
                'slug' => 'role_delete',
                'module' => 'roles',
                'description' => 'Delete roles',
            ],
            [
                'name' => 'List Roles',
                'slug' => 'role_list',
                'module' => 'roles',
                'description' => 'View list of all roles',
            ],

            // Permission Management
            [
                'name' => 'Create Permission',
                'slug' => 'permission_create',
                'module' => 'permissions',
                'description' => 'Create new permissions',
            ],
            [
                'name' => 'Edit Permission',
                'slug' => 'permission_edit',
                'module' => 'permissions',
                'description' => 'Edit existing permissions',
            ],
            [
                'name' => 'View Permission',
                'slug' => 'permission_view',
                'module' => 'permissions',
                'description' => 'View permission details',
            ],
            [
                'name' => 'Delete Permission',
                'slug' => 'permission_delete',
                'module' => 'permissions',
                'description' => 'Delete permissions',
            ],
            [
                'name' => 'List Permissions',
                'slug' => 'permission_list',
                'module' => 'permissions',
                'description' => 'View list of all permissions',
            ],

            // Role-Permission Assignment
            [
                'name' => 'Assign Permission to Role',
                'slug' => 'role_permission_assign',
                'module' => 'roles',
                'description' => 'Assign permissions to roles',
            ],
            [
                'name' => 'Revoke Permission from Role',
                'slug' => 'role_permission_revoke',
                'module' => 'roles',
                'description' => 'Revoke permissions from roles',
            ],

            // User-Role Assignment
            [
                'name' => 'Assign Role to User',
                'slug' => 'user_role_assign',
                'module' => 'users',
                'description' => 'Assign roles to users',
            ],
            [
                'name' => 'Revoke Role from User',
                'slug' => 'user_role_revoke',
                'module' => 'users',
                'description' => 'Revoke roles from users',
            ],
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(
                ['slug' => $permission['slug']],
                $permission
            );
        }

        // Create Roles
        $superAdminRole = Role::firstOrCreate(
            ['slug' => 'super_admin'],
            [
                'name' => 'Super Admin',
                'description' => 'Has full access to all system features',
                'is_active' => true,
            ]
        );

        $managerRole = Role::firstOrCreate(
            ['slug' => 'manager'],
            [
                'name' => 'Manager',
                'description' => 'Can manage users and view reports',
                'is_active' => true,
            ]
        );

        $editorRole = Role::firstOrCreate(
            ['slug' => 'editor'],
            [
                'name' => 'Editor',
                'description' => 'Can edit content but limited admin access',
                'is_active' => true,
            ]
        );

        $viewerRole = Role::firstOrCreate(
            ['slug' => 'viewer'],
            [
                'name' => 'Viewer',
                'description' => 'Read-only access to the system',
                'is_active' => true,
            ]
        );

        // Assign all permissions to Super Admin
        $allPermissions = Permission::all();
        $superAdminRole->permissions()->sync($allPermissions->pluck('id')->toArray());

        // Assign specific permissions to Manager
        $managerPermissions = Permission::whereIn('slug', [
            'user_create',
            'user_edit',
            'user_view',
            'user_list',
            'role_view',
            'role_list',
            'permission_view',
            'permission_list',
            'user_role_assign',
            'user_role_revoke',
        ])->get();
        $managerRole->permissions()->sync($managerPermissions->pluck('id')->toArray());

        // Assign specific permissions to Editor
        $editorPermissions = Permission::whereIn('slug', [
            'user_view',
            'user_edit',
            'user_list',
        ])->get();
        $editorRole->permissions()->sync($editorPermissions->pluck('id')->toArray());

        // Assign specific permissions to Viewer
        $viewerPermissions = Permission::whereIn('slug', [
            'user_view',
            'user_list',
            'role_view',
            'role_list',
            'permission_view',
            'permission_list',
        ])->get();
        $viewerRole->permissions()->sync($viewerPermissions->pluck('id')->toArray());

        // Create Super Admin User
        $superAdmin = User::firstOrCreate(
            ['email' => 'superadmin@example.com'],
            [
                'name' => 'Super Admin',
                'password' => Hash::make('password'),
                'is_active' => true,
                'email_verified_at' => now(),
            ]
        );
        $superAdmin->roles()->sync([$superAdminRole->id]);

        // Create Manager User
        $manager = User::firstOrCreate(
            ['email' => 'manager@example.com'],
            [
                'name' => 'Manager User',
                'password' => Hash::make('password'),
                'is_active' => true,
                'email_verified_at' => now(),
            ]
        );
        $manager->roles()->sync([$managerRole->id]);

        // Create Editor User
        $editor = User::firstOrCreate(
            ['email' => 'editor@example.com'],
            [
                'name' => 'Editor User',
                'password' => Hash::make('password'),
                'is_active' => true,
                'email_verified_at' => now(),
            ]
        );
        $editor->roles()->sync([$editorRole->id]);

        // Create Viewer User
        $viewer = User::firstOrCreate(
            ['email' => 'viewer@example.com'],
            [
                'name' => 'Viewer User',
                'password' => Hash::make('password'),
                'is_active' => true,
                'email_verified_at' => now(),
            ]
        );
        $viewer->roles()->sync([$viewerRole->id]);

        $this->command->info('Roles and Permissions seeded successfully!');
        $this->command->info('Super Admin: superadmin@example.com / password');
        $this->command->info('Manager: manager@example.com / password');
        $this->command->info('Editor: editor@example.com / password');
        $this->command->info('Viewer: viewer@example.com / password');
    }
}