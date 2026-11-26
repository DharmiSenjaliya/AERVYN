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
        'phone',
        'company',
        'country',
        'inquiry_type',
        'budget_range',
        'preferred_contact',
        'message',
        'status',
        'priority',
        'admin_notes',
        'follow_up_date',
        'follow_up_notes',
        'ip_address',
    ];

    protected function casts(): array
    {
        return [
            'follow_up_date' => 'date',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }
}
