import React, { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import GameState from '../../../engine/GameState';
import InteractionSystem from '../../../systems/InteractionSystem';
import AudioSystem from '../../../systems/AudioSystem';
import SaveSystem from '../../../systems/SaveSystem';

/**
 * World 2 Timeline Gateway Portal (Mission 7)
 * Unlocked once the Central Time Core is repaired. Steps into the future timeline!
 */
export default function TimelineGateway({ position = [0, 4.5, -42] }) {
  const portalRingRef = useRef();
  const eventHorizonRef = useRef();
  const [active, setActive] = useState(false);

  useEffect(() => {
    const unsub = GameState.subscribe((state) => {
      setActive(state.objects.world2GatewayActive);
    });

    InteractionSystem.register('world_2_gateway', {
      position: [position[0], 0, position[2] + 3],
      radius: 4.2,
      promptText: 'Enter Next Timeline Portal',
      onInteract: async () => {
        const state = GameState.getState();

        if (state.mission.currentStep >= 7 && state.objects.world2GatewayActive) {
          AudioSystem.playVictory();
          await SaveSystem.completeWorld();
          GameState.setScene('victory');
        } else {
          GameState.setInteractionPrompt({
            id: 'gateway_offline',
            text: 'Gateway Locked: Repair Time Core First'
          });
        }
      }
    });

    return () => {
      unsub();
      InteractionSystem.unregister('world_2_gateway');
    };
  }, [position]);

  useFrame((state, delta) => {
    if (portalRingRef.current && active) {
      portalRingRef.current.rotation.z += delta * 1.5;
    }
    if (eventHorizonRef.current) {
      const pulse = 0.5 + Math.sin(state.clock.elapsedTime * 4) * 0.25;
      eventHorizonRef.current.material.opacity = active ? 0.85 : 0.2 + pulse * 0.15;
    }
  });

  return (
    <group position={position}>
      {/* Sci-Fi Portal Ring Frame */}
      <mesh ref={portalRingRef} castShadow>
        <torusGeometry args={[3.8, 0.35, 16, 48]} />
        <meshStandardMaterial
          color={active ? '#00D9FF' : '#1e293b'}
          emissive={active ? '#00D9FF' : '#0a101d'}
          emissiveIntensity={active ? 2.5 : 0.4}
          roughness={0.2}
          metalness={0.9}
        />
      </mesh>

      {/* Portal Event Horizon Disc */}
      <mesh ref={eventHorizonRef} position={[0, 0, 0]}>
        <circleGeometry args={[2.8, 32]} />
        <meshBasicMaterial
          color="#00D9FF"
          transparent={true}
          opacity={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>

      <pointLight
        color="#00D9FF"
        intensity={active ? 60 : 10}
        distance={25}
        position={[0, 0, 1]}
      />
    </group>
  );
}
