<?php

namespace Tests\Feature;

use App\Models\BlockedPlayer;
use App\Models\Challenge;
use App\Models\Friendship;
use App\Models\FriendRequest;
use App\Models\PlayerPrivacySetting;
use App\Models\PlayerReport;
use App\Models\SocialNotification;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SocialApiTest extends TestCase
{
    protected User $userA;
    protected User $userB;
    protected User $userC;
    protected User $admin;

    protected function setUp(): void
    {
        parent::setUp();

        $this->userA = User::firstOrCreate(
            ['email' => 'social_a@aervyn.local'],
            [
                'name' => 'ExplorerA',
                'display_name' => 'Explorer Alpha',
                'password' => bcrypt('Password123!'),
                'role' => 'player',
                'level' => 3,
                'xp' => 700,
                'is_active' => true,
                'is_banned' => false,
            ]
        );

        $this->userB = User::firstOrCreate(
            ['email' => 'social_b@aervyn.local'],
            [
                'name' => 'ExplorerB',
                'display_name' => 'Explorer Beta',
                'password' => bcrypt('Password123!'),
                'role' => 'player',
                'level' => 4,
                'xp' => 1200,
                'is_active' => true,
                'is_banned' => false,
            ]
        );

        $this->userC = User::firstOrCreate(
            ['email' => 'social_c@aervyn.local'],
            [
                'name' => 'ExplorerC',
                'display_name' => 'Explorer Gamma',
                'password' => bcrypt('Password123!'),
                'role' => 'player',
                'level' => 2,
                'xp' => 400,
                'is_active' => true,
                'is_banned' => false,
            ]
        );

        $this->admin = User::firstOrCreate(
            ['email' => 'social_admin@aervyn.local'],
            [
                'name' => 'SocialAdmin',
                'display_name' => 'Social Overseer',
                'password' => bcrypt('Password123!'),
                'role' => 'admin',
                'level' => 10,
                'xp' => 9999,
                'is_active' => true,
                'is_banned' => false,
            ]
        );
    }

    public function test_unauthenticated_request_to_social_api_is_blocked(): void
    {
        $response = $this->getJson('/api/social/hub');
        $response->assertStatus(401);
    }

    public function test_player_can_fetch_social_hub_summary(): void
    {
        $response = $this->actingAs($this->userA)->getJson('/api/social/hub');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'status',
                'data' => [
                    'friends_count',
                    'pending_requests_count',
                    'active_challenges_count',
                    'unread_notifications_count',
                    'is_social_suspended',
                    'activity_feed',
                ]
            ]);
    }

    public function test_player_can_search_players(): void
    {
        $response = $this->actingAs($this->userA)->getJson('/api/social/search?q=Explorer');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'status',
                'total',
                'data' => [
                    '*' => [
                        'id',
                        'username',
                        'display_name',
                        'avatar',
                        'rank_title',
                        'level',
                        'xp',
                        'relationship',
                    ]
                ]
            ]);
    }

    public function test_player_can_send_accept_and_remove_friend(): void
    {
        // 1. Clean previous state
        Friendship::where('user_id', $this->userA->id)->where('friend_id', $this->userB->id)->delete();
        Friendship::where('user_id', $this->userB->id)->where('friend_id', $this->userA->id)->delete();
        FriendRequest::where('sender_id', $this->userA->id)->where('receiver_id', $this->userB->id)->delete();
        FriendRequest::where('sender_id', $this->userB->id)->where('receiver_id', $this->userA->id)->delete();

        // 2. Send friend request
        $sendResponse = $this->actingAs($this->userA)->postJson('/api/social/requests', [
            'receiver_id' => $this->userB->id,
        ]);
        $sendResponse->assertStatus(201);

        $request = FriendRequest::where('sender_id', $this->userA->id)
            ->where('receiver_id', $this->userB->id)
            ->first();
        $this->assertNotNull($request);

        // 3. Accept request
        $acceptResponse = $this->actingAs($this->userB)->postJson("/api/social/requests/{$request->id}/accept");
        $acceptResponse->assertStatus(200);

        $this->assertTrue($this->userA->isFriendWith($this->userB->id));
        $this->assertTrue($this->userB->isFriendWith($this->userA->id));

        // 4. Remove friend
        $removeResponse = $this->actingAs($this->userA)->deleteJson("/api/social/friends/{$this->userB->id}");
        $removeResponse->assertStatus(200);

        $this->assertFalse($this->userA->isFriendWith($this->userB->id));
    }

    public function test_cannot_friend_self(): void
    {
        $response = $this->actingAs($this->userA)->postJson('/api/social/requests', [
            'receiver_id' => $this->userA->id,
        ]);
        $response->assertStatus(422);
    }

    public function test_player_can_block_and_unblock_player(): void
    {
        // 1. Block
        $blockResponse = $this->actingAs($this->userA)->postJson('/api/social/blocks', [
            'blocked_user_id' => $this->userC->id,
            'reason' => 'Spamming challenges',
        ]);
        $blockResponse->assertStatus(200);

        $this->assertTrue($this->userA->hasBlocked($this->userC->id));

        // 2. Blocked player cannot send request
        $blockedSend = $this->actingAs($this->userC)->postJson('/api/social/requests', [
            'receiver_id' => $this->userA->id,
        ]);
        $blockedSend->assertStatus(403);

        // 3. Unblock
        $unblockResponse = $this->actingAs($this->userA)->deleteJson("/api/social/blocks/{$this->userC->id}");
        $unblockResponse->assertStatus(200);

        $this->assertFalse($this->userA->hasBlocked($this->userC->id));
    }

    public function test_player_can_view_public_profile_respecting_privacy(): void
    {
        $response = $this->actingAs($this->userA)->getJson("/api/social/profile/{$this->userB->id}");

        $response->assertStatus(200)
            ->assertJsonFragment([
                'username' => 'ExplorerB',
            ])
            ->assertJsonStructure([
                'status',
                'data' => [
                    'id',
                    'username',
                    'display_name',
                    'avatar',
                    'level',
                    'xp',
                    'completed_worlds',
                ]
            ]);
    }

    public function test_player_can_create_accept_and_submit_challenge(): void
    {
        // Ensure friends first
        Friendship::firstOrCreate(['user_id' => $this->userA->id, 'friend_id' => $this->userB->id]);
        Friendship::firstOrCreate(['user_id' => $this->userB->id, 'friend_id' => $this->userA->id]);

        // 1. Create Challenge
        $createResponse = $this->actingAs($this->userA)->postJson('/api/social/challenges', [
            'opponent_id' => $this->userB->id,
            'challenge_type' => 'courtyard_sprint',
            'target_value' => 120,
        ]);
        $createResponse->assertStatus(201);
        $challengeId = $createResponse->json('data.id');

        // 2. Opponent Accepts Challenge
        $acceptResponse = $this->actingAs($this->userB)->postJson("/api/social/challenges/{$challengeId}/accept");
        $acceptResponse->assertStatus(200);

        // 3. User A submits result (95.2 seconds)
        $submitA = $this->actingAs($this->userA)->postJson("/api/social/challenges/{$challengeId}/submit", [
            'score' => 95.2,
            'time_seconds' => 95.2,
        ]);
        $submitA->assertStatus(200);

        // 4. User B submits result (108.4 seconds)
        $submitB = $this->actingAs($this->userB)->postJson("/api/social/challenges/{$challengeId}/submit", [
            'score' => 108.4,
            'time_seconds' => 108.4,
        ]);
        $submitB->assertStatus(200);

        // Challenge should be completed with User A as winner (lower time is better)
        $challenge = Challenge::find($challengeId);
        $this->assertEquals('completed', $challenge->status);
        $this->assertEquals($this->userA->id, $challenge->winner_id);
    }

    public function test_challenge_score_validation_prevents_invalid_metrics(): void
    {
        Friendship::firstOrCreate(['user_id' => $this->userA->id, 'friend_id' => $this->userB->id]);
        Friendship::firstOrCreate(['user_id' => $this->userB->id, 'friend_id' => $this->userA->id]);

        $challenge = Challenge::create([
            'challenger_id' => $this->userA->id,
            'opponent_id' => $this->userB->id,
            'challenge_type' => 'courtyard_sprint',
            'title' => 'Test Sprint',
            'description' => 'Test',
            'target_metric' => 'time_seconds',
            'target_value' => 120,
            'status' => 'active',
        ]);

        // Attempt impossible time (0.01 seconds)
        $response = $this->actingAs($this->userA)->postJson("/api/social/challenges/{$challenge->id}/submit", [
            'score' => 0.01,
            'time_seconds' => 0.01,
        ]);
        $response->assertStatus(422);
    }

    public function test_player_can_fetch_and_mark_notifications(): void
    {
        $notif = SocialNotification::create([
            'user_id' => $this->userA->id,
            'type' => 'social_alert',
            'title' => 'Nexus Alert',
            'message' => 'New timeline portal detected.',
            'is_read' => false,
        ]);

        $response = $this->actingAs($this->userA)->getJson('/api/social/notifications');
        $response->assertStatus(200);

        // Mark read
        $markResponse = $this->actingAs($this->userA)->postJson("/api/social/notifications/{$notif->id}/read");
        $markResponse->assertStatus(200);

        $this->assertTrue($notif->fresh()->is_read);
    }

    public function test_player_can_update_privacy_settings(): void
    {
        $response = $this->actingAs($this->userA)->putJson('/api/social/privacy', [
            'allow_friend_requests' => false,
            'show_public_profile' => true,
            'show_achievements' => true,
            'show_leaderboard_profile' => true,
            'show_selected_ending' => false,
            'show_challenge_statistics' => true,
        ]);

        $response->assertStatus(200);
        $this->assertFalse($this->userA->getPrivacy()->allow_friend_requests);
    }

    public function test_player_can_file_report(): void
    {
        $response = $this->actingAs($this->userA)->postJson('/api/social/reports', [
            'reported_user_id' => $this->userB->id,
            'category' => 'cheating',
            'reason' => 'Impossible jump trajectory spotted.',
        ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('player_reports', [
            'reporter_id' => $this->userA->id,
            'reported_user_id' => $this->userB->id,
            'category' => 'cheating',
        ]);
    }

    public function test_social_leaderboard_includes_friends_only_filter(): void
    {
        $response = $this->actingAs($this->userA)->getJson('/api/social/leaderboard?category=friends_only');
        $response->assertStatus(200)
            ->assertJsonStructure([
                'status',
                'category',
                'leaderboard',
            ]);
    }

    public function test_admin_can_view_social_overview_and_triage_reports(): void
    {
        $report = PlayerReport::create([
            'reporter_id' => $this->userA->id,
            'reported_user_id' => $this->userB->id,
            'category' => 'harassment',
            'reason' => 'Spamming invites.',
            'status' => 'new',
        ]);

        // 1. Overview
        $overview = $this->actingAs($this->admin)->getJson('/api/admin/social/overview');
        $overview->assertStatus(200);

        // 2. Triage Report
        $triage = $this->actingAs($this->admin)->putJson("/api/admin/social/reports/{$report->id}", [
            'status' => 'resolved',
            'admin_notes' => 'Warned player and restricted invitation frequency.',
        ]);
        $triage->assertStatus(200);
        $this->assertEquals('resolved', $report->fresh()->status);
    }

    public function test_admin_can_suspend_social_access(): void
    {
        $response = $this->actingAs($this->admin)->postJson("/api/admin/social/users/{$this->userC->id}/suspend", [
            'suspend' => true,
            'reason' => 'Repeated report violations',
        ]);

        $response->assertStatus(200);
        $this->assertTrue($this->userC->fresh()->is_social_suspended);
    }
}
