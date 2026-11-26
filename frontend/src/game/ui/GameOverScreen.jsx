import React from 'react';
import { RotateCcw, Home, AlertOctagon } from 'lucide-react';
import Logo from '../../components/common/Logo';
import Button from '../../components/common/Button';
import GameState from '../engine/GameState';
import AudioSystem from '../systems/AudioSystem';

/**
 * Game Over / Timeline Failure Screen
 */
export default function GameOverScreen({ onRestart = () => {}, onExit = () => {} }) {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(8, 11, 24, 0.96)',
        backdropFilter: 'blur(16px)',
        zIndex: 600,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem'
      }}
    >
      <div
        className="glass-panel-heavy"
        style={{
          width: '100%',
          maxWidth: '460px',
          padding: '2.5rem 2rem',
          textAlign: 'center',
          border: '1px solid var(--color-danger)',
          boxShadow: '0 0 30px var(--color-danger-glow)'
        }}
      >
        <div style={{ marginBottom: '1.25rem' }}>
          <Logo size="md" glow={false} showTagline={false} />
        </div>

        <div style={{ color: 'var(--color-danger)', marginBottom: '0.5rem' }}>
          <AlertOctagon size={48} style={{ margin: '0 auto' }} />
        </div>

        <h2 style={{ fontSize: '1.75rem', color: '#FFFFFF', marginBottom: '0.4rem', letterSpacing: '0.06em' }}>
          TIMELINE CORRUPTED
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '2rem' }}>
          Your vitals reached zero. The temporal anomaly has collapsed your continuum thread.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <Button
            variant="danger"
            fullWidth
            size="md"
            icon={RotateCcw}
            onClick={() => {
              AudioSystem.playInteract();
              onRestart();
            }}
          >
            Restart from Checkpoint
          </Button>

          <Button
            variant="ghost"
            fullWidth
            size="md"
            icon={Home}
            onClick={() => {
              AudioSystem.playInteract();
              onExit();
            }}
          >
            Exit to Main Menu
          </Button>
        </div>
      </div>
    </div>
  );
}
