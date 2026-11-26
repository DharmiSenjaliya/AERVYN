<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Add profile fields to users table
        Schema::table('users', function (Blueprint $table) {
            if (!Schema::hasColumn('users', 'display_name')) {
                $table->string('display_name', 100)->nullable()->after('name');
            }
            if (!Schema::hasColumn('users', 'avatar')) {
                $table->string('avatar', 150)->default('avatar_default')->after('role');
            }
            if (!Schema::hasColumn('users', 'bio')) {
                $table->text('bio')->nullable()->after('avatar');
            }
            if (!Schema::hasColumn('users', 'title')) {
                $table->string('title', 100)->default('Novice Explorer')->after('bio');
            }
        });

        // 2. Create achievements table
        if (!Schema::hasTable('achievements')) {
            Schema::create('achievements', function (Blueprint $table) {
                $table->string('id', 64)->primary();
                $table->string('title', 100);
                $table->text('description');
                $table->string('category', 32); // explorer, collector, mission, puzzle, boss, campaign
                $table->string('icon', 64)->default('Award');
                $table->string('condition_type', 64);
                $table->string('condition_target', 64)->nullable();
                $table->integer('xp_reward')->default(100);
                $table->boolean('is_secret')->default(false);
                $table->timestamps();
            });
        }

        // 3. Create user_achievements table
        if (!Schema::hasTable('user_achievements')) {
            Schema::create('user_achievements', function (Blueprint $table) {
                $table->id();
                $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
                $table->string('achievement_id', 64);
                $table->foreign('achievement_id')->references('id')->on('achievements')->cascadeOnDelete();
                $table->timestamp('unlocked_at')->useCurrent();
                $table->integer('xp_awarded')->default(0);
                $table->timestamps();

                $table->unique(['user_id', 'achievement_id']);
                $table->index(['user_id', 'unlocked_at']);
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_achievements');
        Schema::dropIfExists('achievements');
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['display_name', 'avatar', 'bio', 'title']);
        });
    }
};
