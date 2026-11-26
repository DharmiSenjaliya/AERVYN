<?php

namespace App\Http\Controllers\Social;

use App\Http\Controllers\Controller;
use App\Models\Challenge;
use App\Models\User;
use App\Services\ChallengeValidationService;
use App\Services\SocialNotificationService;
use Illuminate\Http\Request;

class ChallengeController extends Controller
{
    /**
     * Get available challenge templates.
     */
    public function templates()
    {
        return response()->json([
            'status' => 'success',
            'data' => ChallengeValidationService::getTemplates(),
        ]);
    }

    /**
     * List challenges for the authenticated player.
     */
    public function index(Request $request)
    {
        $user = $request->user();

        $challenges = Challenge::where('challenger_id', $user->id)
            ->orWhere('opponent_id', $user->id)
            ->with(['challenger', 'opponent', 'winner'])
            ->latest()
            ->get();

        $formatted = $challenges->map(function ($c) use ($user) {
            $isChallenger = $c->challenger_id === $user->id;
            $opponentUser = $isChallenger ? $c->opponent : $c->challenger;
            $template = ChallengeValidationService::TEMPLATES[$c->challenge_type] ?? null;

            return [
                'id' => $c->id,
                'is_challenger' => $isChallenger,
                'challenge_type' => $c->challenge_type,
                'title' => $c->title,
                'description' => $c->description,
                'target_metric' => $c->target_metric,
                'target_value' => (float) $c->target_value,
                'metric_label' => $template ? $template['metric_label'] : $c->target_metric,
                'status' => $c->status,
                'xp_reward' => $c->xp_reward,
                'opponent' => [
                    'id' => $opponentUser?->id,
                    'username' => $opponentUser?->name,
                    'display_name' => $opponentUser?->display_name ?: $opponentUser?->name,
                    'avatar' => $opponentUser?->avatar ?: 'avatar_chrono_walker',
                ],
                'my_submission' => [
                    'score' => $isChallenger ? $c->challenger_score : $c->opponent_score,
                    'time_seconds' => $isChallenger ? $c->challenger_time_seconds : $c->opponent_time_seconds,
                    'completed_at' => $isChallenger ? $c->challenger_completed_at?->diffForHumans() : $c->opponent_completed_at?->diffForHumans(),
                    'has_submitted' => $isChallenger ? ($c->challenger_completed_at !== null) : ($c->opponent_completed_at !== null),
                ],
                'their_submission' => [
                    'score' => $isChallenger ? $c->opponent_score : $c->challenger_score,
                    'time_seconds' => $isChallenger ? $c->opponent_time_seconds : $c->challenger_time_seconds,
                    'completed_at' => $isChallenger ? $c->opponent_completed_at?->diffForHumans() : $c->challenger_completed_at?->diffForHumans(),
                    'has_submitted' => $isChallenger ? ($c->opponent_completed_at !== null) : ($c->challenger_completed_at !== null),
                ],
                'winner_id' => $c->winner_id,
                'i_won' => $c->winner_id === $user->id,
                'is_draw' => $c->status === 'completed' && $c->winner_id === null,
                'created_at' => $c->created_at->diffForHumans(),
                'expires_at' => $c->expires_at?->toFormattedDateString(),
            ];
        });

        return response()->json([
            'status' => 'success',
            'data' => [
                'active' => $formatted->where('status', 'active')->values(),
                'pending_received' => $formatted->where('status', 'pending')->where('is_challenger', false)->values(),
                'pending_sent' => $formatted->where('status', 'pending')->where('is_challenger', true)->values(),
                'completed' => $formatted->whereIn('status', ['completed', 'rejected', 'expired', 'cancelled'])->values(),
            ]
        ]);
    }

    /**
     * Create a new challenge to a friend.
     */
    public function create(Request $request)
    {
        $user = $request->user();

        if ($user->is_social_suspended) {
            return response()->json(['status' => 'error', 'message' => 'Social access suspended.'], 403);
        }

        $request->validate([
            'opponent_id' => 'required|integer|exists:users,id',
            'challenge_type' => 'required|string|in:courtyard_sprint,quantum_harvest,phase_bridge_reflex,chrono_rift_trial',
            'target_value' => 'nullable|numeric|min:1',
        ]);

        $opponentId = (int) $request->opponent_id;

        // Opponent must be a friend
        if (!$user->isFriendWith($opponentId)) {
            return response()->json(['status' => 'error', 'message' => 'You can only issue challenges to confirmed friends.'], 422);
        }

        $opponent = User::findOrFail($opponentId);

        // Check blocks
        if ($user->hasBlocked($opponentId) || $opponent->hasBlocked($user->id)) {
            return response()->json(['status' => 'error', 'message' => 'Unable to challenge this player.'], 403);
        }

        $template = ChallengeValidationService::TEMPLATES[$request->challenge_type];
        $targetValue = $request->input('target_value', $template['default_target']);

        $challenge = Challenge::create([
            'challenger_id' => $user->id,
            'opponent_id' => $opponentId,
            'challenge_type' => $request->challenge_type,
            'title' => $template['title'],
            'description' => $template['description'],
            'target_metric' => $template['target_metric'],
            'target_value' => $targetValue,
            'status' => 'pending',
            'xp_reward' => $template['xp_reward'],
            'expires_at' => now()->addDays(3),
        ]);

        // Notify opponent
        SocialNotificationService::notify(
            $opponent,
            'challenge_received',
            'New Challenge Invitation',
            "{$user->display_name} challenged you to '{$template['title']}'!",
            '/social/challenges',
            ['challenge_id' => $challenge->id, 'challenger_id' => $user->id]
        );

        return response()->json([
            'status' => 'success',
            'message' => "Challenge issued to {$opponent->display_name}!",
            'data' => $challenge,
        ], 201);
    }

    /**
     * Accept a pending challenge.
     */
    public function accept(Request $request, $id)
    {
        $user = $request->user();

        $challenge = Challenge::where('id', $id)
            ->where('opponent_id', $user->id)
            ->where('status', 'pending')
            ->first();

        if (!$challenge) {
            return response()->json(['status' => 'error', 'message' => 'Pending challenge not found.'], 404);
        }

        $challenge->status = 'active';
        $challenge->save();

        // Notify challenger
        SocialNotificationService::notify(
            $challenge->challenger,
            'challenge_accepted',
            'Challenge Accepted',
            "{$user->display_name} accepted your challenge '{$challenge->title}'! Time to compete.",
            '/social/challenges',
            ['challenge_id' => $challenge->id]
        );

        return response()->json([
            'status' => 'success',
            'message' => 'Challenge accepted! Status is now active.',
            'data' => $challenge,
        ]);
    }

    /**
     * Reject a pending challenge.
     */
    public function reject(Request $request, $id)
    {
        $user = $request->user();

        $challenge = Challenge::where('id', $id)
            ->where('opponent_id', $user->id)
            ->where('status', 'pending')
            ->first();

        if (!$challenge) {
            return response()->json(['status' => 'error', 'message' => 'Pending challenge not found.'], 404);
        }

        $challenge->status = 'rejected';
        $challenge->save();

        SocialNotificationService::notify(
            $challenge->challenger,
            'challenge_rejected',
            'Challenge Declined',
            "{$user->display_name} declined your challenge '{$challenge->title}'.",
            '/social/challenges'
        );

        return response()->json([
            'status' => 'success',
            'message' => 'Challenge declined.',
        ]);
    }

    /**
     * Cancel a pending challenge by challenger.
     */
    public function cancel(Request $request, $id)
    {
        $user = $request->user();

        $challenge = Challenge::where('id', $id)
            ->where('challenger_id', $user->id)
            ->where('status', 'pending')
            ->first();

        if (!$challenge) {
            return response()->json(['status' => 'error', 'message' => 'Pending challenge not found.'], 404);
        }

        $challenge->status = 'cancelled';
        $challenge->save();

        return response()->json([
            'status' => 'success',
            'message' => 'Challenge cancelled.',
        ]);
    }

    /**
     * Submit challenge gameplay result.
     */
    public function submitResult(Request $request, $id)
    {
        $user = $request->user();

        $challenge = Challenge::where('id', $id)
            ->whereIn('status', ['active', 'pending']) // If challenger plays right after creating
            ->where(function ($q) use ($user) {
                $q->where('challenger_id', $user->id)
                  ->orWhere('opponent_id', $user->id);
            })
            ->first();

        if (!$challenge) {
            return response()->json(['status' => 'error', 'message' => 'Eligible challenge not found.'], 404);
        }

        $request->validate([
            'score' => 'required|numeric',
            'time_seconds' => 'nullable|numeric|min:1',
        ]);

        $score = (float) $request->score;
        $timeSeconds = $request->has('time_seconds') ? (float) $request->time_seconds : null;

        // Server-side validation of metrics
        $val = ChallengeValidationService::validateScore($challenge->challenge_type, $score, $timeSeconds);
        if (!$val['valid']) {
            return response()->json(['status' => 'error', 'message' => $val['error']], 422);
        }

        $isChallenger = $challenge->challenger_id === $user->id;

        // Prevent duplicate submissions
        if ($isChallenger && $challenge->challenger_completed_at !== null) {
            return response()->json(['status' => 'error', 'message' => 'You have already recorded your result for this challenge.'], 422);
        }
        if (!$isChallenger && $challenge->opponent_completed_at !== null) {
            return response()->json(['status' => 'error', 'message' => 'You have already recorded your result for this challenge.'], 422);
        }

        if ($isChallenger) {
            $challenge->challenger_score = $score;
            $challenge->challenger_time_seconds = $timeSeconds ?: $score;
            $challenge->challenger_completed_at = now();
        } else {
            $challenge->opponent_score = $score;
            $challenge->opponent_time_seconds = $timeSeconds ?: $score;
            $challenge->opponent_completed_at = now();
        }

        $challenge->save();

        // Check if both completed
        if ($challenge->challenger_completed_at && $challenge->opponent_completed_at) {
            ChallengeValidationService::resolveChallenge($challenge);
            $challenge->refresh();
        } else {
            // Notify the other player that one result is in
            $otherUser = $isChallenger ? $challenge->opponent : $challenge->challenger;
            SocialNotificationService::notify(
                $otherUser,
                'challenge_completed',
                'Opponent Finished Challenge Run',
                "{$user->display_name} has completed their run in '{$challenge->title}'. Complete yours to determine the winner!",
                '/social/challenges',
                ['challenge_id' => $challenge->id]
            );
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Challenge score verified and logged.',
            'challenge' => $challenge,
        ]);
    }
}
