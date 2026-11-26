<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Challenge extends Model
{
    use HasFactory;

    protected $fillable = [
        'challenger_id',
        'opponent_id',
        'challenge_type',
        'title',
        'description',
        'target_metric',
        'target_value',
        'status', // pending, accepted, rejected, active, completed, expired, cancelled
        'challenger_score',
        'challenger_time_seconds',
        'challenger_completed_at',
        'opponent_score',
        'opponent_time_seconds',
        'opponent_completed_at',
        'winner_id',
        'xp_reward',
        'expires_at',
    ];

    protected function casts(): array
    {
        return [
            'target_value' => 'decimal:2',
            'challenger_score' => 'decimal:2',
            'challenger_time_seconds' => 'decimal:2',
            'challenger_completed_at' => 'datetime',
            'opponent_score' => 'decimal:2',
            'opponent_time_seconds' => 'decimal:2',
            'opponent_completed_at' => 'datetime',
            'expires_at' => 'datetime',
            'xp_reward' => 'integer',
        ];
    }

    public function challenger(): BelongsTo
    {
        return $this->belongsTo(User::class, 'challenger_id');
    }

    public function opponent(): BelongsTo
    {
        return $this->belongsTo(User::class, 'opponent_id');
    }

    public function winner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'winner_id');
    }
}
