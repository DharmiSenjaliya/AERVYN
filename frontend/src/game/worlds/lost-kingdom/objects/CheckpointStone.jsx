import React, { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import GameState from '../../../engine/GameState';
import SaveSystem from '../../../systems/SaveSystem';
import AudioSystem from '../../../systems/AudioSystem';

/**
 * Checkpoint Obelisk
 * Automatic spatial trigger that saves checkpoint progress to Laravel backend and local storage.
 */
export default function CheckpointStone({
  id = 'courtyard_midpoint',
  name = 'Courtyard Nexus',
  position = [0, 0, -8]
}) {
  const [activated, setActivated] = useState(false);
  const runeRef = useRef();

  useEffect(() => {
    // If this is already the active checkpoint in GameState
    if (GameState.getState().checkpoint.id === id) {
      setActivated(true);
    }
  }, [id]);

  useFrame(() => {
    if (activated) return;

    const playerPos = GameState.getState().player.position;
    const dx = playerPos[0] - position[0];
    const dz = playerPos[2] - position[2];
    const dist = Math.sqrt(dx * dx + dz * dz);

    if (dist < 3.0 && !activated) {
      setActivated(true);
      AudioSystem.playCollect();
      SaveSystem.recordCheckpoint(id, name, position);
    }
  });

  useFrame((state, delta) => {
    if (runeRef.current) {
      const pulse = 1.0 + Math.sin(state.clock.elapsedTime * 3) * 0.4;
      runeRef.current.material.emissiveIntensity = activated ? 2.5 : pulse;
    }
  });

  return (
    <group position={position}>
      {/* Stone Obelisk Body */}
      <mesh position={[0, 2.2, 0]} castShadow>
        <cylinderGeometry args={[0.35, 0.65, 4.4, 4]} />
        <meshStandardMaterial color="#1a253c" roughness={0.7} />
      </mesh>

      {/* Runic Carvings Glow */}
      <mesh ref={runeRef} position={[0, 2.8, 0.36]}>
        <planeGeometry args={[0.35, 1.2]} />
        <meshStandardMaterial
          color={activated ? '#10B981' : '#00D9FF'}
          emissive={activated ? '#10B981' : '#00D9FF'}
          emissiveIntensity={1.5}
        />
      </mesh>

      <pointLight
        color={activated ? '#10B981' : '#00D9FF'}
        intensity={activated ? 15 : 6}
        distance={8}
        position={[0, 3, 0]}
      />
    </group>
  );
}
