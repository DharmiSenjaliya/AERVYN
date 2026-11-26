import React from 'react';

/**
 * Premium Gaming Input Component
 * Dark glass container with cyan focus glow, icon adornments, helper and error states
 */
export default function Input({
  label = null,
  error = null,
  helper = null,
  icon: Icon = null,
  id,
  name,
  type = 'text',
  value,
  onChange,
  placeholder = '',
  disabled = false,
  required = false,
  className = '',
  style = {},
  inputStyle = {},
  ...props
}) {
  const inputId = id || name || Math.random().toString(36).substring(7);

  return (
    <div className={`aervyn-input-group ${className}`} style={{ marginBottom: '1rem', width: '100%', ...style }}>
      {label && (
        <label
          htmlFor={inputId}
          style={{
            display: 'block',
            fontSize: '0.82rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: error ? 'var(--color-danger)' : 'var(--color-text-secondary)',
            marginBottom: '0.4rem'
          }}
        >
          {label} {required && <span style={{ color: 'var(--color-cyan)' }}>*</span>}
        </label>
      )}

      <div style={{ position: 'relative', width: '100%' }}>
        {Icon && (
          <div
            style={{
              position: 'absolute',
              left: '1rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--color-text-muted)',
              pointerEvents: 'none',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <Icon size={18} />
          </div>
        )}

        <input
          id={inputId}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          style={{
            width: '100%',
            padding: Icon ? '0.75rem 1rem 0.75rem 2.85rem' : '0.75rem 1rem',
            fontSize: '0.92rem',
            background: 'var(--bg-card)',
            color: 'var(--color-text)',
            border: error ? '1px solid var(--color-danger)' : '1px solid var(--border-medium)',
            borderRadius: 'var(--radius-sm)',
            outline: 'none',
            transition: 'all var(--transition-fast)',
            boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.4)',
            ...inputStyle
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = error ? 'var(--color-danger)' : 'var(--color-cyan)';
            e.currentTarget.style.boxShadow = error
              ? '0 0 10px var(--color-danger-glow)'
              : '0 0 12px var(--color-cyan-glow)';
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = error ? 'var(--color-danger)' : 'var(--border-medium)';
            e.currentTarget.style.boxShadow = 'inset 0 2px 4px rgba(0, 0, 0, 0.4)';
          }}
          {...props}
        />
      </div>

      {error ? (
        <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--color-danger)', marginTop: '0.35rem' }}>
          {error}
        </span>
      ) : helper ? (
        <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.35rem' }}>
          {helper}
        </span>
      ) : null}
    </div>
  );
}
