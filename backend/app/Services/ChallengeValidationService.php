<?php

namespace App\Services;

use App\Models\Challenge;
use App\Models\User;

class ChallengeValidationService
{
    public const TEMPLATES = [
        'courtyard_sprint' => [
            'type' => 'courtyard_sprint',
            'title' => 'Lost Kingdom Courtyard Sprint',
            'description' => 'Navigate the ancient castle ruins and calibrate all resonant keystones under the target time.',
            'target_metric' => 'time_seconds',
            'default_target' => 120.0,
            'xp_reward' => 150,
            'metric_label' => 'Seconds (Lower is Better)',
            'better' => 'lower',
            'min_valid' => 5.0,
            'max_valid' => 1800.0,
        ],
        'quantum_harvest' => [
            'type' => 'quantum_harvest',
            'title' => 'Broken Present Core Harvest',
            'description' => 'Recover unstable Quantum Cores scattered through the ruined highway without collapsing timelines.',
            'target_metric' => 'cores_collected',
            'default_target' => 3.0,
            'xp_reward' => 200,
            'metric_label' => 'Cores Collected (Higher is Better)',
            'better' => 'higher',
            'min_valid' => 1.0,
            'max_valid' => 10.0,
        ],
        'phase_bridge_reflex' => [
            'type' => 'phase_bridge_reflex',
            'title' => 'Fractured Future Bridge Reflex',
            'description' => 'Synchronize the floating anti-gravity phase bridge puzzle matrix with maximum precision.',
            'target_metric' => 'puzzle_sync_time',
            'default_target' => 60.0,
            'xp_reward' => 200,
            'metric_label' => 'Sync Time in Seconds (Lower is Better)',
            'better' => 'lower',
            'min_valid' => 5.0,
            'max_valid' => 600.0,
        ],
        'chrono_rift_trial' => [
            'type' => 'chrono_rift_trial',
            'title' => 'Zero Horizon Rift Trial',
            'description' => 'Engage in a simulated temporal combat trial against time anomalies and record high score resonance.',
            'target_metric' => 'rift_score',
            'default_target' => 1000.0,
            'xp_reward' => 250,
            'metric_label' => 'Resonance Score (Higher is Better)',
            'better' => 'higher',
            'min_valid' => 100.0,
            'max_valid' => 50000.0,
        ],
    ];

    /**
     * Get challenge templates list.
     */
    public static function getTemplates(): array
    {
        return array_values(self::TEMPLATES);
    }

    /**
     * Validate submission metrics for a challenge type.
     */
    public static function validateScore(string $challengeType, float $score, ?float $timeSeconds = null): array
    {
        $template = self::TEMPLATES[$challengeType] ?? null;
        if (!$template) {
            return ['valid' => false, 'error' => 'Invalid challenge type specified.'];
        }

        if ($score < $template['min_valid'] || $score > $template['max_valid']) {
            return [
                'valid' => false,
                'error' => "Score {$score} is outside acceptable range ({$template['min_valid']} - {$template['max_valid']})."
            ];
        }

        if ($timeSeconds !== null && ($timeSeconds <= 0 || $timeSeconds > 3600)) {
            return ['valid' => false, 'error' => 'Reported time is invalid or exceeded 1 hour limit.'];
        }

        return ['valid' => true, 'template' => $template];
    }

    /**
     * Resolve challenge outcome once both players have completed.
     */
    public static function resolveChallenge(Challenge $challenge): void
    {
        if ($challenge->status === 'completed' || $challenge->winner_id !== null) {
            return;
        }

        $template = self::TEMPLATES[$challenge->challenge_type] ?? null;
        $better = $template ? $template['better'] : 'higher';

        $cScore = (float) $challenge->challenger_score;
        $oScore = (float) $challenge->opponent_score;

        $winnerId = null;
        if ($better === 'lower') {
            if ($cScore < $oScore) {
                $winnerId = $challenge->challenger_id;
            } elseif ($oScore < $cScore) {
                $winnerId = $challenge->opponent_id;
            }
        } else {
            if ($cScore > $oScore) {
                $winnerId = $challenge->challenger_id;
            } elseif ($oScore > $cScore) {
                $winnerId = $challenge->opponent_id;
            }
        }

        $challenge->winner_id = $winnerId;
        $challenge->status = 'completed';
        $challenge->save();

        $challenger = $challenge->challenger;
        $opponent = $challenge->opponent;
        $reward = $challenge->xp_reward;

        // Distribute XP
        if ($winnerId !== null) {
            $winner = $winnerId === $challenger->id ? $challenger : $opponent;
            $loser = $winnerId === $challenger->id ? $opponent : $challenger;

            PlayerProgressionService::awardXp($winner, $reward, "Won Challenge: {$challenge->title}");
            PlayerProgressionService::awardXp($loser, 50, "Challenge Participation: {$challenge->title}");

            // Notify winner
            SocialNotificationService::notify(
                $winner,
                'challenge_result',
                'Challenge Victory!',
                "You won the challenge '{$challenge->title}' against {$loser->display_name}! +{$reward} XP awarded.",
                '/social/challenges',
                ['challenge_id' => $challenge->id, 'won' => true]
            );

            // Notify loser
            SocialNotificationService::notify(
                $loser,
                'challenge_result',
                'Challenge Completed',
                "{$winner->display_name} won the challenge '{$challenge->title}'. You earned +50 participation XP.",
                '/social/challenges',
                ['challenge_id' => $challenge->id, 'won' => false]
            );

            // Log activity
            SocialActivityService::log(
                $winner,
                'challenge_won',
                "Defeated {$loser->display_name} in '{$challenge->title}'",
                ['challenge_id' => $challenge->id]
            );
        } else {
            // Exact Tie
            PlayerProgressionService::awardXp($challenger, 100, "Challenge Draw: {$challenge->title}");
            PlayerProgressionService::awardXp($opponent, 100, "Challenge Draw: {$challenge->title}");

            SocialNotificationService::notify(
                $challenger,
                'challenge_result',
                'Challenge Ended in a Draw',
                "Your challenge '{$challenge->title}' against {$opponent->display_name} resulted in a tie! Both earned +100 XP.",
                '/social/challenges',
                ['challenge_id' => $challenge->id, 'tie' => true]
            );

            SocialNotificationService::notify(
                $opponent,
                'challenge_result',
                'Challenge Ended in a Draw',
                "Your challenge '{$challenge->title}' against {$challenger->display_name} resulted in a tie! Both earned +100 XP.",
                '/social/challenges',
                ['challenge_id' => $challenge->id, 'tie' => true]
            );
        }
    }
}
