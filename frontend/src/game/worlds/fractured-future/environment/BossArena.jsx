import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import CollisionSystem from '../../../systems/CollisionSystem';

/**
 * World 3: The Chronarch Boss Arena
 * Position: [0, 2, -64]
 * Features:
 * - Colossal 28m diameter circular battle dais floating in the cosmic vortex
 * - 6 peripheral containment pylons channeling electric energy barriers
 * - Concentric runic floor patterns displaying telegraph combat zones
 * - Registered boundary colliders to enclose the encounter
 */
export default function BossArena() {
  const pylonBeamsRef = useRef([]);
  const arenaRingRef = useRef();

  useEffect(() => {
    // Register arena perimeter walls to prevent falling off during intense combat
    // Center is [0, 2, -64], radius ~14m
    CollisionSystem.registerCollider('boss_arena_south_exit', {
      min: [-3, 1, -50],
      max: [3, 6, -49]
    });
    CollisionSystem.registerCollider('boss_arena_north_edge', {
      min: [-15, 1, -79],
      max: [15, 6, -77]
    });
    CollisionSystem.registerCollider('boss_arena_east_edge', {
      min: [13.5, 1, -78],
      max: [15.5, 6, -50]
    });
    CollisionSystem.registerCollider('boss_arena_west_edge', {
      min: [-15.5, 1, -78],
      max: [-13.5, 6, -50]
    });

    return () => {
      CollisionSystem.unregisterCollider('boss_arena_south_exit');
      CollisionSystem.unregisterCollider('boss_arena_north_edge');
      CollisionSystem.unregisterCollider('boss_arena_east_edge');
      CollisionSystem.unregisterCollider('boss_arena_west_edge');
    };
  }, []);

  useFrame((state, delta) => {
    const time = state.clock.elapsedTime;
    if (arenaRingRef.current) {
      arenaRingRef.current.rotation.z += delta * 0.15;
    }
  });

  return (
    <group position={[0, 2, -64]}>
      {/* =========================================================================
          1. MAIN CIRCULAR BATTLE DAIS
      ========================================================================= */}
      {/* Heavy Subterranean Rock Inverted Cone */}
      <mesh position={[0, -7, 0]} castShadow receiveShadow>
        <coneGeometry args={[15, 14, 12]} />
        <meshStandardMaterial color="#080b18" roughness={0.9} metalness={0.2} />
      </mesh>

      {/* Main Battle Arena Floor */}
      <mesh position={[0, -0.2, 0]} receiveShadow>
        <cylinderGeometry args={[14, 14.5, 0.6, 32]} />
        <meshStandardMaterial color="#0d1429" roughness={0.35} metalness={0.8} />
      </mesh>

      {/* Outer Golden Containment Ring */}
      <mesh position={[0, 0.12, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[13.2, 13.8, 48]} />
        <meshStandardMaterial
          color="#F5B942"
          emissive="#D48800"
          emissiveIntensity={2.0}
        />
      </mesh>

      {/* Concentric Rotating Runic Matrix */}
      <mesh ref={arenaRingRef} position={[0, 0.14, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[8.5, 9.2, 32]} />
        <meshStandardMaterial
          color="#7047FF"
          emissive="#7047FF"
          emissiveIntensity={2.5}
        />
      </mesh>

      {/* Center Boss Focal Dais Inset */}
      <mesh position={[0, 0.16, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[4.2, 32]} />
        <meshStandardMaterial
          color="#121d38"
          emissive="#00D9FF"
          emissiveIntensity={0.6}
        />
      </mesh>

      {/* =========================================================================
          2. SIX HOVERING CONTAINMENT PYLONS AROUND ARENA PERIMETER
      ========================================================================= */}
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const angle = (i * Math.PI) / 3;
        const x = Math.sin(angle) * 13.5;
        const z = Math.cos(angle) * 13.5;
        return (
          <group key={i} position={[x, 3.5, z]} rotation={[0, angle, 0]}>
            {/* Pylon Main Body */}
            <mesh castShadow>
              <cylinderGeometry args={[0.5, 0.7, 7, 8]} />
              <meshStandardMaterial color="#0b1021" roughness={0.3} metalness={0.9} />
            </mesh>

            {/* Glowing Energy Core Inside Pylon */}
            <mesh position={[0, 0, 0]}>
              <cylinderGeometry args={[0.2, 0.2, 5.5, 8]} />
              <meshStandardMaterial
                color="#00D9FF"
                emissive="#7047FF"
                emissiveIntensity={3.5}
              />
            </mesh>

            {/* Top Focusing Prism */}
            <mesh position={[0, 4, 0]}>
              <octahedronGeometry args={[0.6, 0]} />
              <meshStandardMaterial
                color="#F5B942"
                emissive="#F5B942"
                emissiveIntensity={2.0}
              />
            </mesh>
          </group>
        );
      })}

      {/* Arena Dynamic Atmosphere Light */}
      <pointLight position={[0, 8, 0]} color="#7047FF" intensity={25} distance={35} />
    </group>
  );
}
