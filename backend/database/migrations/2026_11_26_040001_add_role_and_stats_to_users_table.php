<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('role')->default('player')->after('email');
            $table->unsignedInteger('level')->default(1)->after('password');
            $table->unsignedInteger('xp')->default(0)->after('level');
            $table->boolean('is_active')->default(true)->after('xp');
            $table->boolean('is_banned')->default(false)->after('is_active');
            $table->timestamp('last_login_at')->nullable()->after('is_banned');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['role', 'level', 'xp', 'is_active', 'is_banned', 'last_login_at']);
        });
    }
};
