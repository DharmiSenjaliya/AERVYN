import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, CheckCircle2, RotateCcw, BookOpen, ArrowRight, AlertTriangle, ShieldCheck, Sparkles, Home } from 'lucide-react';
import Logo from '../../components/common/Logo';
import Badge from '../../components/common/Badge';
import GameState from '../engine/GameState';
import AudioSystem from '../systems/AudioSystem';
import StoryJournalModal from './StoryJournalModal';
import axios from 'axios';

/**
 * Story Campaign Grand Finale & Completion Summary Screen
 * Displays the divergent cinematic epilogue for Ending A or Ending B,
 * full campaign telemetry, replay controls, journal access, and safe restart confirmation.
 */
export default function CampaignEndingScreen({ endingKey = 'ending_a', onReplay = () => {} }) {
  const navigate = useNavigate();
  const [showJournal, setShowJournal] = useState(false);
  const [showRestartConfirm, setShowRestartConfirm] = useState(false);
  const [summaryData, setSummaryData] = useState(null);
  const [isResetting, setIsResetting] = useState(false);

  const isEndingA = endingKey === 'ending_a';

  useEffect(() => {
    // Fetch campaign summary telemetry from Laravel backend
    const fetchSummary = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const res = await axios.get('http://127.0.0.1:8000/api/game/campaign-summary', {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: 'application/json'
            }
          });
          if (res.data?.success) {
            setSummaryData(res.data.summary);
          }
        }
      } catch {}
    };

    fetchSummary();
  }, [endingKey]);

  const handleRestartCampaign = async () => {
    setIsResetting(true);
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await axios.post(
          'http://127.0.0.1:8000/api/game/reset',
          { world_id: 'world_1' },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: 'application/json'
            }
          }
        ).catch(() => {});
      }

      GameState.reset();
      GameState.setWorld('world_1');
      setShowRestartConfirm(false);
      if (onReplay) {
        onReplay('world_1');
      }
    } catch {
      GameState.reset();
      setShowRestartConfirm(false);
    } finally {
      setIsResetting(false);
    }
  };

  const playtimeFormatted = summaryData?.total_playtime_formatted || '00:45:20';
  const totalClues = summaryData?.journal_clues_count || 12;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(5, 7, 18, 0.97)',
        backdropFilter: 'blur(22px)',
        zIndex: 900,
        overflowY: 'auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1.5rem',
        animation: 'fadeIn 0.5s ease'
      }}
    >
      <div
        className="glass-panel-heavy cyber-border"
        style={{
          width: 'min(94vw, 760px)',
          padding: '2.5rem 2rem',
          borderRadius: 'var(--radius-lg)',
          borderColor: isEndingA ? 'var(--color-gold)' : 'var(--color-cyan)',
          boxShadow: `0 0 60px rgba(0, 0, 0, 0.95), 0 0 35px ${isEndingA ? 'rgba(245, 185, 66, 0.3)' : 'rgba(0, 217, 255, 0.3)'}`,
          background: 'rgba(8, 10, 24, 0.98)',
          textAlign: 'center'
        }}
      >
        {/* Official Brand Logo */}
        <div style={{ marginBottom: '1.25rem' }}>
          <Logo size="md" glow={true} showTagline={false} />
        </div>

        <Badge variant={isEndingA ? 'gold' : 'cyan'} size="md" pulse={true} style={{ marginBottom: '0.75rem' }}>
          {isEndingA ? 'CAMPAIGN CONCLUDED // THE ETERNAL GUARDIAN' : 'CAMPAIGN CONCLUDED // THE ARCHITECT OF TOMORROW'}
        </Badge>

        <h1
          style={{
            fontSize: 'clamp(1.7rem, 3.5vw, 2.4rem)',
            fontWeight: 800,
            color: '#FFFFFF',
            marginBottom: '0.6rem',
            letterSpacing: '0.04em'
          }}
        >
          {isEndingA ? 'THE CONTINUUM RESTORED' : 'A NEW TIMELINE IS BORN'}
        </h1>

        {/* Narrative Epilogue */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            background: isEndingA ? 'rgba(245, 185, 66, 0.06)' : 'rgba(0, 217, 255, 0.06)',
            borderRadius: 'var(--radius-md)',
            borderLeft: `4px solid ${isEndingA ? '#F5B942' : '#00D9FF'}`,
            textAlign: 'left',
            marginBottom: '2rem',
            lineHeight: 1.65,
            fontSize: '0.92rem',
            color: '#E2E8F0'
          }}
        >
          {isEndingA ? (
            <p>
              The Primordial Core pulses with pure golden warmth as the temporal paradoxes collapse into tranquility.
              The ancient citadel in <strong>The Lost Kingdom</strong> greets a serene, unbroken dawn. In <strong>The Broken Present</strong>,
              cybernetic towers mend as humanity steps out into an unfractured morning. And at <strong>The Fractured Future</strong>,
              the Chronarch’s sorrowful stasis dissolves into peace. You remain the silent guardian at the Zero Horizon,
              ensuring that the river of time flows true forevermore.
            </p>
          ) : (
            <p>
              A blinding prismatic convergence floods the Zero Horizon. Rather than returning each world to isolation,
              the ancient stone masonry of <strong>The Lost Kingdom</strong>, the cybernetic ingenuity of <strong>The Broken Present</strong>,
              and the dimensional science of <strong>The Fractured Future</strong> weave into a single glorious epoch.
              The cycle of inevitable decay is broken forever. Guided by your hand, the peoples of all eras unite to build
              an unprecedented dawn—and you walk forward as <strong>The Architect of Tomorrow</strong>.
            </p>
          )}
        </div>

        {/* Campaign Completion Statistics Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
            gap: '0.85rem',
            marginBottom: '2rem'
          }}
        >
          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Campaign Progress</div>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#10B981', marginTop: '2px' }}>100%</div>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Worlds Restored</div>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--color-gold)', marginTop: '2px' }}>4 / 4</div>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Total Playtime</div>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--color-cyan)', marginTop: '2px' }}>{playtimeFormatted}</div>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Chronicles Unlocked</div>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#C084FC', marginTop: '2px' }}>{totalClues}</div>
          </div>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.85rem', justifyContent: 'center', marginBottom: '1.5rem' }}>
          <button
            onClick={() => setShowJournal(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.4rem',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid var(--border-subtle)',
              color: '#FFFFFF',
              fontWeight: 600,
              fontSize: '0.86rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <BookOpen size={16} color="var(--color-gold)" />
            <span>Story Journal [J]</span>
          </button>

          <button
            onClick={() => {
              AudioSystem.playInteract();
              navigate('/player/dashboard');
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.4rem',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid var(--border-subtle)',
              color: '#FFFFFF',
              fontWeight: 600,
              fontSize: '0.86rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <Home size={16} />
            <span>Player Dashboard</span>
          </button>

          <button
            onClick={() => {
              AudioSystem.playInteract();
              if (onReplay) onReplay();
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.6rem',
              borderRadius: 'var(--radius-sm)',
              background: isEndingA
                ? 'linear-gradient(135deg, #F5B942 0%, #D97706 100%)'
                : 'linear-gradient(135deg, #00D9FF 0%, #0284C7 100%)',
              border: 'none',
              color: '#000000',
              fontWeight: 800,
              fontSize: '0.86rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <RotateCcw size={16} />
            <span>Replay Timelines</span>
          </button>
        </div>

        {/* Safe Campaign Reset Link */}
        <div>
          <button
            onClick={() => setShowRestartConfirm(true)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--color-text-muted)',
              fontSize: '0.76rem',
              textDecoration: 'underline',
              cursor: 'pointer',
              transition: 'color 0.2s ease'
            }}
          >
            Start New Campaign (Reset All Saved Progress)
          </button>
        </div>
      </div>

      {/* Story Journal Modal */}
      <StoryJournalModal isOpen={showJournal} onClose={() => setShowJournal(false)} />

      {/* Safe Restart Confirmation Dialog */}
      {showRestartConfirm && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(8px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem'
          }}
        >
          <div
            className="glass-panel-heavy"
            style={{
              maxWidth: '460px',
              padding: '2rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-danger, #EF4444)',
              textAlign: 'center',
              background: 'rgba(15, 10, 18, 0.98)'
            }}
          >
            <AlertTriangle size={42} color="#EF4444" style={{ marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '0.5rem' }}>
              RESTART STORY CAMPAIGN?
            </h3>
            <p style={{ fontSize: '0.84rem', color: 'var(--color-text-secondary)', lineHeight: 1.5, marginBottom: '1.5rem' }}>
              Are you sure you want to reset your campaign progress? This will reset all 4 completed worlds, checkpoints, and timeline states back to World 1: The Lost Kingdom.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <button
                onClick={() => setShowRestartConfirm(false)}
                disabled={isResetting}
                style={{
                  padding: '0.65rem 1.4rem',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid var(--border-subtle)',
                  color: '#FFFFFF',
                  fontWeight: 600,
                  fontSize: '0.82rem',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleRestartCampaign}
                disabled={isResetting}
                style={{
                  padding: '0.65rem 1.4rem',
                  borderRadius: 'var(--radius-sm)',
                  background: '#EF4444',
                  border: 'none',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  cursor: 'pointer'
                }}
              >
                {isResetting ? 'Resetting...' : 'Yes, Reset Campaign'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
