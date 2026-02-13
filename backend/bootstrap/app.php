<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Illuminate\Auth\AuthenticationException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->alias([
            'permission' => \App\Http\Middleware\CheckPermission::class,
            'role' => \App\Http\Middleware\CheckRole::class,
            'active.user' => \App\Http\Middleware\CheckActiveUser::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        
        // ১. API এর জন্য NotFoundHttpException (৪-০-৪) হ্যান্ডেল করা
        $exceptions->render(function (NotFoundHttpException $e, Request $request) {
            if ($request->is('api/*')) {
                return response()->json([
                    'status' => 'Error',
                    'message' => 'Resource not found.'
                ], 404);
            }
        });

        // ২. ভ্যালিডেশন এরর হ্যান্ডেল করা
        $exceptions->render(function (ValidationException $e, Request $request) {
            if ($request->is('api/*')) {
                return response()->json([
                    'status' => 'Error',
                    'message' => 'Validation Failed',
                    'errors' => $e->errors(),
                ], 422);
            }
        });

        // ৩. অথেনটিকেশন এরর হ্যান্ডেল করা
        $exceptions->render(function (AuthenticationException $e, Request $request) {
            if ($request->is('api/*')) {
                return response()->json([
                    'status' => 'Error',
                    'message' => 'Unauthenticated access.'
                ], 401);
            }
        });
    })->create();