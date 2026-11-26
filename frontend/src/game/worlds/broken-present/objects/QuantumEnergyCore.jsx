import React, { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import GameState from '../../../engine/GameState';
import InteractionSystem from '../../../systems/InteractionSystem';
import AudioSystem from '../../../systems/AudioSystem';

/**
 * Quantum Energy Core Collectible (Mission 3)
 * High-density plasma core required to power the lab bulkhead and central Time Core.
 */
export default function QuantumEnergyCore({
  id = 'core_alpha',
  name = 'Alpha Quantum Core',
  position = [12, 1.2, 2]
}) {
  const coreRef = useRef();
  const ring1Ref = useRef();
  const ring2Ref = useRef();
  const [collected, setCollected] = useState(false);

  useEffect(() => {
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
        GameState.collectQuantumCore(id, name);
        setCollected(true);
        InteractionSystem.unregister(id);
      }
    });

    return () => InteractionSystem.unregister(id);
  }, [id, name, position]);

  useFrame((state, delta) => {
    if (!collected) {
      if (coreRef.current) {
        coreRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 3) * 0.12;
      }
      if (ring1Ref.current) ring1Ref.current.rotation.x += delta * 1.8;
      if (ring2Ref.current) ring2Ref.current.rotation.y -= delta * 2.2;
    }
  });

  if (collected) return null;

  return (
    <group ref={coreRef} position={position}>
      {/* Central High-Density Plasma Sphere */}
      <mesh castShadow>
        <sphereGeometry args={[0.26, 16, 16]} />
        <meshStandardMaterial
          color="#00D9FF"
          emissive="#00D9FF"
          emissiveIntensity={2.5}
        />
      </mesh>

      {/* Ring 1 - Vertical Gyro */}
      <mesh ref={ring1Ref}>
        <torusGeometry args={[0.42, 0.035, 8, 24]} />
        <meshStandardMaterial
          color="#F5B942"
          emissive="#B87800"
          emissiveIntensity={1.2}
          metalness={0.9}
        />
      </mesh>

      {/* Ring 2 - Horizontal Gyro */}
      <mesh ref={ring2Ref}>
        <torusGeometry args={[0.52, 0.03, 8, 24]} />
        <meshStandardMaterial
          color="#7047FF"
          emissive="#5025D8"
          emissiveIntensity={1.2}
          metalness={0.9}
        />
      </mesh>

      {/* Emitted Light */}
      <pointLight color="#00D9FF" intensity={18} distance={8} />
    </group>
  );
}
