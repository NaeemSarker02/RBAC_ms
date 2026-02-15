<?php

use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\UserController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API V1 Routes
|--------------------------------------------------------------------------
*/

// Public routes
Route::prefix('auth')->group(function () {
    Route::post('register', [AuthController::class, 'register']);
    Route::post('login', [AuthController::class, 'login']);
});

// Protected routes
Route::middleware(['auth:sanctum', 'active.user'])->group(function () {
    
    // Auth routes
    Route::prefix('auth')->group(function () {
        Route::get('profile', [AuthController::class, 'profile']);
        Route::get('permissions', [AuthController::class, 'permissions']);
        Route::post('logout', [AuthController::class, 'logout']);
        Route::post('logout-all', [AuthController::class, 'logoutAll']);
        Route::post('refresh-token', [AuthController::class, 'refreshToken']);
    });

    // User Management routes
    Route::prefix('users')->group(function () {
        // List users
        Route::get('/', [UserController::class, 'index'])
            ->middleware('permission:user_list');

        // Create user
        Route::post('/', [UserController::class, 'store'])
            ->middleware('permission:user_create');

        // View user
        Route::get('/{id}', [UserController::class, 'show'])
            ->middleware('permission:user_view');

        // Update user
        Route::put('/{id}', [UserController::class, 'update'])
            ->middleware('permission:user_edit');

        // Delete user
        Route::delete('/{id}', [UserController::class, 'destroy'])
            ->middleware('permission:user_delete');

        // Activate user
        Route::post('/{id}/activate', [UserController::class, 'activate'])
            ->middleware('permission:user_edit');

        // Deactivate user
        Route::post('/{id}/deactivate', [UserController::class, 'deactivate'])
            ->middleware('permission:user_edit');
    });
});