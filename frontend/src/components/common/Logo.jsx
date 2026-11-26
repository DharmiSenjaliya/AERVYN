import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Official AERVYN Logo Component
 * Strictly renders the official brand asset at /assets/aervyn-logo.png
 * Proportions and original image are permanently preserved.
 */
export default function Logo({
  size = 'md',
  glow = true,
  linkTo = null,
  showTagline = false,
  className = '',
  style = {}
}) {
  const sizeMap = {
    xs: { height: 26, width: 'auto' },
    sm: { height: 36, width: 'auto' },
    md: { height: 48, width: 'auto' },
    lg: { height: 72, width: 'auto' },
    xl: { height: 100, width: 'auto' },
    hero: { height: 140, width: 'auto' }
  };

  const dimensions = sizeMap[size] || sizeMap.md;

  const logoImage = (
    <div
      className={`aervyn-logo-wrapper ${className}`}
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        ...style
      }}
    >
      <img
        src="/assets/aervyn-logo.png"
        alt="AERVYN: Echoes of Time"
        style={{
          height: dimensions.height,
          width: dimensions.width,
          maxWidth: '100%',
          objectFit: 'contain',
          filter: glow
            ? 'drop-shadow(0 0 16px rgba(0, 217, 255, 0.45)) drop-shadow(0 0 30px rgba(112, 71, 255, 0.35))'
            : 'drop-shadow(0 2px 6px rgba(0, 0, 0, 0.6))',
          transition: 'filter 0.3s ease, transform 0.3s ease',
          userSelect: 'none',
          pointerEvents: 'auto'
        }}
        onMouseEnter={(e) => {
          if (glow) {
            e.currentTarget.style.filter =
              'drop-shadow(0 0 24px rgba(0, 217, 255, 0.7)) drop-shadow(0 0 45px rgba(112, 71, 255, 0.55))';
            e.currentTarget.style.transform = 'scale(1.02)';
          }
        }}
        onMouseLeave={(e) => {
          if (glow) {
            e.currentTarget.style.filter =
              'drop-shadow(0 0 16px rgba(0, 217, 255, 0.45)) drop-shadow(0 0 30px rgba(112, 71, 255, 0.35))';
            e.currentTarget.style.transform = 'scale(1)';
          }
        }}
      />
      {showTagline && (
        <span
          style={{
            marginTop: '0.4rem',
            fontSize: size === 'hero' ? '0.85rem' : '0.65rem',
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            color: 'var(--color-cyan)',
            fontWeight: 600,
            opacity: 0.9,
            textAlign: 'center',
            textShadow: '0 0 10px rgba(0, 217, 255, 0.5)'
          }}
        >
          Echoes of Time
        </span>
      )}
    </div>
  );

  if (linkTo) {
    return (
      <Link to={linkTo} style={{ display: 'inline-flex', textDecoration: 'none' }}>
        {logoImage}
      </Link>
    );
  }

  return logoImage;
}
