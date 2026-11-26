<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('buyer_inquiries', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email');
            $table->string('company')->nullable();
            $table->string('country')->nullable();
            $table->string('inquiry_type')->default('game_purchase'); // game_purchase, b2b_licensing, customization, reskin, technical_inquiry, partnership, other
            $table->text('message');
            $table->string('status')->default('new'); // new, contacted, qualified, closed
            $table->text('admin_notes')->nullable();
            $table->string('ip_address')->nullable();
            $table->timestamps();

            $table->index('status');
            $table->index('inquiry_type');
            $table->index('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('buyer_inquiries');
    }
};
