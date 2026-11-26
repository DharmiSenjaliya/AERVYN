import React, { useState } from 'react';
import Button from '../../components/common/Button';
import GameState from '../engine/GameState';
import AudioSystem from '../systems/AudioSystem';

/**
 * Game Settings Modal Panel
 * Music volume, SFX volume, camera sensitivity, and graphics quality presets
 */
export default function GameSettings({ onClose = () => {} }) {
  const currentSettings = GameState.getState().settings;

  const [sfxVol, setSfxVol] = useState(Math.round(currentSettings.sfxVolume * 100));
  const [sensitivity, setSensitivity] = useState(currentSettings.mouseSensitivity);
  const [quality, setQuality] = useState(currentSettings.graphicsQuality);

  const handleSave = () => {
    AudioSystem.playInteract();
    try {
      localStorage.setItem('aervyn_graphics_quality', quality);
      localStorage.setItem('aervyn_sfx_volume', String(sfxVol / 100));
      localStorage.setItem('aervyn_sensitivity', String(sensitivity));
    } catch {}

    GameState.setState({
      settings: {
        ...currentSettings,
        sfxVolume: sfxVol / 100,
        mouseSensitivity: parseFloat(sensitivity),
        graphicsQuality: quality
      }
    });
    onClose();
  };

  return (
    <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <h3 style={{ fontSize: '1.1rem', color: '#FFFFFF', textAlign: 'center', marginBottom: '0.5rem' }}>
        Game Settings
      </h3>

      {/* SFX Volume */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '0.4rem', color: 'var(--color-text-secondary)' }}>
          <span>Sound Effects Volume</span>
          <span>{sfxVol}%</span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={sfxVol}
          onChange={(e) => setSfxVol(Number(e.target.value))}
          style={{ width: '100%', accentColor: 'var(--color-cyan)', cursor: 'pointer' }}
        />
      </div>

      {/* Camera Sensitivity */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '0.4rem', color: 'var(--color-text-secondary)' }}>
          <span>Look Sensitivity</span>
          <span>{sensitivity}x</span>
        </div>
        <input
          type="range"
          min="0.5"
          max="2.5"
          step="0.1"
          value={sensitivity}
          onChange={(e) => setSensitivity(Number(e.target.value))}
          style={{ width: '100%', accentColor: 'var(--color-cyan)', cursor: 'pointer' }}
        />
      </div>

      {/* Graphics Quality */}
      <div>
        <span style={{ display: 'block', fontSize: '0.82rem', marginBottom: '0.5rem', color: 'var(--color-text-secondary)' }}>
          Graphics Quality
        </span>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
          {['low', 'medium', 'high'].map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => setQuality(q)}
              style={{
                padding: '0.5rem',
                borderRadius: 'var(--radius-xs)',
                fontSize: '0.75rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                background: quality === q ? 'linear-gradient(135deg, #168CFF, #00D9FF)' : 'rgba(255, 255, 255, 0.05)',
                color: quality === q ? '#080B18' : 'var(--color-text-muted)',
                border: quality === q ? '1px solid #00D9FF' : '1px solid var(--border-subtle)',
                cursor: 'pointer'
              }}
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.75rem' }}>
        <Button variant="cyan" fullWidth size="sm" onClick={handleSave}>
          Apply Settings
        </Button>
        <Button variant="ghost" fullWidth size="sm" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
