import React, { useState, useEffect } from 'react';
import Logo from './Logo';

/**
 * Cinematic AERVYN Loading Screen
 * Features the official logo, animated time vortex rings, progress bar, and timeline lore ticker
 */
export default function LoadingScreen({
  progress = null,
  message = 'Synchronizing Temporal Matrix...',
  fullScreen = true
}) {
  const [loreIndex, setLoreIndex] = useState(0);

  const loreTips = [
    'The Chrono Device resonates when ancient portals draw near.',
    'Timeline fractures can be stabilized by collecting Chrono-Cores.',
    'World 1: The Lost Kingdom holds secrets from an era untouched by corruption.',
    'Press Shift to sprint when escaping dimensional collapses.',
    'Interact with ancient glyphs using [E] to decipher timeline coordinates.',
    'Conserve your temporal energy before attempting high-order time shifts.'
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setLoreIndex((prev) => (prev + 1) % loreTips.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [loreTips.length]);

  const containerStyle = fullScreen
    ? {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'var(--bg-primary)',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        backgroundImage: 'radial-gradient(circle at center, rgba(16, 140, 255, 0.12) 0%, rgba(8, 11, 24, 0.95) 70%)'
      }
    : {
        width: '100%',
        minHeight: '400px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem'
      };

  return (
    <div style={containerStyle}>
      {/* Outer Rotating Energy Ring */}
      <div
        style={{
          position: 'relative',
          width: '220px',
          height: '220px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '2rem'
        }}
      >
        {/* Ring 1 - Outer Cyan */}
        <div
          className="animate-spin-slow"
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            border: '2px dashed rgba(0, 217, 255, 0.4)',
            boxShadow: '0 0 25px rgba(0, 217, 255, 0.25)'
          }}
        />

        {/* Ring 2 - Inner Purple */}
        <div
          className="animate-spin-reverse"
          style={{
            position: 'absolute',
            width: '78%',
            height: '78%',
            borderRadius: '50%',
            border: '2px solid transparent',
            borderTopColor: 'var(--color-purple)',
            borderBottomColor: 'var(--color-gold)',
            boxShadow: '0 0 20px rgba(112, 71, 255, 0.35)'
          }}
        />

        {/* Official Brand Logo */}
        <div className="animate-portal" style={{ zIndex: 2 }}>
          <Logo size="md" glow={true} showTagline={false} />
        </div>
      </div>

      {/* Progress Message */}
      <h3
        style={{
          fontSize: '1.1rem',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          color: 'var(--color-cyan)',
          fontWeight: 700,
          marginBottom: '1rem',
          textAlign: 'center',
          textShadow: '0 0 10px rgba(0, 217, 255, 0.6)'
        }}
      >
        {message}
      </h3>

      {/* Progress Bar (if provided or animated indeterminate) */}
      <div
        style={{
          width: '100%',
          maxWidth: '340px',
          height: '6px',
          backgroundColor: 'rgba(255, 255, 255, 0.08)',
          borderRadius: 'var(--radius-full)',
          overflow: 'hidden',
          border: '1px solid var(--border-subtle)',
          marginBottom: '1.5rem',
          position: 'relative'
        }}
      >
        {progress !== null ? (
          <div
            style={{
              height: '100%',
              width: `${Math.min(100, Math.max(0, progress))}%`,
              background: 'linear-gradient(90deg, #168CFF, #00D9FF, #F5B942)',
              boxShadow: '0 0 12px var(--color-cyan)',
              transition: 'width 0.3s ease'
            }}
          />
        ) : (
          <div
            style={{
              height: '100%',
              width: '40%',
              background: 'linear-gradient(90deg, #168CFF, #00D9FF)',
              boxShadow: '0 0 15px var(--color-cyan)',
              animation: 'shimmer 1.8s infinite ease-in-out',
              borderRadius: 'var(--radius-full)'
            }}
          />
        )}
      </div>

      {/* Lore Hint Ticker */}
      <div
        style={{
          maxWidth: '480px',
          textAlign: 'center',
          fontSize: '0.85rem',
          color: 'var(--color-text-muted)',
          fontStyle: 'italic',
          padding: '0.5rem 1rem',
          background: 'rgba(22, 30, 53, 0.5)',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--border-subtle)',
          minHeight: '44px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'opacity 0.3s ease'
        }}
      >
        &ldquo;{loreTips[loreIndex]}&rdquo;
      </div>
    </div>
  );
}
