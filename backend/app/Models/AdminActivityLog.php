<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AdminActivityLog extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'admin_id',
        'admin_name',
        'action',
        'entity_type',
        'entity_id',
        'details',
        'ip_address',
        'user_agent',
        'created_at',
    ];

    protected $casts = [
        'details' => 'array',
        'created_at' => 'datetime',
    ];

    public function admin(): BelongsTo
    {
        return $this->belongsTo(User::class, 'admin_id');
    }

    public static function log(string $action, ?string $entityType = null, ?string $entityId = null, ?array $details = null): self
    {
        $admin = auth()->user();
        return self::create([
            'admin_id' => $admin?->id,
            'admin_name' => $admin?->name ?? 'System',
            'action' => $action,
            'entity_type' => $entityType,
            'entity_id' => $entityId,
            'details' => $details,
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
            'created_at' => now(),
        ]);
    }
}
