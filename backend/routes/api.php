<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\GameController;

/*
|--------------------------------------------------------------------------
| AERVYN: Echoes of Time - REST API Routes
|--------------------------------------------------------------------------
*/

// Public Authentication Endpoints
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
});

// Authenticated Routes (Sanctum Guard)
Route::middleware('auth:sanctum')->group(function () {
    // Current User Profile
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/auth/logout', [AuthController::class, 'logout']);

    // Game Engine State & Progress Persistence
    Route::prefix('game')->group(function () {
        Route::get('/state', [GameController::class, 'getState']);
        Route::post('/save', [GameController::class, 'saveProgress']);
        Route::post('/checkpoint', [GameController::class, 'reachCheckpoint']);
        Route::post('/complete-world', [GameController::class, 'completeWorld']);
        Route::post('/reset', [GameController::class, 'resetRun']);
    });
});
