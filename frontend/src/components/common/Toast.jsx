import React from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

/**
 * Toast Notification Component
 */
export default function Toast({
  type = 'info',
  title = null,
  message,
  onClose,
  duration = 4000
}) {
  const typeMap = {
    success: {
      icon: CheckCircle2,
      color: 'var(--color-success)',
      border: '1px solid var(--color-success)',
      glow: 'var(--color-success-glow)',
      bg: 'rgba(16, 185, 129, 0.15)'
    },
    error: {
      icon: AlertCircle,
      color: 'var(--color-danger)',
      border: '1px solid var(--color-danger)',
      glow: 'var(--color-danger-glow)',
      bg: 'rgba(239, 68, 68, 0.15)'
    },
    warning: {
      icon: AlertTriangle,
      color: 'var(--color-warning)',
      border: '1px solid var(--color-warning)',
      glow: 'rgba(245, 158, 11, 0.4)',
      bg: 'rgba(245, 158, 11, 0.15)'
    },
    info: {
      icon: Info,
      color: 'var(--color-cyan)',
      border: '1px solid var(--border-cyan)',
      glow: 'var(--color-cyan-glow)',
      bg: 'rgba(0, 217, 255, 0.15)'
    }
  };

  const current = typeMap[type] || typeMap.info;
  const Icon = current.icon;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.75rem',
        padding: '0.9rem 1.15rem',
        background: 'var(--bg-glass-heavy)',
        backdropFilter: 'blur(14px)',
        border: current.border,
        boxShadow: `0 8px 24px rgba(0, 0, 0, 0.6), 0 0 15px ${current.glow}`,
        borderRadius: 'var(--radius-md)',
        color: '#FFFFFF',
        minWidth: '280px',
        maxWidth: '420px',
        position: 'relative'
      }}
    >
      <div style={{ color: current.color, marginTop: '2px' }}>
        <Icon size={20} />
      </div>

      <div style={{ flex: 1 }}>
        {title && (
          <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.2rem', color: current.color }}>
            {title}
          </h4>
        )}
        <p style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.4 }}>
          {message}
        </p>
      </div>

      {onClose && (
        <button
          onClick={onClose}
          style={{
            color: 'var(--color-text-muted)',
            padding: '2px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
          aria-label="Dismiss toast"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
