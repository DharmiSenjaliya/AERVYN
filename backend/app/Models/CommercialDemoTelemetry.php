<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CommercialDemoTelemetry extends Model
{
    use HasFactory;

    protected $table = 'commercial_demo_telemetry';

    protected $fillable = [
        'session_id',
        'milestone_step',
        'completed',
        'duration_seconds',
        'ip_address',
        'user_agent',
    ];

    protected function casts(): array
    {
        return [
            'completed' => 'boolean',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }
}
