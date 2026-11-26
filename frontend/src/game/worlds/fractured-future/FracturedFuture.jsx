import React from 'react';
import FloatingIslands from './environment/FloatingIslands';
import TimeStorm from './environment/TimeStorm';
import TimeLabyrinth from './environment/TimeLabyrinth';
import ResearchSpire from './environment/ResearchSpire';
import BossArena from './environment/BossArena';
import ChronoBeacon from './objects/ChronoBeacon';
import PhaseBridgeTerminal from './objects/PhaseBridgeTerminal';
import ChronoShard from './objects/ChronoShard';
import LabyrinthSwitch from './objects/LabyrinthSwitch';
import ArchiveTerminal from './objects/ArchiveTerminal';
import TimelineEngine from './objects/TimelineEngine';
import ChronarchBoss from './boss/ChronarchBoss';

/**
 * World 3: The Fractured Future — Master 3D Assembler
 * Integrates floating celestial islands, atmospheric storm, 7 mission objectives, and the Chronarch boss encounter.
 */
export default function FracturedFuture({ playerRef }) {
  return (
    <group>
      {/* 1. Atmospheric Time Storm & Sky Nebula */}
      <TimeStorm />

      {/* 2. Floating Celestial Islands & Skywalk Bridges */}
      <FloatingIslands />

      {/* 3. Mission 1: Arrival at the End of Time — Chrono Beacon */}
      <ChronoBeacon />

      {/* 4. Mission 2: The Fallen Sky City — Phase Bridge Terminal */}
      <PhaseBridgeTerminal />

      {/* 5. Mission 3: The Three Chrono Shards */}
      {/* A. Genesis Shard (West Overlook Island) */}
      <ChronoShard
        id="shard_genesis"
        name="Chrono Shard of Genesis"
        position={[16, 5, 12]}
        color="#F5B942"
        emissive="#D48800"
      />
      {/* B. Flux Shard (East Anomaly Island) */}
      <ChronoShard
        id="shard_flux"
        name="Chrono Shard of Flux"
        position={[-18, 4, -14]}
        color="#C084FC"
        emissive="#7047FF"
      />
      {/* C. Singularity Shard (Deep Bastion Island) */}
      <ChronoShard
        id="shard_singularity"
        name="Chrono Shard of Singularity"
        position={[16, 3, -18]}
        color="#00D9FF"
        emissive="#00D9FF"
      />

      {/* 6. Mission 4: The Time Labyrinth Structure & 3 Switches */}
      <TimeLabyrinth />
      <LabyrinthSwitch
        switchKey="alpha"
        label="Resonator Switch Alpha"
        position={[-8, 2, -26]}
        color="#F5B942"
      />
      <LabyrinthSwitch
        switchKey="beta"
        label="Resonator Switch Beta"
        position={[8, 2, -26]}
        color="#00D9FF"
      />
      <LabyrinthSwitch
        switchKey="gamma"
        label="Resonator Switch Gamma"
        position={[0, 2, -35]}
        color="#C084FC"
      />

      {/* 7. Mission 5: Central Research Spire & Archive Terminal */}
      <ResearchSpire />
      <ArchiveTerminal />

      {/* 8. Mission 6: The Final Confrontation — Arena & The Chronarch Boss */}
      <BossArena />
      <ChronarchBoss playerRef={playerRef} />

      {/* 9. Mission 7: The Fractured Future — Master Timeline Engine Dais */}
      <TimelineEngine />
    </group>
  );
}
