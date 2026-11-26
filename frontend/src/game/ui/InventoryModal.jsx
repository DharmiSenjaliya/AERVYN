import React from 'react';
import { X, Sparkles, Zap, Shield, Key } from 'lucide-react';
import GameState from '../engine/GameState';
import Badge from '../../components/common/Badge';

/**
 * Player Inventory Modal
 * Item descriptions, rarity tiers, and Chrono energy status
 */
export default function InventoryModal({ isOpen = false, onClose = () => {} }) {
  if (!isOpen) return null;

  const state = GameState.getState();
  const items = state.inventory?.items || [];
  const fragments = state.inventory?.fragmentsCollected || 0;
  const hasKeystone = state.inventory?.hasKeystone || false;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(8, 11, 24, 0.88)',
        backdropFilter: 'blur(10px)',
        zIndex: 450,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        userSelect: 'none'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="glass-panel-heavy cyber-border"
        style={{
          width: '100%',
          maxWidth: '520px',
          padding: '2rem',
          borderColor: 'var(--border-cyan)',
          boxShadow: 'var(--shadow-glow-cyan)'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', color: '#FFFFFF', fontWeight: 700 }}>
              Chrono Inventory
            </h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-cyan)' }}>
              Artifacts & Temporal Fragments
            </span>
          </div>

          <button
            onClick={onClose}
            style={{
              color: 'var(--color-text-muted)',
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Items List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', maxHeight: '360px', overflowY: 'auto' }}>
          {/* Chrono Keystone Slot */}
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '1rem',
              padding: '0.85rem 1rem',
              background: hasKeystone ? 'rgba(245, 185, 66, 0.1)' : 'rgba(255, 255, 255, 0.02)',
              border: hasKeystone ? '1px solid var(--border-gold)' : '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-sm)',
              opacity: hasKeystone ? 1 : 0.5
            }}
          >
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: 'var(--radius-xs)',
                background: hasKeystone ? 'linear-gradient(135deg, #F5B942, #B87800)' : 'rgba(255, 255, 255, 0.05)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#080B18',
                flexShrink: 0
              }}
            >
              <Sparkles size={22} color={hasKeystone ? '#080B18' : 'var(--color-text-dim)'} />
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 700, fontSize: '0.92rem', color: '#FFFFFF' }}>
                  Chrono Keystone
                </span>
                <Badge variant={hasKeystone ? 'gold' : 'neutral'} size="sm">
                  {hasKeystone ? 'Ancient Artifact' : 'Not Yet Claimed'}
                </Badge>
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', margin: '0.35rem 0 0 0', lineHeight: 1.4 }}>
                A forged relic capable of locking onto timeline anchors and channeling energy fragments.
              </p>
            </div>
          </div>

          {/* Temporal Energy Fragments Slots */}
          {[
            { id: 'fragment_antiquity', name: 'Fragment of Antiquity', loc: 'West Colonnade Ruins' },
            { id: 'fragment_resonance', name: 'Fragment of Resonance', loc: 'East Cliff Overlook' },
            { id: 'fragment_eternity', name: 'Fragment of Eternity', loc: 'Deep Ruins Archway' }
          ].map((frag) => {
            const isGathered = items.some((i) => i.id === frag.id);
            return (
              <div
                key={frag.id}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '1rem',
                  padding: '0.85rem 1rem',
                  background: isGathered ? 'rgba(0, 217, 255, 0.1)' : 'rgba(255, 255, 255, 0.02)',
                  border: isGathered ? '1px solid var(--border-cyan)' : '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  opacity: isGathered ? 1 : 0.5
                }}
              >
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: 'var(--radius-xs)',
                    background: isGathered ? 'linear-gradient(135deg, #00D9FF, #168CFF)' : 'rgba(255, 255, 255, 0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#080B18',
                    flexShrink: 0
                  }}
                >
                  <Zap size={22} color={isGathered ? '#080B18' : 'var(--color-text-dim)'} />
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.92rem', color: '#FFFFFF' }}>
                      {frag.name}
                    </span>
                    <Badge variant={isGathered ? 'cyan' : 'neutral'} size="sm">
                      {isGathered ? 'Collected' : 'Missing'}
                    </Badge>
                  </div>
                  <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', margin: '0.35rem 0 0 0', lineHeight: 1.4 }}>
                    {isGathered ? `Secured from ${frag.loc}. Resonance calibrated.` : `Scattered in the ruins: search near ${frag.loc}.`}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div style={{ marginTop: '1.5rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)', textAlign: 'center', fontSize: '0.75rem', color: 'var(--color-text-dim)' }}>
          Press [I] or [ESC] to close inventory
        </div>
      </div>
    </div>
  );
}
