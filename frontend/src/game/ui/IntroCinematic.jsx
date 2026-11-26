import React, { useEffect, useState } from 'react';
import Button from '../../components/common/Button';
import AudioSystem from '../systems/AudioSystem';

/**
 * Cinematic Introduction Cutscene Overlay
 * 21:9 Letterbox format, lore introduction prologue, and skip button.
 */
export default function IntroCinematic({ onComplete = () => {} }) {
  const [fadeStage, setFadeStage] = useState(0); // 0: Title, 1: Lore, 2: Call to Action

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
                color: 'var(--color-cyan)',
                fontWeight: 700
              }}
            >
              YEAR -840 &bull; PAST ERA
            </span>
            <h1
              style={{
                fontSize: 'clamp(1.8rem, 4vw, 2.6rem)',
                color: '#FFFFFF',
                marginTop: '0.6rem',
                letterSpacing: '0.08em'
              }}
            >
              THE LOST KINGDOM
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
              Before the cataclysmic temporal fracture, the ancient castle stood as the cradle of the <em>Chrono Keystone</em>.
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
              Discover the ancient device. Collect the three scattered energy fragments. Restore the first timeline gateway.
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
