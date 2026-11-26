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
        // 1. Add social suspension columns to users table
        Schema::table('users', function (Blueprint $table) {
            if (!Schema::hasColumn('users', 'is_social_suspended')) {
                $table->boolean('is_social_suspended')->default(false)->after('is_banned');
            }
            if (!Schema::hasColumn('users', 'social_suspended_reason')) {
                $table->string('social_suspended_reason', 255)->nullable()->after('is_social_suspended');
            }
        });

        // 2. Friendships table (bidirectional pairs for fast lookups)
        if (!Schema::hasTable('friendships')) {
            Schema::create('friendships', function (Blueprint $table) {
                $table->id();
                $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
                $table->foreignId('friend_id')->constrained('users')->cascadeOnDelete();
                $table->timestamps();

                $table->unique(['user_id', 'friend_id']);
                $table->index('user_id');
                $table->index('friend_id');
            });
        }

        // 3. Friend Requests table
        if (!Schema::hasTable('friend_requests')) {
            Schema::create('friend_requests', function (Blueprint $table) {
                $table->id();
                $table->foreignId('sender_id')->constrained('users')->cascadeOnDelete();
                $table->foreignId('receiver_id')->constrained('users')->cascadeOnDelete();
                $table->enum('status', ['pending', 'accepted', 'rejected', 'cancelled'])->default('pending');
                $table->timestamps();

                $table->unique(['sender_id', 'receiver_id']);
                $table->index(['sender_id', 'status']);
                $table->index(['receiver_id', 'status']);
            });
        }

        // 4. Blocked Players table
        if (!Schema::hasTable('blocked_players')) {
            Schema::create('blocked_players', function (Blueprint $table) {
                $table->id();
                $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
                $table->foreignId('blocked_user_id')->constrained('users')->cascadeOnDelete();
                $table->string('reason', 255)->nullable();
                $table->timestamps();

                $table->unique(['user_id', 'blocked_user_id']);
                $table->index('user_id');
                $table->index('blocked_user_id');
            });
        }

        // 5. Challenges table
        if (!Schema::hasTable('challenges')) {
            Schema::create('challenges', function (Blueprint $table) {
                $table->id();
                $table->foreignId('challenger_id')->constrained('users')->cascadeOnDelete();
                $table->foreignId('opponent_id')->constrained('users')->cascadeOnDelete();
                $table->string('challenge_type', 64);
                $table->string('title', 100);
                $table->text('description');
                $table->string('target_metric', 64); // time_seconds, cores_collected, puzzle_sync_time, rift_score
                $table->decimal('target_value', 10, 2);
                $table->enum('status', ['pending', 'accepted', 'rejected', 'active', 'completed', 'expired', 'cancelled'])->default('pending');
                $table->decimal('challenger_score', 10, 2)->nullable();
                $table->decimal('challenger_time_seconds', 10, 2)->nullable();
                $table->timestamp('challenger_completed_at')->nullable();
                $table->decimal('opponent_score', 10, 2)->nullable();
                $table->decimal('opponent_time_seconds', 10, 2)->nullable();
                $table->timestamp('opponent_completed_at')->nullable();
                $table->foreignId('winner_id')->nullable()->constrained('users')->nullOnDelete();
                $table->integer('xp_reward')->default(150);
                $table->timestamp('expires_at')->nullable();
                $table->timestamps();

                $table->index(['challenger_id', 'status']);
                $table->index(['opponent_id', 'status']);
                $table->index('status');
            });
        }

        // 6. Social Notifications table
        if (!Schema::hasTable('social_notifications')) {
            Schema::create('social_notifications', function (Blueprint $table) {
                $table->id();
                $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
                $table->string('type', 64);
                $table->string('title', 150);
                $table->text('message');
                $table->string('action_url', 255)->nullable();
                $table->json('data')->nullable();
                $table->boolean('is_read')->default(false);
                $table->timestamp('read_at')->nullable();
                $table->timestamps();

                $table->index(['user_id', 'is_read']);
                $table->index(['user_id', 'created_at']);
            });
        }

        // 7. Player Privacy Settings table
        if (!Schema::hasTable('player_privacy_settings')) {
            Schema::create('player_privacy_settings', function (Blueprint $table) {
                $table->id();
                $table->foreignId('user_id')->unique()->constrained('users')->cascadeOnDelete();
                $table->boolean('allow_friend_requests')->default(true);
                $table->boolean('show_public_profile')->default(true);
                $table->boolean('show_achievements')->default(true);
                $table->boolean('show_leaderboard_profile')->default(true);
                $table->boolean('show_selected_ending')->default(true);
                $table->boolean('show_challenge_statistics')->default(true);
                $table->timestamps();
            });
        }

        // 8. Player Reports table
        if (!Schema::hasTable('player_reports')) {
            Schema::create('player_reports', function (Blueprint $table) {
                $table->id();
                $table->foreignId('reporter_id')->constrained('users')->cascadeOnDelete();
                $table->foreignId('reported_user_id')->constrained('users')->cascadeOnDelete();
                $table->foreignId('challenge_id')->nullable()->constrained('challenges')->nullOnDelete();
                $table->string('category', 64);
                $table->text('reason');
                $table->enum('status', ['new', 'reviewing', 'resolved', 'rejected'])->default('new');
                $table->text('admin_notes')->nullable();
                $table->foreignId('resolved_by')->nullable()->constrained('users')->nullOnDelete();
                $table->timestamp('resolved_at')->nullable();
                $table->timestamps();

                $table->index('status');
                $table->index('reporter_id');
                $table->index('reported_user_id');
            });
        }

        // 9. Social Activities table (feed)
        if (!Schema::hasTable('social_activities')) {
            Schema::create('social_activities', function (Blueprint $table) {
                $table->id();
                $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
                $table->string('activity_type', 64);
                $table->text('description');
                $table->json('metadata')->nullable();
                $table->timestamps();

                $table->index(['user_id', 'created_at']);
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('social_activities');
        Schema::dropIfExists('player_reports');
        Schema::dropIfExists('player_privacy_settings');
        Schema::dropIfExists('social_notifications');
        Schema::dropIfExists('challenges');
        Schema::dropIfExists('blocked_players');
        Schema::dropIfExists('friend_requests');
        Schema::dropIfExists('friendships');
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['is_social_suspended', 'social_suspended_reason']);
        });
    }
};
