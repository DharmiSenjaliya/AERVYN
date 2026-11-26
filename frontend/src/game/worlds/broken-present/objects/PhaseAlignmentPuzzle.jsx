import React, { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import GameState from '../../../engine/GameState';
import InteractionSystem from '../../../systems/InteractionSystem';
import AudioSystem from '../../../systems/AudioSystem';

/**
 * Phase Alignment Environmental Puzzle (Mission 5)
 * 3 Quantum Holographic Prisms that cycle phase states until locked in Zero-Point (Cyan).
 */
export default function PhaseAlignmentPuzzle({ position = [0, 0, -28] }) {
  const prism1Ref = useRef();
  const prism2Ref = useRef();
  const prism3Ref = useRef();

  // Phase index: 0 = Red-Shift (#EF4444), 1 = Purple-Shift (#7047FF), 2 = Zero-Point Cyan (#00D9FF)
  const [phases, setPhases] = useState([0, 1, 0]);
  const [solved, setSolved] = useState(false);

  const phaseColors = ['#EF4444', '#7047FF', '#00D9FF'];

  useEffect(() => {
    InteractionSystem.register('phase_puzzle', {
      position,
      radius: 3.2,
      promptText: solved ? 'Phase Matrix Stabilized' : 'Cycle Quantum Phase [E]',
      onInteract: () => {
        if (solved) return;

        AudioSystem.playPuzzleDial();

        setPhases((prev) => {
          const next = [(prev[0] + 1) % 3, (prev[1] + 1) % 3, (prev[2] + 2) % 3];
          const isNowSolved = next[0] === 2 && next[1] === 2 && next[2] === 2;

          if (isNowSolved) {
            setSolved(true);
            AudioSystem.playCollect();
            GameState.setState({
              objects: {
                ...GameState.getState().objects,
                phasePuzzleSolved: true
              }
            });
            // Advance to Mission 6: Repair the Time Core
            GameState.advanceStep(6);
            InteractionSystem.unregister('phase_puzzle');
          }

          return next;
        });
      }
    });

    return () => InteractionSystem.unregister('phase_puzzle');
  }, [position, solved]);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    if (prism1Ref.current) {
      prism1Ref.current.rotation.y += delta * 1.5;
      prism1Ref.current.position.y = 1.6 + Math.sin(t * 2) * 0.1;
    }
    if (prism2Ref.current) {
      prism2Ref.current.rotation.y -= delta * 1.8;
      prism2Ref.current.position.y = 1.6 + Math.sin(t * 2.5) * 0.1;
    }
    if (prism3Ref.current) {
      prism3Ref.current.rotation.y += delta * 2.0;
      prism3Ref.current.position.y = 1.6 + Math.sin(t * 1.8) * 0.1;
    }
  });

  return (
    <group position={position}>
      {/* Console Base Table */}
      <mesh position={[0, 0.6, 0]} castShadow receiveShadow>
        <boxGeometry args={[4.8, 1.2, 1.6]} />
        <meshStandardMaterial color="#0f172a" roughness={0.4} metalness={0.8} />
      </mesh>

      {/* Prism 1 */}
      <group position={[-1.4, 0, 0]}>
        <mesh ref={prism1Ref} castShadow>
          <octahedronGeometry args={[0.35, 0]} />
          <meshStandardMaterial
            color={phaseColors[phases[0]]}
            emissive={phaseColors[phases[0]]}
            emissiveIntensity={2.0}
            roughness={0.2}
            metalness={0.9}
          />
        </mesh>
      </group>

      {/* Prism 2 (Center) */}
      <group position={[0, 0, 0]}>
        <mesh ref={prism2Ref} castShadow>
          <octahedronGeometry args={[0.38, 0]} />
          <meshStandardMaterial
            color={phaseColors[phases[1]]}
            emissive={phaseColors[phases[1]]}
            emissiveIntensity={2.0}
            roughness={0.2}
            metalness={0.9}
          />
        </mesh>
      </group>

      {/* Prism 3 */}
      <group position={[1.4, 0, 0]}>
        <mesh ref={prism3Ref} castShadow>
          <octahedronGeometry args={[0.35, 0]} />
          <meshStandardMaterial
            color={phaseColors[phases[2]]}
            emissive={phaseColors[phases[2]]}
            emissiveIntensity={2.0}
            roughness={0.2}
            metalness={0.9}
          />
        </mesh>
      </group>

      {/* Ambient Console Glow */}
      <pointLight
        color={solved ? '#00D9FF' : '#7047FF'}
        intensity={solved ? 25 : 12}
        distance={8}
        position={[0, 2, 0]}
      />
    </group>
  );
}
