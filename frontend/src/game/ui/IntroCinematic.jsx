import React, { useEffect, useState } from 'react';
import Button from '../../components/common/Button';
import AudioSystem from '../systems/AudioSystem';

/**
 * Cinematic Introduction Cutscene Overlay
 * 21:9 Letterbox format, lore introduction prologue, and skip button.
 */
export default function IntroCinematic({ worldId = 'world_1', onComplete = () => {} }) {
  const [fadeStage, setFadeStage] = useState(0); // 0: Title, 1: Lore, 2: Call to Action

  const isWorldFinal = worldId === 'world_final';
  const isWorld2 = worldId === 'world_2';
  const isWorld3 = worldId === 'world_3';

  useEffect(() => {
    AudioSystem.startAmbience();

    const t1 = setTimeout(() => setFadeStage(1), 3000);
    const t2 = setTimeout(() => setFadeStage(2), 6500);
    const t3 = setTimeout(() => onComplete(), 10000);

    const handleKey = (e) => {
      if (e.key === ' ' || e.key === 'Escape' || e.key === 'Enter') {
        onComplete();
      }
    };
    window.addEventListener('keydown', handleKey);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      window.removeEventListener('keydown', handleKey);
    };
  }, [onComplete]);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'auto',
        zIndex: 150,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        userSelect: 'none'
      }}
    >
      {/* Top 21:9 Letterbox Bar */}
      <div
        style={{
          width: '100%',
          height: '10vh',
          backgroundColor: '#000000',
          borderBottom: '1px solid rgba(0, 217, 255, 0.2)'
        }}
      />

      {/* Center Cinematic Lore Card */}
      <div
        style={{
          alignSelf: 'center',
          textAlign: 'center',
          maxWidth: '680px',
          padding: '2rem',
          background: 'rgba(8, 11, 24, 0.75)',
          backdropFilter: 'blur(8px)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)',
          boxShadow: '0 0 30px rgba(0, 0, 0, 0.8)'
        }}
      >
        {fadeStage === 0 && (
          <div style={{ animation: 'shimmer 1.5s ease' }}>
            <span
              style={{
                fontSize: '0.85rem',
                letterSpacing: '0.3em',
                textTransform: 'uppercase',
                color: isWorldFinal ? '#38BDF8' : isWorld3 ? 'var(--color-gold)' : isWorld2 ? 'var(--color-purple)' : 'var(--color-cyan)',
                fontWeight: 700
              }}
            >
              {isWorldFinal ? 'THE ZERO HORIZON \u2022 OUTSIDE LINEAR TIME' : isWorld3 ? 'YEAR 3140 \u2022 FUTURE HORIZON' : isWorld2 ? 'YEAR 2026 \u2022 PRESENT ERA' : 'YEAR -840 \u2022 PAST ERA'}
            </span>
            <h1
              style={{
                fontSize: 'clamp(1.8rem, 4vw, 2.6rem)',
                color: '#FFFFFF',
                marginTop: '0.6rem',
                letterSpacing: '0.08em'
              }}
            >
              {isWorldFinal ? 'THE LAST TIMELINE' : isWorld3 ? 'THE FRACTURED FUTURE' : isWorld2 ? 'THE BROKEN PRESENT' : 'THE LOST KINGDOM'}
            </h1>
          </div>
        )}

        {fadeStage === 1 && (
          <div style={{ animation: 'shimmer 1.5s ease' }}>
            <p
              style={{
                fontSize: '1.15rem',
                color: 'var(--color-text-secondary)',
                lineHeight: 1.7,
                margin: 0
              }}
            >
              {isWorldFinal
                ? 'You step across the threshold of reality into the timeless Zero Horizon. All three epochs shimmer in the celestial reflection mirrors, awaiting their final harmonization.'
                : isWorld3
                ? 'The portal transports you to the end of time. Floating celestial islands drift above a violent cosmic vortex where history itself is collapsing.'
                : isWorld2
                ? 'Emerging through the portal, the world of 2026 is shattered. Time distortions suspend skyscrapers mid-collapse, and security drones guard the ruins.'
                : 'Before the cataclysmic temporal fracture, the ancient castle stood as the cradle of the Chrono Keystone.'}
            </p>
          </div>
        )}

        {fadeStage === 2 && (
          <div style={{ animation: 'shimmer 1.5s ease' }}>
            <p
              style={{
                fontSize: '1.15rem',
                color: '#FFFFFF',
                lineHeight: 1.7,
                fontWeight: 600,
                margin: 0
              }}
            >
              {isWorldFinal
                ? 'Align the three Epoch Keystones in the Continuum Synchronization Matrix. Commune with the Primordial Core, and decide the ultimate fate of existence.'
                : isWorld3
                ? 'Reclaim the three Chrono Shards. Solve the Time Labyrinth, infiltrate the central spire, and defeat THE CHRONARCH to restore the Master Timeline Engine!'
                : isWorld2
                ? 'Investigate the city. Reclaim the 3 Quantum Energy Cores, breach the underground research lab, and repair the Central Time Core.'
                : 'Discover the ancient device. Collect the three scattered energy fragments. Restore the first timeline gateway.'}
            </p>
          </div>
        )}
      </div>

      {/* Bottom 21:9 Letterbox Bar with Skip Button */}
      <div
        style={{
          width: '100%',
          height: '10vh',
          backgroundColor: '#000000',
          borderTop: '1px solid rgba(0, 217, 255, 0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          padding: '0 2rem',
          boxSizing: 'border-box'
        }}
      >
        <button
          onClick={onComplete}
          style={{
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid var(--border-cyan)',
            color: 'var(--color-cyan)',
            padding: '0.5rem 1.25rem',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.8rem',
            fontWeight: 700,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            cursor: 'pointer'
          }}
        >
          Skip Intro [Space]
        </button>
      </div>
    </div>
  );
}
