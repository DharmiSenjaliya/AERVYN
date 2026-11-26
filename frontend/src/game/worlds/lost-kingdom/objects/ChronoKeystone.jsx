import React, { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import GameState from '../../../engine/GameState';
import InteractionSystem from '../../../systems/InteractionSystem';
import AudioSystem from '../../../systems/AudioSystem';

/**
 * Chrono Keystone - The Ancient Time Device Artifact
 * Pedestal at center of courtyard [0, 0, 0]
 * Steps 3 & 4 in the 10-step sequence
 */
export default function ChronoKeystone({ position = [0, 0, 0] }) {
  const relicRef = useRef();
  const [collected, setCollected] = useState(false);

  useEffect(() => {
    const unsub = GameState.subscribe((state) => {
      setCollected(state.inventory.hasKeystone);
    });

    InteractionSystem.register('chrono_keystone', {
      position,
      radius: 2.5,
      promptText: 'Take Chrono Keystone',
      onInteract: () => {
        AudioSystem.playCollect();

        GameState.setState({
          inventory: {
            ...GameState.getState().inventory,
            hasKeystone: true,
            items: [
              ...GameState.getState().inventory.items,
              {
                id: 'chrono_keystone',
                name: 'Chrono Keystone',
                type: 'device',
                description: 'An ancient chronometric keystone capaz of channeling timeline frequencies.'
              }
            ]
          }
        });

        // Advance mission to Step 5 (Collect 3 Fragments)
        GameState.advanceStep(5);
        InteractionSystem.unregister('chrono_keystone');
      }
    });

    return () => {
      unsub();
      InteractionSystem.unregister('chrono_keystone');
    };
  }, [position]);

  useFrame((state, delta) => {
    if (relicRef.current) {
      relicRef.current.rotation.y += delta * 1.2;
      relicRef.current.position.y = 1.6 + Math.sin(state.clock.elapsedTime * 2.5) * 0.12;
    }
  });

  return (
    <group position={position}>
      {/* Stone Pedestal Base */}
      <mesh position={[0, 0.6, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.7, 0.9, 1.2, 16]} />
        <meshStandardMaterial color="#1a243c" roughness={0.8} />
      </mesh>

      {/* Pedestal Top Dais */}
      <mesh position={[0, 1.25, 0]} castShadow>
        <cylinderGeometry args={[0.9, 0.7, 0.2, 16]} />
        <meshStandardMaterial color="#2c3a5e" roughness={0.6} metalness={0.4} />
      </mesh>

      {/* Floating Rotating Relic (if not yet picked up) */}
      {!collected && (
        <group ref={relicRef} position={[0, 1.6, 0]}>
          {/* Golden Gear Ring */}
          <mesh castShadow>
            <torusGeometry args={[0.3, 0.06, 8, 24]} />
            <meshStandardMaterial
              color="#F5B942"
              emissive="#D48800"
              emissiveIntensity={1.2}
              roughness={0.2}
              metalness={0.9}
            />
          </mesh>

          {/* Central Blue Energy Crystal */}
          <mesh>
            <octahedronGeometry args={[0.18, 0]} />
            <meshStandardMaterial
              color="#00D9FF"
              emissive="#00D9FF"
              emissiveIntensity={2.0}
            />
          </mesh>

          {/* Artifact Beacon Light */}
          <pointLight color="#00D9FF" intensity={18} distance={8} />
        </group>
      )}
    </group>
  );
}
