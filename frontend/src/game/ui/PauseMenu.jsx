import React, { useState } from 'react';
import { Play, RotateCcw, Sliders, Home, Compass } from 'lucide-react';
import Logo from '../../components/common/Logo';
import Button from '../../components/common/Button';
import GameState from '../engine/GameState';
import AudioSystem from '../systems/AudioSystem';
import GameSettings from './GameSettings';

/**
 * Game Pause Screen
 * Displays official AERVYN logo, checkpoint restart, settings, and navigation.
 */
export default function PauseMenu({ onResume = () => {}, onExitToMenu = () => {} }) {
  const [showSettings, setShowSettings] = useState(false);

  const handleRestartCheckpoint = () => {
    AudioSystem.playInteract();
    const cp = GameState.getState().checkpoint;
    GameState.setState({
      player: {
        ...GameState.getState().player,
        position: [...cp.position],
        health: 100
      }
    });
    onResume();
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(8, 11, 24, 0.92)',
        backdropFilter: 'blur(12px)',
        zIndex: 500,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem'
      }}
    >
      <div
        className="glass-panel-heavy cyber-border"
        style={{
          width: '100%',
          maxWidth: '460px',
          padding: '2.5rem 2rem',
          textAlign: 'center',
          borderColor: 'var(--border-cyan)',
          boxShadow: 'var(--shadow-glow-cyan)'
        }}
      >
        {/* Official Brand Logo */}
        <div style={{ marginBottom: '1.5rem' }}>
          <Logo size="md" glow={true} showTagline={true} />
        </div>

        <h2 style={{ fontSize: '1.6rem', color: '#FFFFFF', marginBottom: '0.4rem', letterSpacing: '0.08em' }}>
          GAME PAUSED
        </h2>
        <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', marginBottom: '1.75rem' }}>
          Continuum suspended at {GameState.getState().checkpoint.name}.
        </p>

        {showSettings ? (
          <div>
            <GameSettings onClose={() => setShowSettings(false)} />
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <Button
              variant="cyan"
              fullWidth
              size="md"
              icon={Play}
              onClick={() => {
                AudioSystem.playInteract();
                onResume();
              }}
            >
              Resume Game
            </Button>

            <Button
              variant="secondary"
              fullWidth
              size="md"
              icon={RotateCcw}
              onClick={handleRestartCheckpoint}
            >
              Restart from Checkpoint
            </Button>

            <Button
              variant="secondary"
              fullWidth
              size="md"
              icon={Sliders}
              onClick={() => {
                AudioSystem.playInteract();
                setShowSettings(true);
              }}
            >
              Game Settings
            </Button>

            <Button
              variant="ghost"
              fullWidth
              size="md"
              icon={Home}
              onClick={() => {
                AudioSystem.playInteract();
                onExitToMenu();
              }}
            >
              Return to Main Menu
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
