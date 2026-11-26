import React, { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import GameState from '../../../engine/GameState';
import InteractionSystem from '../../../systems/InteractionSystem';
import AudioSystem from '../../../systems/AudioSystem';

/**
 * Chrono Alignment Mechanism (Interactive Environmental Puzzle)
 * Step 8 in the 10-step sequence
 * Aligns 3 concentric dials to 0 degrees to channel energy to the Time Portal.
 */
export default function PuzzleMechanism({ position = [0, 0, -24] }) {
  const dial1Ref = useRef();
  const dial2Ref = useRef();
  const dial3Ref = useRef();

  const [dials, setDials] = useState([90, 180, 270]);
  const [solved, setSolved] = useState(false);

  useEffect(() => {
    InteractionSystem.register('puzzle_console', {
      position,
      radius: 3.0,
      promptText: solved ? 'Chrono Mechanism Aligned' : 'Rotate Chrono Dial [E]',
      onInteract: () => {
        if (solved) return;

        AudioSystem.playPuzzleDial();

        setDials((prev) => {
          // Rotate dials toward 0
          const d1 = (prev[0] + 90) % 360;
          const d2 = (prev[1] + 90) % 360;
          const d3 = (prev[2] + 90) % 360;

          const isNowSolved = d1 === 0 && d2 === 0 && d3 === 0;

          if (isNowSolved) {
            setSolved(true);
            AudioSystem.playCollect();
            GameState.setState({
              objects: {
                ...GameState.getState().objects,
                puzzleSolved: true,
                puzzleDials: [0, 0, 0]
              }
            });
            // Advance mission to Step 9: Activate Time Portal
            GameState.advanceStep(9);
            InteractionSystem.unregister('puzzle_console');
          }

          return [d1, d2, d3];
        });
      }
    });

    return () => InteractionSystem.unregister('puzzle_console');
  }, [position, solved]);

  useFrame((_, delta) => {
    if (dial1Ref.current) {
      dial1Ref.current.rotation.z += (THREE_degToRad(dials[0]) - dial1Ref.current.rotation.z) * 10 * delta;
    }
    if (dial2Ref.current) {
      dial2Ref.current.rotation.z += (THREE_degToRad(dials[1]) - dial2Ref.current.rotation.z) * 10 * delta;
    }
    if (dial3Ref.current) {
      dial3Ref.current.rotation.z += (THREE_degToRad(dials[2]) - dial3Ref.current.rotation.z) * 10 * delta;
    }
  });

  const THREE_degToRad = (deg) => (deg * Math.PI) / 180;

  return (
    <group position={position}>
      {/* Stone Console Plinth */}
      <mesh position={[0, 0.75, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.5, 1.5, 1.5]} />
        <meshStandardMaterial color="#1a253c" roughness={0.7} />
      </mesh>

      {/* Dial 1 - Outer Ring */}
      <group position={[0, 1.55, 0]} rotation={[-Math.PI / 4, 0, 0]}>
        <mesh ref={dial1Ref}>
          <ringGeometry args={[0.7, 0.9, 24]} />
          <meshStandardMaterial
            color="#168CFF"
            emissive={solved ? '#00D9FF' : '#0052CC'}
            emissiveIntensity={solved ? 2.0 : 0.8}
          />
        </mesh>

        {/* Dial 2 - Middle Ring */}
        <mesh ref={dial2Ref}>
          <ringGeometry args={[0.45, 0.65, 24]} />
          <meshStandardMaterial
            color="#7047FF"
            emissive={solved ? '#00D9FF' : '#4520A8'}
            emissiveIntensity={solved ? 2.0 : 0.8}
          />
        </mesh>

        {/* Dial 3 - Inner Ring */}
        <mesh ref={dial3Ref}>
          <ringGeometry args={[0.2, 0.4, 24]} />
          <meshStandardMaterial
            color="#F5B942"
            emissive={solved ? '#00D9FF' : '#B87800'}
            emissiveIntensity={solved ? 2.0 : 0.8}
          />
        </mesh>

        {/* Center Keystone Alignment Socket */}
        <mesh position={[0, 0, 0.05]}>
          <circleGeometry args={[0.16, 16]} />
          <meshBasicMaterial color={solved ? '#00D9FF' : '#555555'} />
        </mesh>
      </group>

      {/* Mechanism Illumination */}
      <pointLight
        color={solved ? '#00D9FF' : '#F5B942'}
        intensity={solved ? 25 : 8}
        distance={6}
        position={[0, 2, 0]}
      />
    </group>
  );
}
