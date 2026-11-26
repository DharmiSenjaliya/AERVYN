import React, { useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import {
  Pause,
  Play,
  RotateCcw,
  Home,
  Volume2,
  VolumeX,
  Compass,
  Zap,
  Heart,
  Shield,
  Clock,
  Sparkles,
  Award,
  ChevronRight
} from 'lucide-react';
import Logo from '../components/common/Logo';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Modal from '../components/common/Modal';
import { useAudio } from '../context/AudioContext';

/**
 * Game Layout & HUD Overlay
 * Full-screen container for 3D Game with real-time HUD (Health, Chrono-Energy,
 * Mission Objectives, Time Shift Keybind HUD, Pause Menu, Victory & Game-Over screens).
 */
export default function GameLayout() {
  const [isPaused, setIsPaused] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [victory, setVictory] = useState(false);
  const { muted, toggleMute, playClick, playTimeShift } = useAudio();
  const navigate = useNavigate();

  // Mock initial HUD telemetry until 3D engine hooks into state
  const [health, setHealth] = useState(85);
  const [maxHealth] = useState(100);
  const [chronoEnergy, setChronoEnergy] = useState(70);
  const [maxChronoEnergy] = useState(100);
  const [currentWorld] = useState('World 1: The Lost Kingdom');
  const [currentObjective] = useState('Locate the Ancient Castle Courtyard & Activate the Chrono Device');

  const handleTimeShift = () => {
    playTimeShift();
    // Dispatches custom event for 3D engine listener
    window.dispatchEvent(new CustomEvent('aervyn:time-shift'));
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: '#000000',
        overflow: 'hidden',
        userSelect: 'none'
      }}
    >
      {/* 3D Game Canvas Container (Outlet) */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }}>
        <Outlet />
      </div>

      {/* Real-Time Game HUD Overlay (Z-index 20) */}
      <div
        className="game-hud"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 20,
          pointerEvents: 'none',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '1.25rem'
        }}
      >
        {/* Top HUD Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', pointerEvents: 'auto' }}>
          {/* Top Left: Health & Chrono Energy */}
          <div
            className="glass-panel"
            style={{
              padding: '0.75rem 1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
              minWidth: '220px'
            }}
          >
            {/* Health Bar */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#FFFFFF', marginBottom: '3px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Heart size={12} color="#EF4444" fill="#EF4444" />
                  VITALS
                </span>
                <span>{health} / {maxHealth}</span>
              </div>
              <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                <div
                  style={{
                    width: `${(health / maxHealth) * 100}%`,
                    height: '100%',
                    background: 'linear-gradient(90deg, #EF4444, #F87171)',
                    boxShadow: '0 0 8px rgba(239, 68, 68, 0.6)'
                  }}
                />
              </div>
            </div>

            {/* Chrono Energy Bar */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#FFFFFF', marginBottom: '3px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Zap size={12} color="#00D9FF" fill="#00D9FF" />
                  CHRONO ENERGY
                </span>
                <span>{chronoEnergy} / {maxChronoEnergy}</span>
              </div>
              <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                <div
                  style={{
                    width: `${(chronoEnergy / maxChronoEnergy) * 100}%`,
                    height: '100%',
                    background: 'linear-gradient(90deg, #168CFF, #00D9FF)',
                    boxShadow: '0 0 10px rgba(0, 217, 255, 0.7)'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Top Center: Timeline World Indicator */}
          <div className="glass-panel hide-mobile" style={{ padding: '0.5rem 1.25rem', textAlign: 'center' }}>
            <Badge variant="cyan" size="sm" pulse={true}>
              {currentWorld}
            </Badge>
          </div>

          {/* Top Right: Audio & Pause Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <button
              onClick={() => { toggleMute(); playClick(); }}
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                background: 'rgba(22, 30, 53, 0.85)',
                border: '1px solid var(--border-subtle)',
                color: muted ? 'var(--color-text-muted)' : 'var(--color-cyan)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
              aria-label="Toggle Audio"
            >
              {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>

            <button
              onClick={() => { playClick(); setIsPaused(true); }}
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                background: 'rgba(22, 30, 53, 0.85)',
                border: '1px solid var(--border-cyan)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 0 10px rgba(0, 217, 255, 0.3)'
              }}
              aria-label="Pause Game"
            >
              <Pause size={18} />
            </button>
          </div>
        </div>

        {/* Bottom HUD Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', pointerEvents: 'auto' }}>
          {/* Bottom Left: Active Mission Objective Box */}
          <div
            className="glass-panel-glow"
            style={{
              padding: '0.85rem 1.25rem',
              maxWidth: '360px',
              borderLeft: '4px solid var(--color-gold)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-gold)', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.25rem' }}>
              <Clock size={13} />
              <span>Active Objective</span>
            </div>
            <p style={{ fontSize: '0.82rem', color: '#FFFFFF', lineHeight: 1.4, margin: 0 }}>
              {currentObjective}
            </p>
          </div>

          {/* Bottom Center: Interactive Time Shift Trigger Button */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
            <Button
              variant="cyan"
              size="md"
              icon={Sparkles}
              onClick={handleTimeShift}
              style={{
                boxShadow: '0 0 25px rgba(0, 217, 255, 0.65)',
                fontWeight: 700
              }}
            >
              Shift Timeline [T]
            </Button>
            <span style={{ fontSize: '0.68rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }} className="hide-mobile">
              Chrono Device Ready
            </span>
          </div>

          {/* Bottom Right: Keybinds / Controls Quick Reference */}
          <div
            className="glass-panel hide-mobile"
            style={{
              padding: '0.6rem 0.9rem',
              fontSize: '0.7rem',
              color: 'var(--color-text-muted)',
              display: 'flex',
              gap: '0.75rem'
            }}
          >
            <span><strong style={{ color: '#FFFFFF' }}>WASD</strong> Move</span>
            <span><strong style={{ color: '#FFFFFF' }}>Shift</strong> Run</span>
            <span><strong style={{ color: '#FFFFFF' }}>Space</strong> Jump</span>
            <span><strong style={{ color: '#FFFFFF' }}>E</strong> Interact</span>
            <span><strong style={{ color: '#FFFFFF' }}>ESC</strong> Pause</span>
          </div>
        </div>
      </div>

      {/* Cinematic Pause Screen Modal */}
      <Modal
        isOpen={isPaused}
        onClose={() => setIsPaused(false)}
        maxWidth="460px"
      >
        <div style={{ textAlign: 'center', padding: '1rem 0' }}>
          <Logo size="md" glow={true} showTagline={true} />

          <h2 style={{ fontSize: '1.5rem', color: '#FFFFFF', margin: '1.5rem 0 0.5rem 0', letterSpacing: '0.1em' }}>
            GAME PAUSED
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '2rem' }}>
            The timeline is currently suspended.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <Button
              variant="cyan"
              fullWidth
              icon={Play}
              onClick={() => { playClick(); setIsPaused(false); }}
            >
              Resume Game
            </Button>

            <Button
              variant="secondary"
              fullWidth
              icon={RotateCcw}
              onClick={() => { playClick(); window.location.reload(); }}
            >
              Restart Timeline Checkpoint
            </Button>

            <Button
              variant="ghost"
              fullWidth
              icon={Home}
              onClick={() => { playClick(); navigate('/player/dashboard'); }}
            >
              Exit to Player Dashboard
            </Button>
          </div>
        </div>
      </Modal>

      <style>{`
        @media (max-width: 768px) {
          .hide-mobile {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
