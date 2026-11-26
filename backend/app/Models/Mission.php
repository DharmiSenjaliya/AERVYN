<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Mission extends Model
{
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'world_id',
        'title',
        'description',
        'step_number',
        'objectives',
        'xp_reward',
        'is_active',
    ];

    protected $casts = [
        'objectives' => 'array',
        'step_number' => 'integer',
        'xp_reward' => 'integer',
        'is_active' => 'boolean',
    ];

    public function world(): BelongsTo
    {
        return $this->belongsTo(World::class, 'world_id', 'id');
    }
}
