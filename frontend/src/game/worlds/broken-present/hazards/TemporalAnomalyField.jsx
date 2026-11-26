import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import GameState from '../../../engine/GameState';
import AudioSystem from '../../../systems/AudioSystem';

/**
 * Temporal Anomaly Hazard Field
 * Crackling ground distortion arc that damages players who venture inside without phasing.
 */
export default function TemporalAnomalyField({
  position = [-5, 0, -2],
  radius = 3.0
}) {
  const meshRef = useRef();
  const lastDamageTime = useRef(0);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.z += delta * 1.2;
    }

    const playerPos = GameState.getState().player.position;
    const dx = playerPos[0] - position[0];
    const dz = playerPos[2] - position[2];
    const dist = Math.sqrt(dx * dx + dz * dz);

    if (dist < radius && playerPos[1] < 1.0) {
      const now = performance.now();
      if (now - lastDamageTime.current > 1000) {
        lastDamageTime.current = now;
        AudioSystem.playInteract();
        GameState.damagePlayer(10);
      }
    }
  });

  return (
    <group position={position}>
      {/* Ground Crackling Disc */}
      <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
        <ringGeometry args={[0.5, radius, 32]} />
        <meshBasicMaterial
          color="#7047FF"
          transparent={true}
          opacity={0.65}
          side={THREE.DoubleSide}
        />
      </mesh>

      <pointLight color="#7047FF" intensity={18} distance={8} position={[0, 0.5, 0]} />
    </group>
  );
}
