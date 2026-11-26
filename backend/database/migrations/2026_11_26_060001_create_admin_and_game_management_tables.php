<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Worlds Catalog Table
        if (!Schema::hasTable('worlds')) {
            Schema::create('worlds', function (Blueprint $table) {
                $table->string('id')->primary(); // world_1, world_2, world_3, world_final
                $table->string('title');
                $table->string('epoch');
                $table->text('description');
                $table->string('thumbnail_url')->nullable();
                $table->unsignedInteger('display_order')->default(1);
                $table->boolean('is_active')->default(true);
                $table->unsignedInteger('required_level')->default(1);
                $table->timestamps();
            });
        }

        // 2. Missions Catalog Table
        if (!Schema::hasTable('missions')) {
            Schema::create('missions', function (Blueprint $table) {
                $table->string('id')->primary();
                $table->string('world_id')->index();
                $table->string('title');
                $table->text('description');
                $table->unsignedInteger('step_number')->default(1);
                $table->json('objectives')->nullable();
                $table->unsignedInteger('xp_reward')->default(100);
                $table->boolean('is_active')->default(true);
                $table->timestamps();
            });
        }

        // 3. Collectibles & Story Content Table
        if (!Schema::hasTable('collectibles')) {
            Schema::create('collectibles', function (Blueprint $table) {
                $table->string('id')->primary();
                $table->string('world_id')->index();
                $table->string('category')->default('fragment'); // fragment, quantum_core, chrono_shard, artifact, clue, journal
                $table->string('name');
                $table->text('description');
                $table->text('story_text')->nullable();
                $table->boolean('is_active')->default(true);
                $table->timestamps();
            });
        }

        // 4. Feedback & Bug Reports Table
        if (!Schema::hasTable('feedback')) {
            Schema::create('feedback', function (Blueprint $table) {
                $table->id();
                $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
                $table->string('player_name');
                $table->string('player_email');
                $table->string('category')->default('general'); // bug, gameplay, graphics, audio, general
                $table->string('subject');
                $table->text('message');
                $table->string('status')->default('new'); // new, in_progress, resolved, rejected
                $table->text('admin_notes')->nullable();
                $table->timestamp('resolved_at')->nullable();
                $table->timestamps();
            });
        }

        // 5. Admin Activity Logs Table
        if (!Schema::hasTable('admin_activity_logs')) {
            Schema::create('admin_activity_logs', function (Blueprint $table) {
                $table->id();
                $table->foreignId('admin_id')->nullable()->constrained('users')->nullOnDelete();
                $table->string('admin_name');
                $table->string('action'); // login, logout, suspend_player, update_world, etc.
                $table->string('entity_type')->nullable(); // Player, World, Mission, etc.
                $table->string('entity_id')->nullable();
                $table->json('details')->nullable();
                $table->string('ip_address')->nullable();
                $table->text('user_agent')->nullable();
                $table->timestamp('created_at')->useCurrent();
            });
        }

        // 6. Game & Web Settings Table
        if (!Schema::hasTable('game_settings')) {
            Schema::create('game_settings', function (Blueprint $table) {
                $table->string('key')->primary();
                $table->text('value')->nullable();
                $table->string('description')->nullable();
                $table->string('category')->default('general'); // general, maintenance, support, gameplay
                $table->timestamps();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('game_settings');
        Schema::dropIfExists('admin_activity_logs');
        Schema::dropIfExists('feedback');
        Schema::dropIfExists('collectibles');
        Schema::dropIfExists('missions');
        Schema::dropIfExists('worlds');
    }
};
