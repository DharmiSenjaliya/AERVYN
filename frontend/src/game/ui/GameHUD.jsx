import React, { useState, useEffect } from 'react';
import {
  Heart,
  Zap,
  Clock,
  Sparkles,
  Pause,
  Volume2,
  VolumeX,
  Backpack,
  Compass
} from 'lucide-react';
import GameState from '../engine/GameState';
import AudioSystem from '../systems/AudioSystem';
import Badge from '../../components/common/Badge';
import InventoryModal from './InventoryModal';

/**
 * Enhanced In-Game Cinematic HUD Overlay
 * Displays vitals, active 10-step objectives, interaction prompt pill,
 * inventory modal trigger, audio toggle, and collectibles status.
 */
export default function GameHUD({ onPause = () => {}, isMobile = false }) {
  const [hudState, setHudState] = useState(GameState.getState());
  const [muted, setMuted] = useState(false);
  const [inventoryOpen, setInventoryOpen] = useState(false);

  useEffect(() => {
    const unsub = GameState.subscribe((state) => {
      setHudState({ ...state });
    });

    const handleToggleInventory = () => {
      setInventoryOpen((prev) => !prev);
    };

    window.addEventListener('aervyn:toggle-inventory', handleToggleInventory);

    return () => {
      unsub();
      window.removeEventListener('aervyn:toggle-inventory', handleToggleInventory);
    };
  }, []);

  const { player, mission, inventory, interactionPrompt, worldName, worldId } = hudState;
  const isWorld2 = worldId === 'world_2';
  const fragments = inventory?.fragmentsCollected || 0;
  const cores = inventory?.coresCollected || 0;
  const hasKeystone = inventory?.hasKeystone || false;
  const hasDecrypter = inventory?.hasDecrypter || mission?.currentStep > 1;

  return (
    <>
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 20,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: isMobile ? '0.75rem' : '1.5rem',
          boxSizing: 'border-box'
        }}
      >
        {/* 1. TOP BAR */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', pointerEvents: 'auto' }}>
          {/* Vitals (Health & Chrono Energy) */}
          <div
            className="glass-panel"
            style={{
              padding: '0.65rem 1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.4rem',
              minWidth: isMobile ? '160px' : '200px'
            }}
          >
            {/* Health */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: '#FFFFFF', marginBottom: '2px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Heart size={11} color="#EF4444" fill="#EF4444" />
                  VITALS
                </span>
                <span>{player.health}%</span>
              </div>
              <div style={{ width: '100%', height: '5px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                <div
                  style={{
                    width: `${player.health}%`,
                    height: '100%',
                    background: 'linear-gradient(90deg, #EF4444, #F87171)'
                  }}
                />
              </div>
            </div>

            {/* Chrono Energy */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: '#FFFFFF', marginBottom: '2px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Zap size={11} color="#00D9FF" fill="#00D9FF" />
                  CHRONO POWER
                </span>
                <span>{player.chronoEnergy}%</span>
              </div>
              <div style={{ width: '100%', height: '5px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                <div
                  style={{
                    width: `${player.chronoEnergy}%`,
                    height: '100%',
                    background: 'linear-gradient(90deg, #168CFF, #00D9FF)'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Current Timeline World Name */}
          <div className="glass-panel hide-mobile" style={{ padding: '0.4rem 1rem' }}>
            <Badge variant="cyan" size="sm" pulse={true}>
              {worldName}
            </Badge>
          </div>

          {/* Top Right Controls: Inventory, Audio & Pause */}
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {/* Inventory Button */}
            <button
              onClick={() => {
                AudioSystem.playInteract();
                setInventoryOpen(!inventoryOpen);
              }}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'rgba(22, 30, 53, 0.85)',
                border: '1px solid var(--border-cyan)',
                color: '#00D9FF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
              aria-label="Open Inventory [I]"
              title="Inventory [I]"
            >
              <Backpack size={16} />
            </button>

            {/* Audio Toggle */}
            <button
              onClick={() => {
                AudioSystem.playInteract();
                const nextMuted = !muted;
                setMuted(nextMuted);
                AudioSystem.setMuted(nextMuted);
              }}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'rgba(22, 30, 53, 0.85)',
                border: '1px solid var(--border-subtle)',
                color: muted ? 'var(--color-text-muted)' : 'var(--color-cyan)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
              aria-label="Toggle Audio"
            >
              {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>

            {/* Pause Button */}
            <button
              onClick={onPause}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'rgba(22, 30, 53, 0.85)',
                border: '1px solid var(--border-cyan)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 0 10px rgba(0, 217, 255, 0.3)'
              }}
              aria-label="Pause [ESC]"
            >
              <Pause size={16} />
            </button>
          </div>
        </div>

        {/* 2. CENTER INTERACTION PROMPT PILL */}
        {interactionPrompt && (
          <div
            style={{
              alignSelf: 'center',
              marginBottom: '1rem',
              animation: 'portalPulse 2s infinite ease-in-out',
              pointerEvents: 'auto'
            }}
          >
            <div
              className="glass-panel-glow"
              style={{
                padding: '0.65rem 1.4rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                borderRadius: 'var(--radius-full)',
                border: '1px solid var(--border-cyan)',
                background: 'rgba(8, 11, 24, 0.92)'
              }}
            >
              <div
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: 'var(--color-gold)',
                  color: '#080B18',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '0.75rem'
                }}
              >
                E
              </div>
              <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#FFFFFF', letterSpacing: '0.02em' }}>
                {interactionPrompt.text}
              </span>
            </div>
          </div>
        )}

        {/* 3. BOTTOM BAR */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', pointerEvents: 'auto' }}>
          {/* Active Mission Objective Card */}
          <div
            className="glass-panel"
            style={{
              padding: '0.75rem 1.15rem',
              maxWidth: isMobile ? '240px' : '360px',
              borderLeft: '4px solid var(--color-cyan)',
              background: 'rgba(8, 11, 24, 0.85)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--color-gold)', fontWeight: 700, textTransform: 'uppercase' }}>
                Step {mission.currentStep} of {mission.totalSteps}
              </span>
              <span style={{ fontSize: '0.68rem', color: 'var(--color-text-dim)' }}>
                {mission.title}
              </span>
            </div>
            <p style={{ fontSize: '0.82rem', color: '#FFFFFF', lineHeight: 1.4, margin: 0 }}>
              {mission.currentObjective}
            </p>
          </div>

          {/* Collectibles Tracker (Fragments & Keystone for World 1, Cores & Decrypter for World 2) */}
          <div
            className="glass-panel"
            style={{
              padding: '0.6rem 1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              background: 'rgba(8, 11, 24, 0.85)',
              cursor: 'pointer'
            }}
            onClick={() => setInventoryOpen(true)}
            title="Click to view Inventory [I]"
          >
            {isWorld2 ? (
              <>
                {/* City Terminal Decrypter Badge */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', opacity: hasDecrypter ? 1 : 0.4 }}>
                  <Sparkles size={16} color={hasDecrypter ? '#00D9FF' : 'var(--color-text-dim)'} />
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: hasDecrypter ? '#FFFFFF' : 'var(--color-text-dim)' }}>
                    Decrypter
                  </span>
                </div>

                {/* Quantum Cores Counter */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Zap size={16} color={cores >= 3 ? 'var(--color-success)' : '#C084FC'} />
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#FFFFFF' }}>
                    Quantum Cores: {cores} / 3
                  </span>
                </div>
              </>
            ) : (
              <>
                {/* Keystone Badge */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', opacity: hasKeystone ? 1 : 0.4 }}>
                  <Sparkles size={16} color={hasKeystone ? '#F5B942' : 'var(--color-text-dim)'} />
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: hasKeystone ? '#FFFFFF' : 'var(--color-text-dim)' }}>
                    Keystone
                  </span>
                </div>

                {/* Fragments Counter */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Zap size={16} color={fragments >= 3 ? 'var(--color-success)' : 'var(--color-cyan)'} />
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#FFFFFF' }}>
                    Fragments: {fragments} / 3
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Inventory Modal Overlay */}
      <InventoryModal isOpen={inventoryOpen} onClose={() => setInventoryOpen(false)} />
    </>
  );
}
