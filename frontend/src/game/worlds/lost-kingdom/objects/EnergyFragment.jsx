import React, { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import GameState from '../../../engine/GameState';
import InteractionSystem from '../../../systems/InteractionSystem';
import AudioSystem from '../../../systems/AudioSystem';

/**
 * Temporal Energy Fragment Collectible
 * Steps 5 & 6 in the 10-step sequence
 */
export default function EnergyFragment({
  id = 'fragment_1',
  name = 'Fragment of Antiquity',
  position = [-8, 1.2, 3]
}) {
  const meshRef = useRef();
  const [collected, setCollected] = useState(false);

  useEffect(() => {
    // Check if already collected in GameState
    const isAlreadyCollected = GameState.getState().inventory.items.some((i) => i.id === id);
    if (isAlreadyCollected) {
      setCollected(true);
      return;
    }

    InteractionSystem.register(id, {
      position,
      radius: 2.2,
      promptText: `Collect ${name}`,
      onInteract: () => {
        AudioSystem.playCollect();
        GameState.collectFragment(id, name);
        setCollected(true);
        InteractionSystem.unregister(id);
      }
    });

    return () => InteractionSystem.unregister(id);
  }, [id, name, position]);

  useFrame((state, delta) => {
    if (meshRef.current && !collected) {
      meshRef.current.rotation.y += delta * 2.0;
      meshRef.current.rotation.x += delta * 1.0;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 3.0) * 0.15;
    }
  });

  if (collected) return null;

  return (
    <group position={position}>
      {/* Floating Shimmering Tetrahedron Crystal */}
      <mesh ref={meshRef} position={[0, 0, 0]} castShadow>
        <tetrahedronGeometry args={[0.35, 0]} />
        <meshStandardMaterial
          color="#00D9FF"
          emissive="#168CFF"
          emissiveIntensity={2.5}
          roughness={0.1}
          metalness={0.9}
        />
      </mesh>

      {/* Orbiting Energy Ring */}
      <mesh rotation={[Math.PI / 4, 0, 0]}>
        <torusGeometry args={[0.5, 0.02, 6, 16]} />
        <meshBasicMaterial color="#00D9FF" />
      </mesh>

      {/* Localized Glow Light */}
      <pointLight color="#00D9FF" intensity={15} distance={6} />
    </group>
  );
}
