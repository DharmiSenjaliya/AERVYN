import React from 'react';
import { Loader2 } from 'lucide-react';

/**
 * Premium Gaming Button Component
 * Variants: primary (chrono blue), cyan (portal neon), gold (ancient artifact),
 * purple (void energy), secondary (dark glass), outline, ghost, danger
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon = null,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  fullWidth = false,
  onClick = () => {},
  className = '',
  type = 'button',
  style = {},
  ...props
}) {
  const baseStyles = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 600,
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
    borderRadius: 'var(--radius-sm)',
    transition: 'all var(--transition-normal)',
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    width: fullWidth ? '100%' : 'auto',
    position: 'relative',
    overflow: 'hidden',
    userSelect: 'none',
    gap: '0.5rem',
    ...style
  };

  const sizeStyles = {
    sm: { padding: '0.45rem 0.9rem', fontSize: '0.75rem', height: '34px' },
    md: { padding: '0.65rem 1.4rem', fontSize: '0.85rem', height: '42px' },
    lg: { padding: '0.85rem 2rem', fontSize: '0.95rem', height: '50px' }
  };

  const variantStyles = {
    primary: {
      background: 'linear-gradient(135deg, #168CFF 0%, #0052CC 100%)',
      color: '#FFFFFF',
      border: '1px solid rgba(0, 217, 255, 0.4)',
      boxShadow: '0 4px 15px rgba(22, 140, 255, 0.35)',
    },
    cyan: {
      background: 'linear-gradient(135deg, #00D9FF 0%, #0088CC 100%)',
      color: '#080B18',
      border: '1px solid #00D9FF',
      boxShadow: '0 4px 20px rgba(0, 217, 255, 0.45)',
      fontWeight: 700,
    },
    gold: {
      background: 'linear-gradient(135deg, #F5B942 0%, #D48800 100%)',
      color: '#080B18',
      border: '1px solid #FFE082',
      boxShadow: '0 4px 20px rgba(245, 185, 66, 0.45)',
      fontWeight: 700,
    },
    purple: {
      background: 'linear-gradient(135deg, #9065FF 0%, #5025D8 100%)',
      color: '#FFFFFF',
      border: '1px solid rgba(192, 132, 252, 0.4)',
      boxShadow: '0 4px 20px rgba(112, 71, 255, 0.4)',
    },
    secondary: {
      background: 'rgba(22, 30, 53, 0.85)',
      color: 'var(--color-text)',
      border: '1px solid var(--border-medium)',
      backdropFilter: 'blur(8px)',
    },
    outline: {
      background: 'transparent',
      color: 'var(--color-cyan)',
      border: '1px solid var(--border-cyan)',
      boxShadow: '0 0 10px rgba(0, 217, 255, 0.15)',
    },
    ghost: {
      background: 'transparent',
      color: 'var(--color-text-muted)',
      border: '1px solid transparent',
    },
    danger: {
      background: 'linear-gradient(135deg, #EF4444 0%, #991B1B 100%)',
      color: '#FFFFFF',
      border: '1px solid rgba(239, 68, 68, 0.4)',
      boxShadow: '0 4px 15px rgba(239, 68, 68, 0.35)',
    }
  };

  const currentSize = sizeStyles[size] || sizeStyles.md;
  const currentVariant = variantStyles[variant] || variantStyles.primary;

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={disabled || loading ? undefined : onClick}
      className={`aervyn-btn aervyn-btn-${variant} ${className}`}
      style={{
        ...baseStyles,
        ...currentSize,
        ...currentVariant,
      }}
      onMouseEnter={(e) => {
        if (!disabled && !loading) {
          e.currentTarget.style.transform = 'translateY(-2px)';
          if (variant === 'primary' || variant === 'cyan') {
            e.currentTarget.style.boxShadow = '0 6px 25px rgba(0, 217, 255, 0.6)';
          } else if (variant === 'gold') {
            e.currentTarget.style.boxShadow = '0 6px 25px rgba(245, 185, 66, 0.6)';
          } else if (variant === 'purple') {
            e.currentTarget.style.boxShadow = '0 6px 25px rgba(112, 71, 255, 0.6)';
          } else if (variant === 'secondary' || variant === 'outline') {
            e.currentTarget.style.borderColor = 'var(--color-cyan)';
            e.currentTarget.style.color = '#FFFFFF';
          }
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled && !loading) {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = currentVariant.boxShadow || 'none';
          e.currentTarget.style.borderColor = currentVariant.border?.split(' ')[2] || 'transparent';
          if (variant === 'outline') e.currentTarget.style.color = 'var(--color-cyan)';
        }
      }}
      {...props}
    >
      {loading ? (
        <>
          <Loader2 size={16} className="animate-spin" style={{ animation: 'timeRotate 1s linear infinite' }} />
          <span>Processing...</span>
        </>
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} />}
          <span>{children}</span>
          {Icon && iconPosition === 'right' && <Icon size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} />}
        </>
      )}
    </button>
  );
}
