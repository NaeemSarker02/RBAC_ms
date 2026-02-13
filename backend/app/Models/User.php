<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'is_active',
        'last_login_at',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'last_login_at' => 'datetime',
            'is_active' => 'boolean',
            'password' => 'hashed',
        ];
    }

    /**
     * Get the roles assigned to the user.
     */
    public function roles()
    {
        return $this->belongsToMany(Role::class, 'role_user')
            ->withTimestamps();
    }

    /**
     * Get all permissions through roles.
     */
    public function permissions()
    {
        return $this->hasManyThrough(
            Permission::class,
            Role::class,
            'id', // Foreign key on roles table
            'id', // Foreign key on permissions table
            'id', // Local key on users table
            'id'  // Local key on roles table
        )->distinct();
    }

    /**
     * Check if user has a specific role.
     *
     * @param string $roleSlug
     * @return bool
     */
    public function hasRole(string $roleSlug): bool
    {
        return $this->roles()->where('slug', $roleSlug)->exists();
    }

    /**
     * Check if user has any of the given roles.
     *
     * @param array $roleSlugs
     * @return bool
     */
    public function hasAnyRole(array $roleSlugs): bool
    {
        return $this->roles()->whereIn('slug', $roleSlugs)->exists();
    }

    /**
     * Check if user has all of the given roles.
     *
     * @param array $roleSlugs
     * @return bool
     */
    public function hasAllRoles(array $roleSlugs): bool
    {
        return $this->roles()->whereIn('slug', $roleSlugs)->count() === count($roleSlugs);
    }

    /**
     * Check if user has a specific permission.
     *
     * @param string $permissionSlug
     * @return bool
     */
    public function hasPermission(string $permissionSlug): bool
    {
        return $this->roles()
            ->whereHas('permissions', function ($query) use ($permissionSlug) {
                $query->where('slug', $permissionSlug)
                    ->where('permissions.is_active', true);
            })
            ->exists();
    }

    /**
     * Check if user has any of the given permissions.
     *
     * @param array $permissionSlugs
     * @return bool
     */
    public function hasAnyPermission(array $permissionSlugs): bool
    {
        return $this->roles()
            ->whereHas('permissions', function ($query) use ($permissionSlugs) {
                $query->whereIn('slug', $permissionSlugs)
                    ->where('permissions.is_active', true);
            })
            ->exists();
    }

    /**
     * Assign a role to the user.
     *
     * @param int|Role $role
     * @return void
     */
    public function assignRole($role): void
    {
        $roleId = $role instanceof Role ? $role->id : $role;
        
        if (!$this->roles()->where('role_id', $roleId)->exists()) {
            $this->roles()->attach($roleId);
        }
    }

    /**
     * Remove a role from the user.
     *
     * @param int|Role $role
     * @return void
     */
    public function removeRole($role): void
    {
        $roleId = $role instanceof Role ? $role->id : $role;
        $this->roles()->detach($roleId);
    }

    /**
     * Sync roles for the user.
     *
     * @param array $roleIds
     * @return void
     */
    public function syncRoles(array $roleIds): void
    {
        $this->roles()->sync($roleIds);
    }
}