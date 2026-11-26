<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BuyerDemoSession extends Model
{
    use HasFactory;

    protected $table = 'buyer_demo_sessions';

    protected $fillable = [
        'access_id',
        'session_id',
        'buyer_reference',
        'is_private',
        'started_at',
        'completed_at',
        'last_active_at',
        'sections_viewed',
        'feedback_score',
        'feedback_notes',
        'ip_address',
        'user_agent',
    ];

    protected $casts = [
        'is_private' => 'boolean',
        'started_at' => 'datetime',
        'completed_at' => 'datetime',
        'last_active_at' => 'datetime',
        'sections_viewed' => 'array',
        'feedback_score' => 'integer',
    ];

    public function access(): BelongsTo
    {
        return $this->belongsTo(BuyerDemoAccess::class, 'access_id');
    }
}
