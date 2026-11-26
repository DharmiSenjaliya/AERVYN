import React, { useRef } from 'react';
import { ArrowUp, Zap, Sparkles, Pause } from 'lucide-react';
import VirtualJoystick from './VirtualJoystick';
import InteractionSystem from '../systems/InteractionSystem';
import GameState from '../engine/GameState';

/**
 * Mobile Touch Controls Overlay
 * Virtual Joystick (left) + Action Buttons (right) + Touch Swipe Camera rotation
 */
export default function MobileControls({
  onMobileMove = () => {},
  onMobileStop = () => {},
  onJump = () => {},
  onSprintToggle = () => {},
  isSprinting = false
}) {
  const touchLookRef = useRef({ lastX: 0, lastY: 0, active: false });

  // Camera swipe look on center/right screen area
  const handleTouchLookStart = (e) => {
    if (e.target.closest('button') || e.target.closest('.joystick-container')) return;
    const touch = e.touches[0];
    touchLookRef.current = {
      lastX: touch.clientX,
      lastY: touch.clientY,
      active: true
    };
  };

  const handleTouchLookMove = (e) => {
    if (!touchLookRef.current.active) return;
    const touch = e.touches[0];
    const dx = touch.clientX - touchLookRef.current.lastX;
    const dy = touch.clientY - touchLookRef.current.lastY;
    touchLookRef.current.lastX = touch.clientX;
    touchLookRef.current.lastY = touch.clientY;

    // Dispatch touch look delta to camera
    window.dispatchEvent(
      new CustomEvent('aervyn:touch-camera', {
        detail: { dx: dx * 0.005, dy: dy * 0.005 }
      })
    );
  };

  const handleTouchLookEnd = () => {
    touchLookRef.current.active = false;
  };

  return (
    <div
      onTouchStart={handleTouchLookStart}
      onTouchMove={handleTouchLookMove}
      onTouchEnd={handleTouchLookEnd}
      onTouchCancel={handleTouchLookEnd}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 50,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '1.25rem',
        boxSizing: 'border-box'
      }}
    >
      {/* Top Right: Mobile Pause Button */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', pointerEvents: 'auto' }}>
        <button
          onClick={() => GameState.setScene('paused')}
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            background: 'rgba(22, 30, 53, 0.85)',
            border: '2px solid rgba(0, 217, 255, 0.5)',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 12px rgba(0, 217, 255, 0.35)'
          }}
          aria-label="Pause Game"
        >
          <Pause size={20} />
        </button>
      </div>

      {/* Bottom Controls Area */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          width: '100%'
        }}
      >
        {/* Left: Virtual Joystick */}
        <div className="joystick-container" style={{ pointerEvents: 'auto', marginBottom: '0.5rem' }}>
          <VirtualJoystick onMove={onMobileMove} onStop={onMobileStop} />
        </div>

        {/* Right: Action Buttons Cluster */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            alignItems: 'flex-end',
            pointerEvents: 'auto',
            marginBottom: '0.5rem'
          }}
        >
          {/* Interaction Button [E] */}
          <button
            onTouchStart={(e) => {
              e.stopPropagation();
              InteractionSystem.trigger();
            }}
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #F5B942 0%, #D48800 100%)',
              border: '2px solid #FFE082',
              color: '#080B18',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 15px rgba(245, 185, 66, 0.5)',
              fontWeight: 800,
              fontSize: '0.72rem'
            }}
          >
            <Sparkles size={18} />
            <span>ACT</span>
          </button>

          {/* Jump & Sprint Row */}
          <div style={{ display: 'flex', gap: '0.85rem' }}>
            {/* Sprint Toggle Button */}
            <button
              onTouchStart={(e) => {
                e.stopPropagation();
                onSprintToggle();
              }}
              style={{
                width: '52px',
                height: '52px',
                borderRadius: '50%',
                background: isSprinting
                  ? 'linear-gradient(135deg, #00D9FF, #168CFF)'
                  : 'rgba(22, 30, 53, 0.85)',
                border: '2px solid rgba(0, 217, 255, 0.4)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: isSprinting ? '0 0 15px rgba(0, 217, 255, 0.6)' : 'none'
              }}
            >
              <Zap size={20} color={isSprinting ? '#080B18' : '#00D9FF'} />
            </button>

            {/* Jump Button */}
            <button
              onTouchStart={(e) => {
                e.stopPropagation();
                onJump();
              }}
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #168CFF 0%, #0052CC 100%)',
                border: '2px solid rgba(0, 217, 255, 0.6)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 18px rgba(22, 140, 255, 0.6)'
              }}
            >
              <ArrowUp size={28} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
