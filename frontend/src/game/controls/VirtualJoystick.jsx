import React, { useRef, useState, useEffect } from 'react';

/**
 * Mobile Virtual Joystick
 * Smooth touch vector calculation for 360-degree locomotion
 */
export default function VirtualJoystick({ onMove = () => {}, onStop = () => {} }) {
  const containerRef = useRef(null);
  const [knobPos, setKnobPos] = useState({ x: 0, y: 0 });
  const [touching, setTouching] = useState(false);
  const radius = 45; // Max radius in pixels

  const handleTouchStart = (e) => {
    setTouching(true);
    handleTouchMove(e);
  };

  const handleTouchMove = (e) => {
    if (!containerRef.current) return;
    const touch = e.touches[0];
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dx = touch.clientX - centerX;
    const dy = touch.clientY - centerY;
    const distance = Math.min(radius, Math.sqrt(dx * dx + dy * dy));
    const angle = Math.atan2(dy, dx);

    const clampedX = Math.cos(angle) * distance;
    const clampedY = Math.sin(angle) * distance;

    setKnobPos({ x: clampedX, y: clampedY });

    // Normalized vector (-1 to 1)
    onMove({
      x: clampedX / radius,
      y: -clampedY / radius // invert Y so up is positive forward
    });
  };

  const handleTouchEnd = () => {
    setTouching(false);
    setKnobPos({ x: 0, y: 0 });
    onStop();
  };

  return (
    <div
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
      style={{
        width: '120px',
        height: '120px',
        borderRadius: '50%',
        backgroundColor: 'rgba(22, 30, 53, 0.65)',
        backdropFilter: 'blur(8px)',
        border: '2px solid rgba(0, 217, 255, 0.4)',
        boxShadow: '0 0 15px rgba(0, 217, 255, 0.25)',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        touchAction: 'none',
        pointerEvents: 'auto',
        userSelect: 'none'
      }}
    >
      {/* Center Fixed Crosshair */}
      <div
        style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: 'rgba(255, 255, 255, 0.3)',
          position: 'absolute'
        }}
      />

      {/* Moving Thumb Knob */}
      <div
        style={{
          width: '52px',
          height: '52px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #00D9FF 0%, #168CFF 100%)',
          boxShadow: '0 0 12px rgba(0, 217, 255, 0.6)',
          transform: `translate(${knobPos.x}px, ${knobPos.y}px)`,
          transition: touching ? 'none' : 'transform 0.15s ease-out',
          pointerEvents: 'none'
        }}
      />
    </div>
  );
}
