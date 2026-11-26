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
        if (!Schema::hasTable('buyer_demo_access')) {
            Schema::create('buyer_demo_access', function (Blueprint $table) {
                $table->id();
                $table->string('token_hash', 64)->unique()->index();
                $table->string('buyer_name');
                $table->string('company')->nullable();
                $table->string('email')->nullable();
                $table->string('access_tier')->default('standard'); // standard | vip | evaluator
                $table->unsignedInteger('access_limit')->nullable()->default(15);
                $table->unsignedInteger('access_count')->default(0);
                $table->timestamp('expires_at')->nullable()->index();
                $table->timestamp('revoked_at')->nullable()->index();
                $table->text('internal_notes')->nullable();
                $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
                $table->timestamps();

                $table->index(['expires_at', 'revoked_at']);
            });
        }

        if (!Schema::hasTable('buyer_demo_sessions')) {
            Schema::create('buyer_demo_sessions', function (Blueprint $table) {
                $table->id();
                $table->foreignId('access_id')->nullable()->constrained('buyer_demo_access')->nullOnDelete();
                $table->string('session_id', 64)->index();
                $table->string('buyer_reference')->nullable();
                $table->boolean('is_private')->default(false);
                $table->timestamp('started_at')->useCurrent();
                $table->timestamp('completed_at')->nullable();
                $table->timestamp('last_active_at')->nullable();
                $table->json('sections_viewed')->nullable();
                $table->unsignedTinyInteger('feedback_score')->nullable();
                $table->text('feedback_notes')->nullable();
                $table->string('ip_address', 45)->nullable();
                $table->text('user_agent')->nullable();
                $table->timestamps();

                $table->index(['session_id', 'is_private']);
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('buyer_demo_sessions');
        Schema::dropIfExists('buyer_demo_access');
    }
};
