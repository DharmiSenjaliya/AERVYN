<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class BuyerDemoAccess extends Model
{
    use HasFactory;

    protected $table = 'buyer_demo_access';

    protected $fillable = [
        'token_hash',
        'buyer_name',
        'company',
        'email',
        'access_tier',
        'access_limit',
        'access_count',
        'expires_at',
        'revoked_at',
        'internal_notes',
        'created_by',
    ];

    protected $casts = [
        'expires_at' => 'datetime',
        'revoked_at' => 'datetime',
        'access_limit' => 'integer',
        'access_count' => 'integer',
    ];

    /**
     * Generate a new secure private token and record.
     * Returns array ['model' => BuyerDemoAccess, 'plain_token' => string]
     */
    public static function createSecureLink(array $attributes): array
    {
        // 64-character high-entropy cryptographic token
        $plainToken = 'aervyn_demo_' . bin2hex(random_bytes(24));
        $tokenHash = hash('sha256', $plainToken);

        $model = self::create(array_merge($attributes, [
            'token_hash' => $tokenHash,
        ]));

        return [
            'model' => $model,
            'plain_token' => $plainToken,
        ];
    }

    /**
     * Check if this access token is currently valid.
     */
    public function isValid(): bool
    {
        if ($this->revoked_at !== null) {
            return false;
        }

        if ($this->expires_at !== null && $this->expires_at->isPast()) {
            return false;
        }

        if ($this->access_limit !== null && $this->access_count >= $this->access_limit) {
            return false;
        }

        return true;
    }

    /**
     * Increment access count safely.
     */
    public function recordAccess(): void
    {
        $this->increment('access_count');
    }

    /**
     * Revoke access immediately.
     */
    public function revoke(): void
    {
        $this->update(['revoked_at' => now()]);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function sessions(): HasMany
    {
        return $this->hasMany(BuyerDemoSession::class, 'access_id');
    }
}
