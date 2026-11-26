import React from 'react';
import DestroyedCity from './environment/DestroyedCity';
import UndergroundLab from './environment/UndergroundLab';
import TimeAnomalyZone from './environment/TimeAnomalyZone';
import CityTerminal from './objects/CityTerminal';
import CommRelay from './objects/CommRelay';
import QuantumEnergyCore from './objects/QuantumEnergyCore';
import LabBulkhead from './objects/LabBulkhead';
import PhaseAlignmentPuzzle from './objects/PhaseAlignmentPuzzle';
import CentralTimeCore from './objects/CentralTimeCore';
import TimelineGateway from './objects/TimelineGateway';
import SecurityDrone from './hazards/SecurityDrone';
import TemporalAnomalyField from './hazards/TemporalAnomalyField';
import CheckpointStone from '../lost-kingdom/objects/CheckpointStone';

/**
 * World 2: The Broken Present - Master 3D Environment Assembler
 * Assembles destroyed futuristic metropolis, underground laboratory, time distortion zones,
 * 7-mission story progression, security drone hazards, and the Central Time Core.
 */
export default function BrokenPresent() {
  return (
    <group>
      {/* 1. Environment & Architecture */}
      <DestroyedCity />
      <UndergroundLab position={[0, 0, -28]} />
      <TimeAnomalyZone position={[0, 0, -10]} />

      {/* 2. Mission 1: City Access Terminal */}
      <CityTerminal position={[0, 0, 7]} />

      {/* 3. Mission 2: Lost Signal Comm Relay Station */}
      <CommRelay position={[-12, 0, -4]} />

      {/* 4. Mission 3: 3 Quantum Energy Cores */}
      {/* Core 1: Alpha Core on Ruined Highway */}
      <QuantumEnergyCore
        id="core_alpha"
        name="Alpha Quantum Core"
        position={[12, 1.2, 2]}
      />

      {/* Core 2: Beta Core in Research Annex */}
      <QuantumEnergyCore
        id="core_beta"
        name="Beta Quantum Core"
        position={[-8, 1.2, -14]}
      />

      {/* Core 3: Gamma Core on Elevated Platform */}
      <QuantumEnergyCore
        id="core_gamma"
        name="Gamma Quantum Core"
        position={[10, 2.0, -12]}
      />

      {/* 5. Highway Checkpoint Nexus */}
      <CheckpointStone
        id="highway_checkpoint"
        name="Highway Checkpoint Nexus"
        position={[0, 0, 4]}
      />

      {/* 6. Mission 4: Underground Lab Armored Bulkhead */}
      <LabBulkhead position={[0, 0, -20]} />

      {/* 7. Mission 5: Phase Alignment Environmental Puzzle */}
      <PhaseAlignmentPuzzle position={[0, 0, -28]} />

      {/* 8. Mission 6: Central Time Core Reactor */}
      <CentralTimeCore position={[0, 4.5, -36]} />

      {/* 9. Mission 7: Stabilized Timeline Gateway Portal */}
      <TimelineGateway position={[0, 4.5, -42]} />

      {/* 10. Environmental Threats & Hazards */}
      {/* Patrol Drone on Highway */}
      <SecurityDrone startPos={[-4, 3.2, 8]} endPos={[4, 3.2, 8]} speed={1.6} />

      {/* Temporal Anomaly Electric Field */}
      <TemporalAnomalyField position={[-5, 0, -2]} radius={2.8} />
    </group>
  );
}
