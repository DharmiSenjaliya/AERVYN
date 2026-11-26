<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\GameController;
use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\AdminPlayerController;
use App\Http\Controllers\Admin\AdminWorldController;
use App\Http\Controllers\Admin\AdminMissionController;
use App\Http\Controllers\Admin\AdminCollectibleController;
use App\Http\Controllers\Admin\AdminAnalyticsController;
use App\Http\Controllers\Admin\AdminSessionController;
use App\Http\Controllers\Admin\AdminFeedbackController;
use App\Http\Controllers\Admin\AdminUserController;
use App\Http\Controllers\Admin\AdminActivityLogController;
use App\Http\Controllers\Admin\AdminSettingController;
use App\Http\Controllers\Admin\AdminMediaController;
use App\Http\Controllers\Player\PlayerDashboardController;
use App\Http\Controllers\Player\PlayerProfileController;
use App\Http\Controllers\Player\PlayerAchievementController;
use App\Http\Controllers\Player\PlayerStatisticsController;
use App\Http\Controllers\Player\PlayerLeaderboardController;
use App\Http\Controllers\Social\SocialHubController;
use App\Http\Controllers\Social\PlayerSearchController;
use App\Http\Controllers\Social\FriendController;
use App\Http\Controllers\Social\BlockController;
use App\Http\Controllers\Social\ChallengeController;
use App\Http\Controllers\Social\SocialNotificationController;
use App\Http\Controllers\Social\SocialPrivacyController;
use App\Http\Controllers\Social\SocialReportController;
use App\Http\Controllers\Social\SocialLeaderboardController;
use App\Http\Controllers\Admin\AdminSocialController;

/*
|--------------------------------------------------------------------------
| AERVYN: Echoes of Time - REST API Routes
|--------------------------------------------------------------------------
*/

// Public Authentication & Feedback Endpoints
Route::prefix('auth')->middleware('throttle:auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
});
Route::post('/feedback', [AdminFeedbackController::class, 'store'])->middleware('throttle:auth');

// Authenticated Routes (Sanctum Guard)
Route::middleware('auth:sanctum')->group(function () {
    // Current User Profile
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/auth/logout', [AuthController::class, 'logout']);

    // Game Engine State & Progress Persistence
    Route::prefix('game')->group(function () {
        Route::get('/state', [GameController::class, 'getState']);
        Route::get('/campaign-summary', [GameController::class, 'getCampaignSummary']);
        Route::post('/save', [GameController::class, 'saveProgress']);
        Route::post('/checkpoint', [GameController::class, 'reachCheckpoint']);
        Route::post('/complete-world', [GameController::class, 'completeWorld']);
        Route::post('/reset', [GameController::class, 'resetRun']);
    });

    // Player Dashboard, Profile, Achievements & Leaderboard
    Route::prefix('player')->group(function () {
        Route::get('/dashboard', [PlayerDashboardController::class, 'dashboard']);
        Route::get('/profile', [PlayerProfileController::class, 'show']);
        Route::put('/profile', [PlayerProfileController::class, 'update']);
        Route::post('/change-password', [PlayerProfileController::class, 'changePassword']);
        Route::get('/statistics', [PlayerStatisticsController::class, 'index']);
        Route::get('/achievements', [PlayerAchievementController::class, 'index']);
        Route::post('/achievements/check', [PlayerAchievementController::class, 'check']);
        Route::get('/leaderboard', [PlayerLeaderboardController::class, 'index']);
    });

    // Online Social Hub, Friends, Challenges, Notifications & Privacy
    Route::prefix('social')->group(function () {
        Route::get('/hub', [SocialHubController::class, 'index']);
        Route::get('/search', [PlayerSearchController::class, 'search']);
        Route::get('/profile/{id}', [PlayerSearchController::class, 'publicProfile']);

        // Friends
        Route::get('/friends', [FriendController::class, 'index']);
        Route::get('/requests', [FriendController::class, 'requests']);
        Route::post('/requests', [FriendController::class, 'sendRequest']);
        Route::post('/requests/{id}/accept', [FriendController::class, 'acceptRequest']);
        Route::post('/requests/{id}/reject', [FriendController::class, 'rejectRequest']);
        Route::post('/requests/{id}/cancel', [FriendController::class, 'cancelRequest']);
        Route::delete('/friends/{friendId}', [FriendController::class, 'removeFriend']);

        // Blocks
        Route::get('/blocks', [BlockController::class, 'index']);
        Route::post('/blocks', [BlockController::class, 'block']);
        Route::delete('/blocks/{blockedUserId}', [BlockController::class, 'unblock']);

        // Challenges
        Route::get('/challenges/templates', [ChallengeController::class, 'templates']);
        Route::get('/challenges', [ChallengeController::class, 'index']);
        Route::post('/challenges', [ChallengeController::class, 'create']);
        Route::post('/challenges/{id}/accept', [ChallengeController::class, 'accept']);
        Route::post('/challenges/{id}/reject', [ChallengeController::class, 'reject']);
        Route::post('/challenges/{id}/cancel', [ChallengeController::class, 'cancel']);
        Route::post('/challenges/{id}/submit', [ChallengeController::class, 'submitResult']);

        // Notifications
        Route::get('/notifications', [SocialNotificationController::class, 'index']);
        Route::post('/notifications/{id}/read', [SocialNotificationController::class, 'markRead']);
        Route::post('/notifications/read-all', [SocialNotificationController::class, 'markAllRead']);

        // Privacy
        Route::get('/privacy', [SocialPrivacyController::class, 'show']);
        Route::put('/privacy', [SocialPrivacyController::class, 'update']);

        // Reports
        Route::post('/reports', [SocialReportController::class, 'store']);

        // Leaderboard
        Route::get('/leaderboard', [SocialLeaderboardController::class, 'index']);
    });

    // Professional Admin Panel Endpoints (Admin Guard)
    Route::middleware('admin')->prefix('admin')->group(function () {
        // 1. Dashboard
        Route::get('/dashboard-stats', [AdminDashboardController::class, 'stats']);

        // 2. Players
        Route::get('/players', [AdminPlayerController::class, 'index']);
        Route::get('/players/{id}', [AdminPlayerController::class, 'show']);
        Route::post('/players/{id}/status', [AdminPlayerController::class, 'updateStatus']);

        // 3. Worlds
        Route::get('/worlds', [AdminWorldController::class, 'index']);
        Route::get('/worlds/{id}', [AdminWorldController::class, 'show']);
        Route::put('/worlds/{id}', [AdminWorldController::class, 'update']);
        Route::post('/worlds/{id}/thumbnail', [AdminWorldController::class, 'uploadThumbnail']);

        // 4. Missions
        Route::get('/missions', [AdminMissionController::class, 'index']);
        Route::get('/missions/{id}', [AdminMissionController::class, 'show']);
        Route::put('/missions/{id}', [AdminMissionController::class, 'update']);

        // 5. Collectibles & Story Content
        Route::get('/collectibles', [AdminCollectibleController::class, 'index']);
        Route::get('/collectibles/{id}', [AdminCollectibleController::class, 'show']);
        Route::put('/collectibles/{id}', [AdminCollectibleController::class, 'update']);

        // 6. Analytics
        Route::get('/analytics', [AdminAnalyticsController::class, 'index']);

        // 7. Game Sessions
        Route::get('/sessions', [AdminSessionController::class, 'index']);

        // 8. Feedback & Support
        Route::get('/feedback', [AdminFeedbackController::class, 'index']);
        Route::put('/feedback/{id}', [AdminFeedbackController::class, 'update']);

        // 9. Admin Users
        Route::get('/users', [AdminUserController::class, 'index']);
        Route::post('/users', [AdminUserController::class, 'store']);
        Route::put('/users/{id}', [AdminUserController::class, 'update']);
        Route::post('/users/{id}/toggle-status', [AdminUserController::class, 'toggleStatus']);

        // 10. Activity Logs
        Route::get('/activity-logs', [AdminActivityLogController::class, 'index']);

        // 11. Settings & Password
        Route::get('/settings', [AdminSettingController::class, 'index']);
        Route::put('/settings', [AdminSettingController::class, 'update']);
        Route::post('/settings/maintenance', [AdminSettingController::class, 'toggleMaintenance']);
        Route::post('/change-password', [AdminSettingController::class, 'changePassword']);

        // 12. Media & Asset Management
        Route::get('/media', [AdminMediaController::class, 'index']);
        Route::post('/media/upload', [AdminMediaController::class, 'upload']);
        Route::delete('/media/{filename}', [AdminMediaController::class, 'destroy']);

        // 13. Social Moderation & Challenge Management
        Route::get('/social/overview', [AdminSocialController::class, 'index']);
        Route::get('/social/reports', [AdminSocialController::class, 'reports']);
        Route::put('/social/reports/{id}', [AdminSocialController::class, 'updateReport']);
        Route::get('/social/challenges', [AdminSocialController::class, 'challenges']);
        Route::post('/social/users/{userId}/suspend', [AdminSocialController::class, 'toggleSuspension']);
    });
});
