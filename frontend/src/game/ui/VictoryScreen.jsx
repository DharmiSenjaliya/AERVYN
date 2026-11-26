import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, CheckCircle2, Zap, Clock, ArrowRight, RotateCcw } from 'lucide-react';
import Logo from '../../components/common/Logo';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import GameState from '../engine/GameState';
import AudioSystem from '../systems/AudioSystem';

/**
 * World 1 Victory & Timeline Restoration Screen
 * Features official AERVYN logo, XP rewards banner, mission telemetry, and navigation.
 */
export default function VictoryScreen({ worldId = 'world_1', onFreeRoam = () => {} }) {
  const navigate = useNavigate();
  const state = GameState.getState();
  const isWorld2 = worldId === 'world_2' || state.worldId === 'world_2';

  const handleDashboard = () => {
    AudioSystem.playInteract();
    navigate('/player/dashboard');
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(8, 11, 24, 0.95)',
        backdropFilter: 'blur(16px)',
        zIndex: 600,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        animation: 'shimmer 0.5s ease'
      }}
    >
      <div
        className="glass-panel-heavy cyber-border"
        style={{
          width: '100%',
          maxWidth: '560px',
          padding: '2.5rem 2rem',
          textAlign: 'center',
          borderColor: 'var(--border-gold)',
          boxShadow: 'var(--shadow-glow-gold)'
        }}
      >
        {/* Official Brand Logo */}
        <div style={{ marginBottom: '1.25rem' }}>
          <Logo size="md" glow={true} showTagline={false} />
        </div>

        <Badge variant={isWorld2 ? 'purple' : 'gold'} size="md" pulse={true} style={{ marginBottom: '0.75rem' }}>
          {isWorld2 ? 'World 2 Restored' : 'World 1 Restored'}
        </Badge>

        <h1
          style={{
            fontSize: 'clamp(1.5rem, 3.5vw, 2rem)',
            color: '#FFFFFF',
            marginBottom: '0.5rem',
            letterSpacing: '0.04em'
          }}
        >
          {isWorld2 ? 'CENTRAL TIME CORE REPAIRED!' : 'TIMELINE PORTAL AWAKENED!'}
        </h1>

        <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', marginBottom: '1.75rem', lineHeight: 1.5 }}>
          {isWorld2
            ? 'You have stabilized the Broken Present metropolis, recovered all 3 Quantum Cores, synchronized the zero-point phase matrix, and awakened the next timeline gateway.'
            : 'You have mastered the Chrono Keystone, collected the three ancient fragments, aligned the dials, and unlocked the gateway through time.'}
        </p>

        {/* Stats Summary Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1rem',
            marginBottom: '2rem'
          }}
        >
          <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>XP Awarded</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--color-gold)', marginTop: '2px' }}>
              {isWorld2 ? '+750' : '+500'}
            </div>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
              {isWorld2 ? 'Quantum Cores' : 'Fragments'}
            </div>
            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: isWorld2 ? '#C084FC' : 'var(--color-cyan)', marginTop: '2px' }}>
              3 / 3
            </div>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Continuum</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--color-success)', marginTop: '2px' }}>100%</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <Button
            variant={isWorld2 ? 'purple' : 'gold'}
            fullWidth
            size="lg"
            icon={ArrowRight}
            onClick={handleDashboard}
            style={{ fontWeight: 800 }}
          >
            Return to Player Dashboard
          </Button>

          <Button
            variant="secondary"
            fullWidth
            size="md"
            icon={RotateCcw}
            onClick={onFreeRoam}
          >
            Explore {isWorld2 ? 'World 2' : 'World 1'} in Free Roam
          </Button>
        </div>
      </div>
    </div>
  );
}
