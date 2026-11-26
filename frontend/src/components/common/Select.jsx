import React from 'react';
import { ChevronDown } from 'lucide-react';

/**
 * Premium Gaming Select Dropdown
 */
export default function Select({
  label = null,
  error = null,
  id,
  name,
  value,
  onChange,
  options = [],
  placeholder = 'Select option...',
  disabled = false,
  required = false,
  className = '',
  style = {},
  ...props
}) {
  const selectId = id || name || Math.random().toString(36).substring(7);

  return (
    <div className={`aervyn-select-group ${className}`} style={{ marginBottom: '1rem', width: '100%', ...style }}>
      {label && (
        <label
          htmlFor={selectId}
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
        <select
          id={selectId}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          style={{
            width: '100%',
            padding: '0.75rem 2.5rem 0.75rem 1rem',
            fontSize: '0.92rem',
            background: 'var(--bg-card)',
            color: 'var(--color-text)',
            border: error ? '1px solid var(--color-danger)' : '1px solid var(--border-medium)',
            borderRadius: 'var(--radius-sm)',
            outline: 'none',
            appearance: 'none',
            cursor: disabled ? 'not-allowed' : 'pointer',
            transition: 'all var(--transition-fast)',
            boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.4)'
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = error ? 'var(--color-danger)' : 'var(--color-cyan)';
            e.currentTarget.style.boxShadow = '0 0 12px var(--color-cyan-glow)';
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = error ? 'var(--color-danger)' : 'var(--border-medium)';
            e.currentTarget.style.boxShadow = 'inset 0 2px 4px rgba(0, 0, 0, 0.4)';
          }}
          {...props}
        >
          {placeholder && <option value="" disabled>{placeholder}</option>}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} style={{ background: '#11172B', color: '#FFFFFF' }}>
              {opt.label}
            </option>
          ))}
        </select>
        <div
          style={{
            position: 'absolute',
            right: '1rem',
            top: '50%',
            transform: 'translateY(-50%)',
            pointerEvents: 'none',
            color: 'var(--color-text-muted)'
          }}
        >
          <ChevronDown size={16} />
        </div>
      </div>

      {error && (
        <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--color-danger)', marginTop: '0.35rem' }}>
          {error}
        </span>
      )}
    </div>
  );
}
