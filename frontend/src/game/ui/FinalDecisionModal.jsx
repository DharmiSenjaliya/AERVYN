import React, { useState } from 'react';
import { Shield, Sparkles, Check, ArrowRight, RotateCcw } from 'lucide-react';
import Logo from '../../components/common/Logo';
import Badge from '../../components/common/Badge';
import GameState from '../engine/GameState';
import AudioSystem from '../systems/AudioSystem';
import axios from 'axios';

/**
 * World 4: The Final Decision Modal
 * Presents the player with the ultimate philosophical choice at the Zero Horizon:
 * Ending A: RESTORE THE TIMELINE (The Eternal Guardian)
 * Ending B: CREATE A NEW TIMELINE (The Architect of Tomorrow)
 */
export default function FinalDecisionModal({ isOpen, onClose, onCompleteEnding }) {
  const [selectedEnding, setSelectedEnding] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSelect = (endingKey) => {
    AudioSystem.playInteract();
    setSelectedEnding(endingKey);
  };

  const handleConfirm = async () => {
    if (!selectedEnding || isSubmitting) return;
    setIsSubmitting(true);

    try {
      // 1. Update GameState with selected ending
      GameState.setEnding(selectedEnding);

      // 2. Persist to Laravel Backend
      const token = localStorage.getItem('token');
      if (token) {
        await axios.post(
          'http://127.0.0.1:8000/api/game/complete-world',
          {
            world_id: 'world_final',
            step_reached: 4,
            ending_selected: selectedEnding
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: 'application/json'
            }
          }
        ).catch(() => {});
      }

      // 3. Notify parent to display Campaign Ending Sequence
      if (onCompleteEnding) {
        onCompleteEnding(selectedEnding);
      }
      onClose();
    } catch {
      if (onCompleteEnding) {
        onCompleteEnding(selectedEnding);
      }
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(4, 6, 14, 0.96)',
        backdropFilter: 'blur(20px)',
        zIndex: 800,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        animation: 'fadeIn 0.4s ease'
      }}
    >
      <div
        className="glass-panel-heavy cyber-border"
        style={{
          width: 'min(94vw, 860px)',
          padding: '2.5rem 2rem',
          borderRadius: 'var(--radius-lg)',
          borderColor: selectedEnding === 'ending_b' ? 'var(--color-cyan)' : 'var(--color-gold)',
          boxShadow: `0 0 50px rgba(0, 0, 0, 0.9), 0 0 30px ${selectedEnding === 'ending_b' ? 'rgba(0, 217, 255, 0.25)' : 'rgba(245, 185, 66, 0.25)'}`,
          background: 'rgba(8, 10, 22, 0.98)',
          textAlign: 'center'
        }}
      >
        {/* Brand Logo */}
        <div style={{ marginBottom: '1rem' }}>
          <Logo size="md" glow={true} showTagline={false} />
        </div>

        <Badge variant={selectedEnding === 'ending_b' ? 'cyan' : 'gold'} size="md" pulse={true} style={{ marginBottom: '0.75rem' }}>
          The Zero Horizon // The Final Choice
        </Badge>

        <h1
          style={{
            fontSize: 'clamp(1.6rem, 3.2vw, 2.2rem)',
            fontWeight: 800,
            color: '#FFFFFF',
            marginBottom: '0.6rem',
            letterSpacing: '0.04em'
          }}
        >
          COMMUNE WITH THE PRIMORDIAL CORE
        </h1>

        <p
          style={{
            fontSize: '0.92rem',
            color: 'var(--color-text-secondary)',
            maxWidth: '680px',
            margin: '0 auto 2rem auto',
            lineHeight: 1.6
          }}
        >
          The Continuum Synchronization Matrix has resonated. All three epochs—Past, Present, and Future—flow
          into the palm of your hand. How will you reshape the destiny of reality?
        </p>

        {/* Choice Cards Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '1.25rem',
            marginBottom: '2rem'
          }}
        >
          {/* Ending A: Restore the Timeline */}
          <div
            onClick={() => handleSelect('ending_a')}
            style={{
              padding: '1.75rem 1.5rem',
              borderRadius: 'var(--radius-md)',
              border: selectedEnding === 'ending_a'
                ? '2px solid var(--color-gold)'
                : '1px solid rgba(255, 255, 255, 0.08)',
              background: selectedEnding === 'ending_a'
                ? 'rgba(245, 185, 66, 0.08)'
                : 'rgba(255, 255, 255, 0.02)',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.25s ease',
              boxShadow: selectedEnding === 'ending_a' ? '0 0 25px rgba(245, 185, 66, 0.2)' : 'none'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    background: 'rgba(245, 185, 66, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--color-gold)'
                  }}
                >
                  <RotateCcw size={18} />
                </div>
                <div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--color-gold)', textTransform: 'uppercase', fontWeight: 700 }}>
                    ENDING A // THE GUARDIAN
                  </span>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#FFFFFF' }}>
                    RESTORE THE TIMELINE
                  </h3>
                </div>
              </div>

              {selectedEnding === 'ending_a' && (
                <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'var(--color-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000' }}>
                  <Check size={14} strokeWidth={3} />
                </div>
              )}
            </div>

            <p style={{ fontSize: '0.84rem', color: 'var(--color-text-secondary)', lineHeight: 1.5, marginBottom: '1rem' }}>
              Sever the temporal paradoxes and restore linear flow. Each world will heal along its natural destiny.
              You will accept mortality and remain the eternal watcher safeguarding reality.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              <span style={{ fontSize: '0.68rem', padding: '0.2rem 0.5rem', background: 'rgba(245, 185, 66, 0.15)', color: 'var(--color-gold)', borderRadius: '4px' }}>
                + Equilibrium Preserved
              </span>
              <span style={{ fontSize: '0.68rem', padding: '0.2rem 0.5rem', background: 'rgba(255, 255, 255, 0.05)', color: 'var(--color-text-muted)', borderRadius: '4px' }}>
                + Natural Order Restored
              </span>
            </div>
          </div>

          {/* Ending B: Create a New Timeline */}
          <div
            onClick={() => handleSelect('ending_b')}
            style={{
              padding: '1.75rem 1.5rem',
              borderRadius: 'var(--radius-md)',
              border: selectedEnding === 'ending_b'
                ? '2px solid var(--color-cyan)'
                : '1px solid rgba(255, 255, 255, 0.08)',
              background: selectedEnding === 'ending_b'
                ? 'rgba(0, 217, 255, 0.08)'
                : 'rgba(255, 255, 255, 0.02)',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.25s ease',
              boxShadow: selectedEnding === 'ending_b' ? '0 0 25px rgba(0, 217, 255, 0.2)' : 'none'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    background: 'rgba(0, 217, 255, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--color-cyan)'
                  }}
                >
                  <Sparkles size={18} />
                </div>
                <div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--color-cyan)', textTransform: 'uppercase', fontWeight: 700 }}>
                    ENDING B // THE ARCHITECT
                  </span>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#FFFFFF' }}>
                    CREATE A NEW TIMELINE
                  </h3>
                </div>
              </div>

              {selectedEnding === 'ending_b' && (
                <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'var(--color-cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000' }}>
                  <Check size={14} strokeWidth={3} />
                </div>
              )}
            </div>

            <p style={{ fontSize: '0.84rem', color: 'var(--color-text-secondary)', lineHeight: 1.5, marginBottom: '1rem' }}>
              Synthesize past magic, present cybernetics, and future science into an unprecedented unified era.
              Break free from cyclical collapse and become the timeless architect of a new dawn.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              <span style={{ fontSize: '0.68rem', padding: '0.2rem 0.5rem', background: 'rgba(0, 217, 255, 0.15)', color: 'var(--color-cyan)', borderRadius: '4px' }}>
                + Transcendent Synthesis
              </span>
              <span style={{ fontSize: '0.68rem', padding: '0.2rem 0.5rem', background: 'rgba(255, 255, 255, 0.05)', color: 'var(--color-text-muted)', borderRadius: '4px' }}>
                + Unlimited Evolution
              </span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <button
            onClick={handleConfirm}
            disabled={!selectedEnding || isSubmitting}
            style={{
              padding: '0.85rem 2.5rem',
              borderRadius: 'var(--radius-sm)',
              background: !selectedEnding
                ? 'rgba(255, 255, 255, 0.08)'
                : selectedEnding === 'ending_b'
                ? 'linear-gradient(135deg, #00D9FF 0%, #0284C7 100%)'
                : 'linear-gradient(135deg, #F5B942 0%, #D97706 100%)',
              border: 'none',
              color: !selectedEnding ? 'var(--color-text-muted)' : '#000000',
              fontWeight: 800,
              fontSize: '0.95rem',
              cursor: selectedEnding && !isSubmitting ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              boxShadow: selectedEnding
                ? `0 0 20px ${selectedEnding === 'ending_b' ? '#00D9FF' : '#F5B942'}66`
                : 'none',
              transition: 'all 0.25s ease'
            }}
          >
            <span>{isSubmitting ? 'Channeling Destiny...' : 'SEAL TEMPORAL DESTINY'}</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
