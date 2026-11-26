<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('player_progress', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('world_id')->default('world_1'); // World 1: The Lost Kingdom
            $table->string('current_mission')->default('Awakening the Keystone');
            $table->unsignedInteger('current_step')->default(1);
            $table->json('completed_objectives')->nullable();
            $table->json('inventory')->nullable();
            $table->string('checkpoint_id')->nullable();
            $table->json('checkpoint_position')->nullable();
            $table->boolean('is_completed')->default(false);
            $table->unsignedInteger('playtime_seconds')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('player_progress');
    }
};
