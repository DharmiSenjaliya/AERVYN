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
