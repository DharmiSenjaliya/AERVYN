<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\BuyerInquiry;

class BuyerInquiryTest extends TestCase
{
    public function test_visitor_can_submit_buyer_inquiry()
    {
        $response = $this->postJson('/api/inquiries', [
            'name' => 'Marcus Vance',
            'email' => 'm.vance@vancegaming.com',
            'company' => 'Vance Interactive Media',
            'country' => 'United Kingdom',
            'inquiry_type' => 'b2b_licensing',
            'message' => 'We are interested in licensing AERVYN for our web gaming network.',
        ]);

        $response->assertStatus(201)
            ->assertJsonPath('success', true)
            ->assertJsonPath('status', 'success');

        $this->assertDatabaseHas('buyer_inquiries', [
            'email' => 'm.vance@vancegaming.com',
            'inquiry_type' => 'b2b_licensing',
            'status' => 'new',
        ]);
    }

    public function test_inquiry_validation_rejects_invalid_payload()
    {
        $response = $this->postJson('/api/inquiries', [
            'name' => 'M',
            'email' => 'not-an-email',
            'inquiry_type' => 'invalid_type',
            'message' => 'Short',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['name', 'email', 'inquiry_type', 'message']);
    }

    public function test_ordinary_player_cannot_access_admin_inquiries()
    {
        $player = User::where('role', 'player')->first();

        $response = $this->actingAs($player, 'sanctum')->getJson('/api/admin/inquiries');
        $response->assertStatus(403);
    }

    public function test_admin_can_list_and_triage_inquiries()
    {
        $admin = User::where('role', 'admin')->first();

        // Seed an inquiry
        $inquiry = BuyerInquiry::create([
            'name' => 'Elena Rostova',
            'email' => 'elena@solarpublishing.eu',
            'company' => 'Solar Publishing',
            'country' => 'Germany',
            'inquiry_type' => 'game_purchase',
            'message' => 'Inquiring regarding full IP acquisition and commercial rights.',
            'status' => 'new',
        ]);

        // 1. List
        $listRes = $this->actingAs($admin, 'sanctum')->getJson('/api/admin/inquiries');
        $listRes->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonStructure(['data', 'pagination', 'metrics']);

        // 2. Triage / Update status
        $updateRes = $this->actingAs($admin, 'sanctum')->putJson("/api/admin/inquiries/{$inquiry->id}", [
            'status' => 'qualified',
            'admin_notes' => 'High-priority B2B publisher inquiry. Scheduled preliminary call.',
        ]);

        $updateRes->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.status', 'qualified');

        $this->assertDatabaseHas('buyer_inquiries', [
            'id' => $inquiry->id,
            'status' => 'qualified',
        ]);
    }
}
