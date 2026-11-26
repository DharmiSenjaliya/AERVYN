import React from 'react';

/**
 * AERVYN Cybernetic Status Badge
 * Variants: chrono, cyan, gold, purple, success, warning, danger, neutral
 */
export default function Badge({
  children,
  variant = 'cyan',
  size = 'md',
  icon: Icon = null,
  pulse = false,
  className = '',
  style = {}
}) {
  const variantMap = {
    chrono: {
      bg: 'rgba(22, 140, 255, 0.15)',
      text: '#5CA9FF',
      border: '1px solid rgba(22, 140, 255, 0.4)',
      glow: '0 0 10px rgba(22, 140, 255, 0.25)'
    },
    cyan: {
      bg: 'rgba(0, 217, 255, 0.15)',
      text: '#00D9FF',
      border: '1px solid rgba(0, 217, 255, 0.4)',
      glow: '0 0 10px rgba(0, 217, 255, 0.25)'
    },
    gold: {
      bg: 'rgba(245, 185, 66, 0.15)',
      text: '#F5B942',
      border: '1px solid rgba(245, 185, 66, 0.4)',
      glow: '0 0 10px rgba(245, 185, 66, 0.25)'
    },
    purple: {
      bg: 'rgba(112, 71, 255, 0.15)',
      text: '#C084FC',
      border: '1px solid rgba(112, 71, 255, 0.4)',
      glow: '0 0 10px rgba(112, 71, 255, 0.25)'
    },
    success: {
      bg: 'rgba(16, 185, 129, 0.15)',
      text: '#34D399',
      border: '1px solid rgba(16, 185, 129, 0.4)',
      glow: '0 0 10px rgba(16, 185, 129, 0.25)'
    },
    warning: {
      bg: 'rgba(245, 158, 11, 0.15)',
      text: '#FBBF24',
      border: '1px solid rgba(245, 158, 11, 0.4)',
      glow: '0 0 10px rgba(245, 158, 11, 0.25)'
    },
    danger: {
      bg: 'rgba(239, 68, 68, 0.15)',
      text: '#F87171',
      border: '1px solid rgba(239, 68, 68, 0.4)',
      glow: '0 0 10px rgba(239, 68, 68, 0.25)'
    },
    neutral: {
      bg: 'rgba(255, 255, 255, 0.08)',
      text: 'var(--color-text-muted)',
      border: '1px solid var(--border-subtle)',
      glow: 'none'
    }
  };

  const sizeMap = {
    sm: { padding: '0.15rem 0.5rem', fontSize: '0.65rem' },
    md: { padding: '0.25rem 0.75rem', fontSize: '0.75rem' },
    lg: { padding: '0.35rem 1rem', fontSize: '0.85rem' }
  };

  const v = variantMap[variant] || variantMap.cyan;
  const s = sizeMap[size] || sizeMap.md;

  return (
    <span
      className={`aervyn-badge ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.35rem',
        background: v.bg,
        color: v.text,
        border: v.border,
        boxShadow: v.glow,
        borderRadius: 'var(--radius-full)',
        fontWeight: 600,
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
        userSelect: 'none',
        lineHeight: 1.2,
        ...s,
        ...style
      }}
    >
      {pulse && (
        <span
          style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: v.text,
            boxShadow: `0 0 8px ${v.text}`,
            animation: 'portalPulse 1.8s infinite'
          }}
        />
      )}
      {Icon && <Icon size={size === 'sm' ? 10 : 12} />}
      <span>{children}</span>
    </span>
  );
}
