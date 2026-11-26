<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PlayerPrivacySetting extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'allow_friend_requests',
        'show_public_profile',
        'show_achievements',
        'show_leaderboard_profile',
        'show_selected_ending',
        'show_challenge_statistics',
    ];

    protected function casts(): array
    {
        return [
            'allow_friend_requests' => 'boolean',
            'show_public_profile' => 'boolean',
            'show_achievements' => 'boolean',
            'show_leaderboard_profile' => 'boolean',
            'show_selected_ending' => 'boolean',
            'show_challenge_statistics' => 'boolean',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
