<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BuyerInquiry extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'email',
        'company',
        'country',
        'inquiry_type',
        'message',
        'status',
        'admin_notes',
        'ip_address',
    ];

    protected function casts(): array
    {
        return [
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }
}
