<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class World extends Model
{
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'title',
        'epoch',
        'description',
        'thumbnail_url',
        'display_order',
        'is_active',
        'required_level',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'display_order' => 'integer',
        'required_level' => 'integer',
    ];

    public function missions(): HasMany
    {
        return $this->hasMany(Mission::class, 'world_id', 'id')->orderBy('step_number');
    }

    public function collectibles(): HasMany
    {
        return $this->hasMany(Collectible::class, 'world_id', 'id');
    }
}
