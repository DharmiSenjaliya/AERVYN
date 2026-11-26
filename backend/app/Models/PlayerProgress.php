<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PlayerProgress extends Model
{
    use HasFactory;

    protected $table = 'player_progress';

    protected $fillable = [
        'user_id',
        'world_id',
        'current_mission',
        'current_step',
        'completed_objectives',
        'inventory',
        'checkpoint_id',
        'checkpoint_position',
        'is_completed',
        'playtime_seconds',
    ];

    protected function casts(): array
    {
        return [
            'completed_objectives' => 'array',
            'inventory' => 'array',
            'checkpoint_position' => 'array',
            'is_completed' => 'boolean',
            'current_step' => 'integer',
            'playtime_seconds' => 'integer',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
