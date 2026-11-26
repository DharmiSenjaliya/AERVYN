<?php

namespace App\Http\Controllers\Social;

use App\Http\Controllers\Controller;
use App\Models\PlayerPrivacySetting;
use Illuminate\Http\Request;

class SocialPrivacyController extends Controller
{
    /**
     * Get player's privacy configuration.
     */
    public function show(Request $request)
    {
        $user = $request->user();
        $privacy = $user->getPrivacy();

        return response()->json([
            'status' => 'success',
            'data' => [
                'allow_friend_requests' => (bool) $privacy->allow_friend_requests,
                'show_public_profile' => (bool) $privacy->show_public_profile,
                'show_achievements' => (bool) $privacy->show_achievements,
                'show_leaderboard_profile' => (bool) $privacy->show_leaderboard_profile,
                'show_selected_ending' => (bool) $privacy->show_selected_ending,
                'show_challenge_statistics' => (bool) $privacy->show_challenge_statistics,
            ]
        ]);
    }

    /**
     * Update player's privacy configuration.
     */
    public function update(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'allow_friend_requests' => 'required|boolean',
            'show_public_profile' => 'required|boolean',
            'show_achievements' => 'required|boolean',
            'show_leaderboard_profile' => 'required|boolean',
            'show_selected_ending' => 'required|boolean',
            'show_challenge_statistics' => 'required|boolean',
        ]);

        $privacy = $user->getPrivacy();
        $privacy->update($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Privacy settings updated successfully.',
            'data' => $privacy,
        ]);
    }
}
