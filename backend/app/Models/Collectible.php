<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Collectible extends Model
{
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'world_id',
        'category',
        'name',
        'description',
        'story_text',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function world(): BelongsTo
    {
        return $this->belongsTo(World::class, 'world_id', 'id');
    }
}
