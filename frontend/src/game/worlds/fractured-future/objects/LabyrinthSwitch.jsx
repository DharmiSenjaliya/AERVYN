import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import GameState from '../../../systems/../engine/GameState';
import InteractionSystem from '../../../systems/InteractionSystem';
import AudioSystem from '../../../systems/AudioSystem';

/**
 * World 3: Labyrinth Resonator Switch (Mission 4 Puzzle)
 * Positioned on the left, right, and north puzzle platforms of Time Labyrinth.
 */
export default function LabyrinthSwitch({
  switchKey = 'alpha',
  label = 'Resonator Switch Alpha',
  position = [-8, 2, -26],
  color = '#F5B942'
}) {
  const prismRef = useRef();
  const [isActive, setIsActive] = React.useState(
    GameState.getState().objects.labyrinthSwitches[switchKey] || false
  );

  useEffect(() => {
    const unsub = GameState.subscribe((state) => {
      setIsActive(state.objects.labyrinthSwitches[switchKey] || false);
    });

    InteractionSystem.registerInteractiveObject(`labyrinth_switch_${switchKey}`, {
      position: [...position],
      radius: 2.8,
      promptText: `Align ${label} [E]`,
      onInteract: () => {
        if (!GameState.getState().objects.labyrinthSwitches[switchKey]) {
          AudioSystem.playPuzzleDial();
          GameState.setLabyrinthSwitch(switchKey, true);
        }
      }
    });

    return () => {
      unsub();
      InteractionSystem.unregisterInteractiveObject(`labyrinth_switch_${switchKey}`);
    };
  }, [switchKey, label, position]);

  useFrame((state, delta) => {
    if (prismRef.current) {
      if (isActive) {
        prismRef.current.rotation.y = 0;
        prismRef.current.position.y = 1.0;
      } else {
        prismRef.current.rotation.y += delta * 1.5;
        prismRef.current.position.y = 1.35 + Math.sin(state.clock.elapsedTime * 2) * 0.08;
      }
    }
  });

  return (
    <group position={position}>
      {/* Stone Runic Pillar Base */}
      <mesh position={[0, 0.45, 0]} castShadow>
        <cylinderGeometry args={[0.55, 0.65, 0.9, 8]} />
        <meshStandardMaterial color="#0e162b" roughness={0.4} metalness={0.7} />
      </mesh>

      {/* Runic Glow Ring */}
      <mesh position={[0, 0.92, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.42, 0.52, 16]} />
        <meshStandardMaterial
          color={isActive ? '#00D9FF' : color}
          emissive={isActive ? '#00D9FF' : color}
          emissiveIntensity={isActive ? 3.0 : 1.2}
        />
      </mesh>

      {/* Rotating / Locked Crystal Prism */}
      <mesh ref={prismRef} position={[0, 1.35, 0]} castShadow>
        <octahedronGeometry args={[0.38, 0]} />
        <meshStandardMaterial
          color={isActive ? '#00D9FF' : color}
          emissive={isActive ? '#00D9FF' : color}
          emissiveIntensity={isActive ? 3.5 : 1.5}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>

      {/* Ambient Switch Light */}
      <pointLight
        position={[0, 1.4, 0]}
        color={isActive ? '#00D9FF' : color}
        intensity={isActive ? 12 : 5}
        distance={6}
      />
    </group>
  );
}
