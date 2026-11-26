import React from 'react';
import ZeroHorizon from './environment/ZeroHorizon';
import SynchronizationMatrix from './objects/SynchronizationMatrix';
import PrimordialCore from './objects/PrimordialCore';

/**
 * World 4: The Last Timeline (The Zero Horizon) — Master 3D Assembler
 * Transcendent celestial sanctuary outside linear time.
 * Integrates the Zero Horizon environmental nexus, Continuum Synchronization Matrix,
 * and the Primordial Chrono Core.
 */
export default function LastTimeline({ playerRef }) {
  return (
    <group>
      {/* 1. Transcendent Celestial Sanctuary Environment */}
      <ZeroHorizon />

      {/* 2. Step 2: Continuum Synchronization Matrix Puzzle */}
      <SynchronizationMatrix />

      {/* 3. Step 3 & 4: Primordial Chrono Core & The Nexus Decision */}
      <PrimordialCore />
    </group>
  );
}
