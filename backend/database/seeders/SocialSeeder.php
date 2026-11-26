<?php

namespace Database\Seeders;

use App\Models\Challenge;
use App\Models\Friendship;
use App\Models\FriendRequest;
use App\Models\PlayerPrivacySetting;
use App\Models\SocialActivity;
use App\Models\SocialNotification;
use App\Models\User;
use App\Services\ChallengeValidationService;
use App\Services\PlayerProgressionService;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class SocialSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Ensure sample player accounts
        $player1 = User::firstOrCreate(
            ['email' => 'player@aervyn.local'],
            [
                'name' => 'AervynExplorer',
                'display_name' => 'Aervyn Explorer',
                'password' => Hash::make('Password123!'),
                'role' => 'player',
                'level' => 4,
                'xp' => 1250,
                'avatar' => 'avatar_chrono_walker',
                'title' => 'Temporal Adept',
                'is_active' => true,
                'is_banned' => false,
            ]
        );

        $player2 = User::firstOrCreate(
            ['email' => 'portal_tester@aervyn.local'],
            [
                'name' => 'ChronoRift',
                'display_name' => 'Chrono Rift',
                'password' => Hash::make('Password123!'),
                'role' => 'player',
                'level' => 3,
                'xp' => 850,
                'avatar' => 'avatar_rift_seeker',
                'title' => 'Rift Traveler',
                'is_active' => true,
                'is_banned' => false,
            ]
        );

        $player3 = User::firstOrCreate(
            ['email' => 'valkyrie@aervyn.local'],
            [
                'name' => 'Valkyrie9',
                'display_name' => 'Valkyrie-9',
                'password' => Hash::make('Password123!'),
                'role' => 'player',
                'level' => 5,
                'xp' => 2100,
                'avatar' => 'avatar_quantum_pilot',
                'title' => 'Timeline Weaver',
                'is_active' => true,
                'is_banned' => false,
            ]
        );

        $player4 = User::firstOrCreate(
            ['email' => 'chronos@aervyn.local'],
            [
                'name' => 'ChronosMaster',
                'display_name' => 'Chronos Master',
                'password' => Hash::make('Password123!'),
                'role' => 'player',
                'level' => 6,
                'xp' => 3200,
                'avatar' => 'avatar_time_guardian',
                'title' => 'Quantum Sentinel',
                'is_active' => true,
                'is_banned' => false,
            ]
        );

        // 2. Ensure Privacy Settings for all players
        foreach ([$player1, $player2, $player3, $player4] as $p) {
            PlayerPrivacySetting::firstOrCreate(
                ['user_id' => $p->id],
                [
                    'allow_friend_requests' => true,
                    'show_public_profile' => true,
                    'show_achievements' => true,
                    'show_leaderboard_profile' => true,
                    'show_selected_ending' => true,
                    'show_challenge_statistics' => true,
                ]
            );
        }

        // 3. Establish mutual friendships
        // Player 1 & Player 2 are friends
        Friendship::firstOrCreate(['user_id' => $player1->id, 'friend_id' => $player2->id]);
        Friendship::firstOrCreate(['user_id' => $player2->id, 'friend_id' => $player1->id]);

        // Player 1 & Player 3 are friends
        Friendship::firstOrCreate(['user_id' => $player1->id, 'friend_id' => $player3->id]);
        Friendship::firstOrCreate(['user_id' => $player3->id, 'friend_id' => $player1->id]);

        // 4. Pending Friend Request from Player 4 to Player 1
        FriendRequest::firstOrCreate(
            ['sender_id' => $player4->id, 'receiver_id' => $player1->id],
            ['status' => 'pending']
        );

        // 5. Sample Challenges
        // Active challenge between Player 2 and Player 1
        Challenge::firstOrCreate(
            ['challenger_id' => $player2->id, 'opponent_id' => $player1->id, 'challenge_type' => 'courtyard_sprint'],
            [
                'title' => 'Lost Kingdom Courtyard Sprint',
                'description' => 'Navigate the ancient castle ruins and calibrate all resonant keystones under the target time.',
                'target_metric' => 'time_seconds',
                'target_value' => 120.0,
                'status' => 'active',
                'challenger_score' => 94.50,
                'challenger_time_seconds' => 94.50,
                'challenger_completed_at' => now()->subHours(2),
                'xp_reward' => 150,
                'expires_at' => now()->addDays(2),
            ]
        );

        // Completed challenge between Player 3 and Player 1
        $completedChallenge = Challenge::firstOrCreate(
            ['challenger_id' => $player1->id, 'opponent_id' => $player3->id, 'challenge_type' => 'quantum_harvest'],
            [
                'title' => 'Broken Present Core Harvest',
                'description' => 'Recover unstable Quantum Cores scattered through the ruined highway without collapsing timelines.',
                'target_metric' => 'cores_collected',
                'target_value' => 3.0,
                'status' => 'completed',
                'challenger_score' => 3.0,
                'challenger_time_seconds' => 110.0,
                'challenger_completed_at' => now()->subDay(),
                'opponent_score' => 2.0,
                'opponent_time_seconds' => 135.0,
                'opponent_completed_at' => now()->subDay(),
                'winner_id' => $player1->id,
                'xp_reward' => 200,
                'expires_at' => now()->addDays(1),
            ]
        );

        // 6. Sample Notifications for Player 1
        SocialNotification::firstOrCreate(
            ['user_id' => $player1->id, 'type' => 'friend_request_received'],
            [
                'title' => 'Friend Request Received',
                'message' => "Chronos Master sent you a friend request.",
                'action_url' => '/social/requests',
                'data' => ['sender_id' => $player4->id, 'sender_name' => 'Chronos Master'],
                'is_read' => false,
            ]
        );

        SocialNotification::firstOrCreate(
            ['user_id' => $player1->id, 'type' => 'challenge_received'],
            [
                'title' => 'New Asynchronous Challenge!',
                'message' => "Chrono Rift challenged you to 'Lost Kingdom Courtyard Sprint'!",
                'action_url' => '/social/challenges',
                'data' => ['challenger_id' => $player2->id, 'challenger_name' => 'Chrono Rift'],
                'is_read' => false,
            ]
        );

        // 7. Sample Social Activities
        SocialActivity::firstOrCreate(
            ['user_id' => $player1->id, 'activity_type' => 'world_completed'],
            [
                'description' => 'Completed World 1: The Lost Kingdom and restored timeline portals.',
                'metadata' => ['world_id' => 'world_1'],
            ]
        );

        SocialActivity::firstOrCreate(
            ['user_id' => $player3->id, 'activity_type' => 'level_reached'],
            [
                'description' => 'Ascended to Level 5: Timeline Weaver!',
                'metadata' => ['level' => 5],
            ]
        );
    }
}
