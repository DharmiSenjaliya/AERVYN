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
            'phone' => '+44 20 7946 0912',
            'company' => 'Vance Interactive Media',
            'country' => 'United Kingdom',
            'inquiry_type' => 'b2b_licensing',
            'budget_range' => '$15k-$50k',
            'preferred_contact' => 'email',
            'message' => 'We are interested in licensing AERVYN for our web gaming network.',
        ]);

        $response->assertStatus(201)
            ->assertJsonPath('success', true)
            ->assertJsonPath('status', 'success');

        $this->assertDatabaseHas('buyer_inquiries', [
            'email' => 'm.vance@vancegaming.com',
            'inquiry_type' => 'b2b_licensing',
            'phone' => '+44 20 7946 0912',
            'budget_range' => '$15k-$50k',
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
            'priority' => 'high',
        ]);

        // 1. List
        $listRes = $this->actingAs($admin, 'sanctum')->getJson('/api/admin/inquiries');
        $listRes->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonStructure(['data', 'pagination', 'kpis']);

        // 2. Show single
        $showRes = $this->actingAs($admin, 'sanctum')->getJson("/api/admin/inquiries/{$inquiry->id}");
        $showRes->assertStatus(200)
            ->assertJsonPath('data.name', 'Elena Rostova');

        // 3. Triage / Update status & priority
        $updateRes = $this->actingAs($admin, 'sanctum')->putJson("/api/admin/inquiries/{$inquiry->id}", [
            'status' => 'negotiation',
            'priority' => 'urgent',
            'admin_notes' => 'High-priority B2B publisher inquiry. Scheduled contract review call.',
            'follow_up_date' => date('Y-m-d', strtotime('+3 days')),
            'follow_up_notes' => 'Send terms agreement draft.',
        ]);

        $updateRes->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.status', 'negotiation')
            ->assertJsonPath('data.priority', 'urgent');

        $this->assertDatabaseHas('buyer_inquiries', [
            'id' => $inquiry->id,
            'status' => 'negotiation',
            'priority' => 'urgent',
        ]);
    }

    public function test_admin_can_export_csv_and_view_analytics()
    {
        $admin = User::where('role', 'admin')->first();

        // 1. Export CSV
        $csvRes = $this->actingAs($admin, 'sanctum')->get('/api/admin/inquiries/export');
        $csvRes->assertStatus(200);
        $this->assertStringContainsString('text/csv', $csvRes->headers->get('Content-Type'));

        // 2. View analytics
        $analyticsRes = $this->actingAs($admin, 'sanctum')->getJson('/api/admin/inquiries/analytics');
        $analyticsRes->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonStructure(['demo_funnel', 'leads_by_type', 'leads_by_status']);
    }

    public function test_demo_telemetry_recording()
    {
        $response = $this->postJson('/api/demo/telemetry', [
            'session_id' => 'test-session-12345',
            'milestone_step' => 2,
            'completed' => true,
            'duration_seconds' => 45,
        ]);

        $response->assertStatus(200)
            ->assertJsonPath('success', true);

        $this->assertDatabaseHas('commercial_demo_telemetry', [
            'session_id' => 'test-session-12345',
            'milestone_step' => 2,
            'completed' => 1,
        ]);
    }

    public function test_admin_product_content_cms()
    {
        $admin = User::where('role', 'admin')->first();

        // 1. Public fetch
        $publicRes = $this->getJson('/api/config/product-content');
        $publicRes->assertStatus(200)
            ->assertJsonPath('success', true);

        // 2. Admin update
        $updateRes = $this->actingAs($admin, 'sanctum')->putJson('/api/admin/product-content', [
            'hero_title' => 'AERVYN: ECHOES OF TIME — Master Edition',
            'cta_quote_label' => 'INQUIRE NOW',
        ]);
        $updateRes->assertStatus(200)
            ->assertJsonPath('success', true);

        // 3. Admin reset
        $resetRes = $this->actingAs($admin, 'sanctum')->postJson('/api/admin/product-content/reset');
        $resetRes->assertStatus(200)
            ->assertJsonPath('success', true);
    }
}
