<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations to enhance buyer lead fields and add commercial demo telemetry.
     */
    public function up(): void
    {
        // 1. Enhance buyer_inquiries table with CRM lead fields
        if (Schema::hasTable('buyer_inquiries')) {
            Schema::table('buyer_inquiries', function (Blueprint $table) {
                if (!Schema::hasColumn('buyer_inquiries', 'phone')) {
                    $table->string('phone')->nullable()->after('email');
                }
                if (!Schema::hasColumn('buyer_inquiries', 'budget_range')) {
                    $table->string('budget_range')->nullable()->after('inquiry_type');
                }
                if (!Schema::hasColumn('buyer_inquiries', 'preferred_contact')) {
                    $table->string('preferred_contact')->default('email')->after('budget_range');
                }
                if (!Schema::hasColumn('buyer_inquiries', 'priority')) {
                    $table->string('priority')->default('medium')->after('status'); // low, medium, high, urgent
                    $table->index('priority');
                }
                if (!Schema::hasColumn('buyer_inquiries', 'follow_up_date')) {
                    $table->date('follow_up_date')->nullable()->after('admin_notes');
                }
                if (!Schema::hasColumn('buyer_inquiries', 'follow_up_notes')) {
                    $table->text('follow_up_notes')->nullable()->after('follow_up_date');
                }
            });
        }

        // 2. Commercial Demo Telemetry Table (for tracking conversion without personal PII)
        if (!Schema::hasTable('commercial_demo_telemetry')) {
            Schema::create('commercial_demo_telemetry', function (Blueprint $table) {
                $table->id();
                $table->string('session_id')->index();
                $table->unsignedTinyInteger('milestone_step')->default(1);
                $table->boolean('completed')->default(false);
                $table->unsignedInteger('duration_seconds')->default(0);
                $table->string('ip_address')->nullable();
                $table->text('user_agent')->nullable();
                $table->timestamps();

                $table->index('completed');
                $table->index('created_at');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasTable('commercial_demo_telemetry')) {
            Schema::dropIfExists('commercial_demo_telemetry');
        }

        if (Schema::hasTable('buyer_inquiries')) {
            Schema::table('buyer_inquiries', function (Blueprint $table) {
                $columns = ['phone', 'budget_range', 'preferred_contact', 'priority', 'follow_up_date', 'follow_up_notes'];
                foreach ($columns as $column) {
                    if (Schema::hasColumn('buyer_inquiries', $column)) {
                        $table->dropColumn($column);
                    }
                }
            });
        }
    }
};
