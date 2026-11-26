import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import GameState from '../../../systems/../engine/GameState';
import CollisionSystem from '../../../systems/CollisionSystem';

/**
 * World 3: The Time Labyrinth (Mission 4 Puzzle Area)
 * Features:
 * - Floating stone and metallic maze platforms from z = -22 to z = -36
 * - Central moving energy bridge that glides between switch stations
 * - Sealed Energy Barrier Forcefield guarding entrance to Research Spire
 * - Reactive forcefield that dissolves once all 3 Labyrinth Switches are aligned
 */
export default function TimeLabyrinth() {
  const movingPlatformRef = useRef();
  const forcefieldRef = useRef();
  const [labyrinthSolved, setLabyrinthSolved] = React.useState(
    GameState.getState().objects.labyrinthSolved
  );

  useEffect(() => {
    const unsub = GameState.subscribe((state) => {
      setLabyrinthSolved(state.objects.labyrinthSolved);
    });

    // Register forcefield collider initially if not yet solved
    if (!GameState.getState().objects.labyrinthSolved) {
      CollisionSystem.registerCollider('labyrinth_forcefield_door', {
        min: [-4, 0, -38.5],
        max: [4, 8, -37.5]
      });
    }

    return () => {
      unsub();
      CollisionSystem.unregisterCollider('labyrinth_forcefield_door');
    };
  }, []);

  useEffect(() => {
    if (labyrinthSolved) {
      CollisionSystem.unregisterCollider('labyrinth_forcefield_door');
    }
  }, [labyrinthSolved]);

  useFrame((state) => {
    const time = state.clock.elapsedTime;

    // Animate moving energy platform across the chasm
    if (movingPlatformRef.current) {
      movingPlatformRef.current.position.x = Math.sin(time * 0.9) * 4.5;
    }

    // Forcefield pulse
    if (forcefieldRef.current && !labyrinthSolved) {
      forcefieldRef.current.material.opacity = 0.55 + Math.sin(time * 4) * 0.2;
    }
  });

  return (
    <group position={[0, 2, -28]}>
      {/* =========================================================================
          1. LABYRINTH ENTRY PROMENADE & CENTRAL PEDESTAL
      ========================================================================= */}
      {/* Central Maze Hub Platform */}
      <mesh position={[0, -0.2, 0]} receiveShadow>
        <boxGeometry args={[8, 0.4, 8]} />
        <meshStandardMaterial color="#111933" roughness={0.4} metalness={0.7} />
      </mesh>

      {/* Hexagonal Maze Floor Circuit Inset */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.5, 3.2, 6]} />
        <meshStandardMaterial
          color={labyrinthSolved ? '#00D9FF' : '#7047FF'}
          emissive={labyrinthSolved ? '#00D9FF' : '#7047FF'}
          emissiveIntensity={2.0}
        />
      </mesh>

      {/* =========================================================================
          2. LEFT WING (SWITCH ALPHA PLATFORM) [x = -8, z = 2]
      ========================================================================= */}
      <group position={[-8, 0, 2]}>
        <mesh position={[0, -0.2, 0]} receiveShadow>
          <cylinderGeometry args={[3, 3, 0.4, 6]} />
          <meshStandardMaterial color="#0e162a" roughness={0.4} metalness={0.7} />
        </mesh>
        <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[2.2, 2.6, 6]} />
          <meshStandardMaterial color="#F5B942" emissive="#F5B942" emissiveIntensity={1.5} />
        </mesh>
      </group>

      {/* Fixed Bridge to Left Wing */}
      <mesh position={[-4, -0.2, 1]} rotation={[0, 0.25, 0]} receiveShadow>
        <boxGeometry args={[3.5, 0.35, 1.8]} />
        <meshStandardMaterial color="#131e38" roughness={0.5} metalness={0.6} />
      </mesh>

      {/* =========================================================================
          3. RIGHT WING (SWITCH BETA PLATFORM) [x = 8, z = 2]
      ========================================================================= */}
      <group position={[8, 0, 2]}>
        <mesh position={[0, -0.2, 0]} receiveShadow>
          <cylinderGeometry args={[3, 3, 0.4, 6]} />
          <meshStandardMaterial color="#0e162a" roughness={0.4} metalness={0.7} />
        </mesh>
        <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[2.2, 2.6, 6]} />
          <meshStandardMaterial color="#00D9FF" emissive="#00D9FF" emissiveIntensity={1.5} />
        </mesh>
      </group>

      {/* Fixed Bridge to Right Wing */}
      <mesh position={[4, -0.2, 1]} rotation={[0, -0.25, 0]} receiveShadow>
        <boxGeometry args={[3.5, 0.35, 1.8]} />
        <meshStandardMaterial color="#131e38" roughness={0.5} metalness={0.6} />
      </mesh>

      {/* =========================================================================
          4. NORTH WING (SWITCH GAMMA PLATFORM) [x = 0, z = -7]
      ========================================================================= */}
      <group position={[0, 0, -7]}>
        <mesh position={[0, -0.2, 0]} receiveShadow>
          <cylinderGeometry args={[3.2, 3.2, 0.4, 6]} />
          <meshStandardMaterial color="#0e162a" roughness={0.4} metalness={0.7} />
        </mesh>
        <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[2.4, 2.8, 6]} />
          <meshStandardMaterial color="#C084FC" emissive="#7047FF" emissiveIntensity={2.0} />
        </mesh>
      </group>

      {/* Moving Dynamic Energy Bridge linking center to north wing */}
      <mesh ref={movingPlatformRef} position={[0, -0.15, -3.5]} receiveShadow>
        <boxGeometry args={[2.4, 0.3, 2.8]} />
        <meshStandardMaterial
          color="#162242"
          emissive="#00D9FF"
          emissiveIntensity={0.6}
          roughness={0.3}
          metalness={0.8}
        />
      </mesh>

      {/* =========================================================================
          5. SPIRE BARRIER FORCEFIELD GATEWAY (z = -10 relative to group)
      ========================================================================= */}
      <group position={[0, 0, -10]}>
        {/* Gateway Flanking Monoliths */}
        {[-3, 3].map((x, i) => (
          <mesh key={i} position={[x, 3, 0]} castShadow>
            <boxGeometry args={[1.2, 6, 1.2]} />
            <meshStandardMaterial color="#0c1224" roughness={0.3} metalness={0.8} />
          </mesh>
        ))}

        {/* Overhead Lintel Beam */}
        <mesh position={[0, 5.5, 0]} castShadow>
          <boxGeometry args={[6.5, 1, 1.2]} />
          <meshStandardMaterial color="#0c1224" roughness={0.3} metalness={0.8} />
        </mesh>

        {/* Reactive Forcefield Membrane (Dissolves when solved) */}
        {!labyrinthSolved && (
          <mesh ref={forcefieldRef} position={[0, 2.5, 0]}>
            <planeGeometry args={[4.8, 5]} />
            <meshBasicMaterial
              color="#7047FF"
              transparent
              opacity={0.65}
              side={THREE.DoubleSide}
            />
          </mesh>
        )}
      </group>
    </group>
  );
}
