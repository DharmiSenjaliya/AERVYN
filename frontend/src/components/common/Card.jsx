import React from 'react';

/**
 * Premium Gaming Card Container
 * Supports glassmorphism, glowing accents, cybernetic headers and interactive hover states
 */
export default function Card({
  children,
  title = null,
  subtitle = null,
  badge = null,
  action = null,
  accent = 'none', // 'cyan', 'blue', 'gold', 'purple', 'none'
  hover = true,
  className = '',
  style = {},
  headerStyle = {},
  bodyStyle = {},
  onClick = null
}) {
  const accentBorders = {
    none: 'var(--border-subtle)',
    cyan: 'var(--border-cyan)',
    blue: 'var(--border-blue)',
    gold: 'var(--border-gold)',
    purple: 'var(--border-purple)'
  };

  const accentGlows = {
    none: 'var(--shadow-md)',
    cyan: '0 4px 20px rgba(0, 217, 255, 0.25)',
    blue: '0 4px 20px rgba(22, 140, 255, 0.25)',
    gold: '0 4px 20px rgba(245, 185, 66, 0.25)',
    purple: '0 4px 20px rgba(112, 71, 255, 0.25)'
  };

  return (
    <div
      onClick={onClick}
      className={`aervyn-card ${className}`}
      style={{
        background: 'var(--bg-glass)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: `1px solid ${accentBorders[accent] || accentBorders.none}`,
        borderRadius: 'var(--radius-md)',
        boxShadow: accentGlows[accent] || accentGlows.none,
        transition: 'all var(--transition-normal)',
        overflow: 'hidden',
        position: 'relative',
        cursor: onClick ? 'pointer' : 'default',
        ...style
      }}
      onMouseEnter={(e) => {
        if (hover) {
          e.currentTarget.style.transform = 'translateY(-3px)';
          e.currentTarget.style.borderColor = accent === 'none' ? 'var(--border-cyan)' : accentBorders[accent];
          e.currentTarget.style.boxShadow =
            accent === 'gold'
              ? 'var(--shadow-glow-gold)'
              : accent === 'purple'
              ? 'var(--shadow-glow-purple)'
              : 'var(--shadow-glow-cyan)';
        }
      }}
      onMouseLeave={(e) => {
        if (hover) {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.borderColor = accentBorders[accent] || accentBorders.none;
          e.currentTarget.style.boxShadow = accentGlows[accent] || accentGlows.none;
        }
      }}
    >
      {(title || subtitle || badge || action) && (
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.75rem',
            ...headerStyle
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              {title && (
                <h3 style={{ fontSize: '1.15rem', color: '#FFFFFF', fontWeight: 600 }}>
                  {title}
                </h3>
              )}
              {badge}
            </div>
            {subtitle && (
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
                {subtitle}
              </p>
            )}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}

      <div style={{ padding: '1.5rem', ...bodyStyle }}>{children}</div>
    </div>
  );
}
