<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GameSetting extends Model
{
    protected $primaryKey = 'key';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'key',
        'value',
        'description',
        'category',
    ];

    public static function get(string $key, mixed $default = null): mixed
    {
        $setting = self::find($key);
        return $setting ? $setting->value : $default;
    }

    public static function set(string $key, mixed $value, ?string $description = null, string $category = 'general'): self
    {
        return self::updateOrCreate(
            ['key' => $key],
            [
                'value' => (string) $value,
                'description' => $description,
                'category' => $category,
            ]
        );
    }
}
