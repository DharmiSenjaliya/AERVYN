import React from 'react';
import CastleRuins from './environment/CastleRuins';
import ForestTerrain from './environment/ForestTerrain';
import TimePortal from './environment/TimePortal';
import ChronoKeystone from './objects/ChronoKeystone';
import EnergyFragment from './objects/EnergyFragment';
import AncientDoor from './objects/AncientDoor';
import PuzzleMechanism from './objects/PuzzleMechanism';
import CheckpointStone from './objects/CheckpointStone';

/**
 * World 1: The Lost Kingdom - Full 3D Environment Assembler
 * Assembles castle ruins, forest mountains, interactive keystones, 3 energy fragments,
 * ancient gate, chrono puzzle, and time portal.
 */
export default function LostKingdom() {
  return (
    <group>
      {/* 1. Static Architecture & Terrain */}
      <CastleRuins />
      <ForestTerrain />

      {/* 2. Step 3 & 4: Chrono Keystone Pedestal */}
      <ChronoKeystone position={[0, 0, 0]} />

      {/* 3. Steps 5 & 6: Three Temporal Energy Fragments */}
      {/* Fragment 1: West Colonnade Ruins */}
      <EnergyFragment
        id="fragment_antiquity"
        name="Fragment of Antiquity"
        position={[-8, 1.2, 3]}
      />

      {/* Fragment 2: East Cliff Overlook */}
      <EnergyFragment
        id="fragment_resonance"
        name="Fragment of Resonance"
        position={[9, 1.2, -3]}
      />

      {/* Fragment 3: Deep Ruins Archway */}
      <EnergyFragment
        id="fragment_eternity"
        name="Fragment of Eternity"
        position={[-4, 1.2, -12]}
      />

      {/* 4. Checkpoint Obelisk */}
      <CheckpointStone
        id="courtyard_midpoint"
        name="Courtyard Nexus"
        position={[0, 0, -8]}
      />

      {/* 5. Step 7: Ancient Stone Gate */}
      <AncientDoor position={[0, 0, -18]} />

      {/* 6. Step 8: Chrono Alignment Mechanism Puzzle */}
      <PuzzleMechanism position={[0, 0, -24]} />

      {/* 7. Steps 9 & 10: Central Time Portal */}
      <TimePortal position={[0, 5, -31]} />
    </group>
  );
}
