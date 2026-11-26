<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('player_progress', function (Blueprint $table) {
            $table->string('ending_selected')->nullable()->after('is_completed');
            $table->boolean('campaign_completed')->default(false)->after('ending_selected');
            $table->json('story_journal')->nullable()->after('campaign_completed');
        });
    }

    public function down(): void
    {
        Schema::table('player_progress', function (Blueprint $table) {
            $table->dropColumn(['ending_selected', 'campaign_completed', 'story_journal']);
        });
    }
};
