<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'display_name',
        'email',
        'password',
        'role',
        'avatar',
        'bio',
        'title',
        'level',
        'xp',
        'is_active',
        'is_banned',
        'is_social_suspended',
        'social_suspended_reason',
        'last_login_at',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'last_login_at' => 'datetime',
            'password' => 'hashed',
            'is_active' => 'boolean',
            'is_banned' => 'boolean',
            'is_social_suspended' => 'boolean',
            'level' => 'integer',
            'xp' => 'integer',
        ];
    }

    public function progress()
    {
        return $this->hasOne(PlayerProgress::class);
    }

    public function allProgress()
    {
        return $this->hasMany(PlayerProgress::class);
    }

    public function sessions()
    {
        return $this->hasMany(GameSession::class);
    }

    public function feedback()
    {
        return $this->hasMany(Feedback::class);
    }

    public function activityLogs()
    {
        return $this->hasMany(AdminActivityLog::class, 'admin_id');
    }

    public function userAchievements()
    {
        return $this->hasMany(UserAchievement::class, 'user_id');
    }

    public function achievements()
    {
        return $this->belongsToMany(Achievement::class, 'user_achievements', 'user_id', 'achievement_id')
            ->withPivot('unlocked_at', 'xp_awarded')
            ->withTimestamps();
    }

    public function friendships()
    {
        return $this->hasMany(Friendship::class, 'user_id');
    }

    public function friends()
    {
        return $this->belongsToMany(User::class, 'friendships', 'user_id', 'friend_id')
            ->withTimestamps();
    }

    public function sentFriendRequests()
    {
        return $this->hasMany(FriendRequest::class, 'sender_id');
    }

    public function receivedFriendRequests()
    {
        return $this->hasMany(FriendRequest::class, 'receiver_id');
    }

    public function blockedPlayers()
    {
        return $this->hasMany(BlockedPlayer::class, 'user_id');
    }

    public function blockedByPlayers()
    {
        return $this->hasMany(BlockedPlayer::class, 'blocked_user_id');
    }

    public function challengesCreated()
    {
        return $this->hasMany(Challenge::class, 'challenger_id');
    }

    public function challengesReceived()
    {
        return $this->hasMany(Challenge::class, 'opponent_id');
    }

    public function socialNotifications()
    {
        return $this->hasMany(SocialNotification::class, 'user_id');
    }

    public function privacySettings()
    {
        return $this->hasOne(PlayerPrivacySetting::class, 'user_id');
    }

    public function reportsFiled()
    {
        return $this->hasMany(PlayerReport::class, 'reporter_id');
    }

    public function reportsAgainst()
    {
        return $this->hasMany(PlayerReport::class, 'reported_user_id');
    }

    public function socialActivities()
    {
        return $this->hasMany(SocialActivity::class, 'user_id');
    }

    public function isFriendWith(int $userId): bool
    {
        return $this->friendships()->where('friend_id', $userId)->exists();
    }

    public function hasBlocked(int $userId): bool
    {
        return $this->blockedPlayers()->where('blocked_user_id', $userId)->exists();
    }

    public function isBlockedBy(int $userId): bool
    {
        return BlockedPlayer::where('user_id', $userId)->where('blocked_user_id', $this->id)->exists();
    }

    public function getPrivacy(): PlayerPrivacySetting
    {
        return $this->privacySettings()->firstOrCreate(
            ['user_id' => $this->id],
            [
                'allow_friend_requests' => true,
                'show_public_profile' => true,
                'show_achievements' => true,
                'show_leaderboard_profile' => true,
                'show_selected_ending' => true,
                'show_challenge_statistics' => true,
            ]
        );
    }

    public function isAdmin(): bool
    {
        return in_array($this->role, ['super_admin', 'admin', 'game_manager', 'support_manager', 'analyst']);
    }

    public function isSuperAdmin(): bool
    {
        return in_array($this->role, ['super_admin', 'admin']);
    }

    public function hasRole(string|array $roles): bool
    {
        $roles = (array) $roles;
        // Super admins have access to all role actions
        if ($this->isSuperAdmin()) {
            return true;
        }
        return in_array($this->role, $roles);
    }
}
