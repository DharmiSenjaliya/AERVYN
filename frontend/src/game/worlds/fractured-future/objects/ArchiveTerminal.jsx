import React, { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import GameState from '../../../systems/../engine/GameState';
import InteractionSystem from '../../../systems/InteractionSystem';
import AudioSystem from '../../../systems/AudioSystem';

/**
 * World 3: Master Chrono Archive Terminal (Mission 5 Story Reveal)
 * Position: [0, 2, -44]
 * Reveals the Chronarch's origin, unlocks the boss arena, and records pre-boss checkpoint.
 */
export default function ArchiveTerminal() {
  const holoCylinderRef = useRef();
  const [accessed, setAccessed] = useState(
    GameState.getState().objects.archiveTerminalAccessed
  );

  useEffect(() => {
    const unsub = GameState.subscribe((state) => {
      setAccessed(state.objects.archiveTerminalAccessed);
    });

    InteractionSystem.registerInteractiveObject('chrono_archive_terminal', {
      position: [0, 2, -44],
      radius: 3.2,
      promptText: 'Access Master Chrono Archive [E]',
      onInteract: () => {
        if (!GameState.getState().objects.archiveTerminalAccessed) {
          AudioSystem.playInteract();
          GameState.setState({
            objects: {
              ...GameState.getState().objects,
              archiveTerminalAccessed: true,
              bossArenaUnlocked: true
            }
          });
          GameState.setCheckpoint('checkpoint_chronarch_arena', 'Boss Arena Gate', [0, 2, -48]);
          GameState.setBossActive(true);
          GameState.advanceStep(6);
        }
      }
    });

    return () => {
      unsub();
      InteractionSystem.unregisterInteractiveObject('chrono_archive_terminal');
    };
  }, []);

  useFrame((state, delta) => {
    if (holoCylinderRef.current) {
      holoCylinderRef.current.rotation.y += delta * 0.8;
      holoCylinderRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 1.5) * 0.1;
    }
  });

  return (
    <group position={[0, 2, -44]}>
      {/* Central Cylindrical Console Stand */}
      <mesh position={[0, 0.45, 0]} castShadow>
        <cylinderGeometry args={[0.9, 1.1, 0.9, 16]} />
        <meshStandardMaterial color="#0c1326" roughness={0.3} metalness={0.8} />
      </mesh>

      {/* Runic Glow Ring on Base */}
      <mesh position={[0, 0.92, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.7, 0.85, 24]} />
        <meshStandardMaterial
          color={accessed ? '#F5B942' : '#C084FC'}
          emissive={accessed ? '#D48800' : '#7047FF'}
          emissiveIntensity={2.5}
        />
      </mesh>

      {/* Floating Holographic Timeline Archive Sphere/Cylinder */}
      <group ref={holoCylinderRef} position={[0, 1.8, 0]}>
        <mesh>
          <torusGeometry args={[0.75, 0.03, 8, 32]} />
          <meshStandardMaterial
            color="#00D9FF"
            emissive="#00D9FF"
            emissiveIntensity={3.0}
          />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.45, 0.45, 0.7, 16, 1, true]} />
          <meshBasicMaterial
            color="#C084FC"
            transparent
            opacity={0.45}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>

      {/* Interior Archive Light Glow */}
      <pointLight
        position={[0, 1.8, 0]}
        color={accessed ? '#F5B942' : '#C084FC'}
        intensity={14}
        distance={8}
      />
    </group>
  );
}
