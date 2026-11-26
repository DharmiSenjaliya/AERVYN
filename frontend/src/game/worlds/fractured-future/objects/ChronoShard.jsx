import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import GameState from '../../../systems/../engine/GameState';
import InteractionSystem from '../../../systems/InteractionSystem';
import AudioSystem from '../../../systems/AudioSystem';

/**
 * World 3: Collectible Chrono Shards (Mission 3)
 * High-speed spinning crystalline relics with gyroscopic orbital rings.
 */
export default function ChronoShard({
  id = 'shard_genesis',
  name = 'Chrono Shard of Genesis',
  position = [16, 5, 12],
  color = '#F5B942',
  emissive = '#D48800'
}) {
  const crystalRef = useRef();
  const ring1Ref = useRef();
  const ring2Ref = useRef();

  const [collected, setCollected] = React.useState(
    GameState.getState().inventory.items.some((i) => i.id === id)
  );

  useEffect(() => {
    const unsub = GameState.subscribe((state) => {
      setCollected(state.inventory.items.some((i) => i.id === id));
    });

    InteractionSystem.registerInteractiveObject(`chrono_shard_${id}`, {
      position: [...position],
      radius: 2.8,
      promptText: `Reclaim ${name} [E]`,
      onInteract: () => {
        AudioSystem.playShardCollect();
        GameState.collectChronoShard(id, name);
      }
    });

    return () => {
      unsub();
      InteractionSystem.unregisterInteractiveObject(`chrono_shard_${id}`);
    };
  }, [id, name, position]);

  useFrame((state, delta) => {
    if (collected) return;
    const time = state.clock.elapsedTime;

    if (crystalRef.current) {
      crystalRef.current.rotation.y += delta * 2.5;
      crystalRef.current.position.y = 0.5 + Math.sin(time * 3) * 0.15;
    }
    if (ring1Ref.current) {
      ring1Ref.current.rotation.x += delta * 1.8;
      ring1Ref.current.rotation.y += delta * 1.2;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.z += delta * 2.0;
      ring2Ref.current.rotation.y -= delta * 1.4;
    }
  });

  if (collected) return null;

  return (
    <group position={position}>
      {/* Stone Pedestal Base */}
      <mesh position={[0, -0.4, 0]} castShadow>
        <cylinderGeometry args={[0.7, 0.9, 0.6, 6]} />
        <meshStandardMaterial color="#11182d" roughness={0.4} metalness={0.7} />
      </mesh>

      {/* Runic Glow Ring on Pedestal */}
      <mesh position={[0, -0.08, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.5, 0.65, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={emissive}
          emissiveIntensity={2.5}
        />
      </mesh>

      {/* Floating Center Crystal Shard */}
      <group ref={crystalRef}>
        <mesh castShadow>
          <octahedronGeometry args={[0.55, 0]} />
          <meshStandardMaterial
            color={color}
            emissive={emissive}
            emissiveIntensity={3.2}
            roughness={0.1}
            metalness={0.9}
          />
        </mesh>

        {/* Outer Orbital Rings */}
        <group ref={ring1Ref}>
          <mesh>
            <torusGeometry args={[0.9, 0.03, 8, 24]} />
            <meshStandardMaterial
              color="#00D9FF"
              emissive="#00D9FF"
              emissiveIntensity={2.0}
            />
          </mesh>
        </group>

        <group ref={ring2Ref}>
          <mesh>
            <torusGeometry args={[0.75, 0.025, 8, 24]} />
            <meshStandardMaterial
              color="#7047FF"
              emissive="#7047FF"
              emissiveIntensity={2.5}
            />
          </mesh>
        </group>
      </group>

      {/* Radiant Aura Light */}
      <pointLight color={color} intensity={14} distance={8} position={[0, 0.6, 0]} />
    </group>
  );
}
