import React, { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import GameState from '../../../engine/GameState';
import InteractionSystem from '../../../systems/InteractionSystem';
import AudioSystem from '../../../systems/AudioSystem';
import SaveSystem from '../../../systems/SaveSystem';

/**
 * World 1 Central Time Portal
 * Concentric gyroscopic rings, swirling event horizon, particle vortex,
 * activation animation, and timeline leap trigger.
 */
export default function TimePortal({ position = [0, 5, -31] }) {
  const outerRingRef = useRef();
  const innerRingRef = useRef();
  const discRef = useRef();

  const [isActive, setIsActive] = useState(false);
  const [isCharging, setIsCharging] = useState(false);

  useEffect(() => {
    const unsub = GameState.subscribe((state) => {
      setIsActive(state.objects.portalActive);
      setIsCharging(state.objects.portalCharging);
    });

    // Register interaction with the Time Portal Dais
    InteractionSystem.register('time_portal', {
      position: [position[0], 0, position[1] + 3],
      radius: 4.0,
      promptText: 'Activate Time Portal',
      onInteract: async () => {
        const state = GameState.getState();

        // If step 9: Activate Portal
        if (state.mission.currentStep === 9) {
          AudioSystem.playPortalActivate();
          GameState.setState({
            objects: { ...state.objects, portalCharging: true, portalActive: true }
          });

          setTimeout(() => {
            GameState.advanceStep(10);
            GameState.setInteractionPrompt({
              id: 'time_portal_enter',
              text: 'Step Through Time Portal'
            });
          }, 1500);
        }
        // If step 10: Complete World 1 & Enter Timeline Leap!
        else if (state.mission.currentStep >= 10) {
          AudioSystem.playVictory();
          // Notify backend and show Victory Screen
          await SaveSystem.completeWorld();
          GameState.setScene('victory');
        } else {
          // Tell player Keystone & puzzle needed
          GameState.setInteractionPrompt({
            id: 'time_portal_locked',
            text: 'Portal Inactive: Align Chrono Mechanism First'
          });
        }
      }
    });

    return () => {
      unsub();
      InteractionSystem.unregister('time_portal');
    };
  }, [position]);

  useFrame((state, delta) => {
    const speedMultiplier = isCharging ? 6 : isActive ? 3 : 1;

    if (outerRingRef.current) {
      outerRingRef.current.rotation.z += delta * 0.4 * speedMultiplier;
      outerRingRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.6) * 0.12;
    }
    if (innerRingRef.current) {
      innerRingRef.current.rotation.z -= delta * 0.65 * speedMultiplier;
      innerRingRef.current.rotation.y = Math.cos(state.clock.elapsedTime * 0.5) * 0.15;
    }
    if (discRef.current) {
      const pulse = 0.5 + Math.sin(state.clock.elapsedTime * 4) * 0.2;
      discRef.current.material.opacity = isActive ? 0.85 : 0.4 + pulse * 0.2;
    }
  });

  const portalColor = isActive ? '#00D9FF' : '#7047FF';
  const emissiveColor = isActive ? '#00D9FF' : '#4520A8';

  return (
    <group position={position}>
      {/* Stone Dais Base */}
      <mesh position={[0, -4.5, 0]} receiveShadow>
        <cylinderGeometry args={[6, 7, 1.2, 32]} />
        <meshStandardMaterial color="#1a253d" roughness={0.8} />
      </mesh>

      {/* Outer Gyroscopic Ring */}
      <mesh ref={outerRingRef} castShadow>
        <torusGeometry args={[4.2, 0.45, 16, 64]} />
        <meshStandardMaterial
          color={portalColor}
          emissive={emissiveColor}
          emissiveIntensity={isActive ? 2.5 : 0.8}
          roughness={0.25}
          metalness={0.8}
        />
      </mesh>

      {/* Inner Concentric Ring */}
      <mesh ref={innerRingRef}>
        <torusGeometry args={[3.2, 0.25, 16, 48]} />
        <meshStandardMaterial
          color="#F5B942"
          emissive="#D48800"
          emissiveIntensity={isActive ? 2.0 : 0.6}
          roughness={0.3}
          metalness={0.9}
        />
      </mesh>

      {/* Swirling Event Horizon Disc */}
      <mesh ref={discRef} position={[0, 0, 0]}>
        <circleGeometry args={[3.0, 32]} />
        <meshBasicMaterial
          color={portalColor}
          transparent={true}
          opacity={0.65}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Dynamic Portal Light */}
      <pointLight
        color={portalColor}
        intensity={isActive ? 75 : 20}
        distance={35}
        decay={2}
      />
    </group>
  );
}
