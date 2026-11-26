import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import GameState from '../../../engine/GameState';
import AudioSystem from '../../../systems/AudioSystem';

/**
 * Autonomous Security Hover Drone Hazard
 * Patrols across the highway with a scanning red detection spotlight.
 * Deals damage if the player steps into its active sensor radius.
 */
export default function SecurityDrone({
  startPos = [-4, 3.2, 8],
  endPos = [4, 3.2, 8],
  speed = 1.8
}) {
  const droneRef = useRef();
  const lastDamageTime = useRef(0);

  useFrame((state, delta) => {
    if (!droneRef.current) return;

    // Linear ping-pong patrol between startPos and endPos
    const t = (Math.sin(state.clock.elapsedTime * speed) + 1) / 2; // 0 to 1
    droneRef.current.position.x = startPos[0] + (endPos[0] - startPos[0]) * t;
    droneRef.current.position.y = startPos[1] + Math.sin(state.clock.elapsedTime * 4) * 0.15;
    droneRef.current.position.z = startPos[2];

    // Check proximity to player
    const playerPos = GameState.getState().player.position;
    const dronePos = droneRef.current.position;

    const dx = playerPos[0] - dronePos.x;
    const dz = playerPos[2] - dronePos.z;
    const dist = Math.sqrt(dx * dx + dz * dz);

    // If player steps under the drone spotlight (radius < 2.0)
    if (dist < 2.0 && playerPos[1] < 2.5) {
      const now = performance.now();
      if (now - lastDamageTime.current > 1200) {
        lastDamageTime.current = now;
        AudioSystem.playLanding(); // impact thud
        GameState.damagePlayer(15);
      }
    }
  });

  return (
    <group ref={droneRef} position={startPos}>
      {/* Central Drone Chassis */}
      <mesh castShadow>
        <boxGeometry args={[1.2, 0.4, 0.9]} />
        <meshStandardMaterial color="#0b101c" roughness={0.3} metalness={0.9} />
      </mesh>

      {/* Hover Rotor Pods (4 corners) */}
      {[
        [-0.7, 0.1, -0.5],
        [0.7, 0.1, -0.5],
        [-0.7, 0.1, 0.5],
        [0.7, 0.1, 0.5]
      ].map((offset, i) => (
        <group key={i} position={offset}>
          <mesh>
            <cylinderGeometry args={[0.22, 0.22, 0.08, 12]} />
            <meshStandardMaterial color="#1a253c" metalness={0.8} />
          </mesh>
          <mesh position={[0, -0.06, 0]}>
            <circleGeometry args={[0.18, 12]} />
            <meshBasicMaterial color="#00D9FF" />
          </mesh>
        </group>
      ))}

      {/* Red Scanning Sensor Eye */}
      <mesh position={[0, -0.15, 0.35]}>
        <sphereGeometry args={[0.15, 12, 12]} />
        <meshBasicMaterial color="#EF4444" />
      </mesh>

      {/* Downward Red Scanning Cone Light */}
      <spotLight
        color="#EF4444"
        intensity={25}
        distance={8}
        angle={0.45}
        penumbra={0.4}
        position={[0, -0.2, 0]}
        target-position={[0, -3.5, 0]}
      />
    </group>
  );
}
