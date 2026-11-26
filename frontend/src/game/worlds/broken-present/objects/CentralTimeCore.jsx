import React, { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import GameState from '../../../engine/GameState';
import InteractionSystem from '../../../systems/InteractionSystem';
import AudioSystem from '../../../systems/AudioSystem';

/**
 * Central Time Core Machine (Mission 6)
 * Step 6: Installs all 3 Quantum Energy Cores to repair the reactor and restore timeline stability.
 */
export default function CentralTimeCore({ position = [0, 4.5, -36] }) {
  const outerRingsRef = useRef();
  const innerCoilRef = useRef();
  const plasmaCoreRef = useRef();
  const [repaired, setRepaired] = useState(false);

  useEffect(() => {
    const unsub = GameState.subscribe((state) => {
      setRepaired(state.objects.timeCoreRepaired);
    });

    InteractionSystem.register('central_time_core', {
      position: [position[0], 0, position[2] + 4],
      radius: 4.2,
      promptText: repaired ? 'Time Core Online' : 'Repair Time Core [E]',
      onInteract: () => {
        const state = GameState.getState();

        if (state.mission.currentStep === 6 && !repaired) {
          AudioSystem.playPortalActivate();
          setRepaired(true);

          GameState.setState({
            objects: {
              ...GameState.getState().objects,
              timeCoreRepaired: true,
              world2GatewayActive: true
            }
          });

          // Advance to Mission 7: World Completion
          GameState.advanceStep(7);
          InteractionSystem.unregister('central_time_core');
        } else if (state.mission.currentStep < 6) {
          GameState.setInteractionPrompt({
            id: 'time_core_offline',
            text: 'Time Core Offline: Complete Phase Puzzle First'
          });
        }
      }
    });

    return () => {
      unsub();
      InteractionSystem.unregister('central_time_core');
    };
  }, [position, repaired]);

  useFrame((state, delta) => {
    const speed = repaired ? 4.5 : 1.0;
    if (outerRingsRef.current) {
      outerRingsRef.current.rotation.y += delta * 0.6 * speed;
      outerRingsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 1.5) * 0.1;
    }
    if (innerCoilRef.current) {
      innerCoilRef.current.rotation.y -= delta * 1.2 * speed;
    }
    if (plasmaCoreRef.current) {
      const pulse = Math.sin(state.clock.elapsedTime * (repaired ? 6 : 2)) * 0.2;
      plasmaCoreRef.current.scale.set(1 + pulse, 1 + pulse, 1 + pulse);
    }
  });

  const coreColor = repaired ? '#00D9FF' : '#7047FF';
  const emissiveColor = repaired ? '#00D9FF' : '#4520A8';

  return (
    <group position={position}>
      {/* Reactor Base Foundation */}
      <mesh position={[0, -4.5, 0]} receiveShadow>
        <cylinderGeometry args={[6.5, 7.5, 1.4, 32]} />
        <meshStandardMaterial color="#0f172a" roughness={0.5} metalness={0.8} />
      </mesh>

      {/* Outer Magnetic Confinement Rings */}
      <group ref={outerRingsRef}>
        <mesh castShadow>
          <torusGeometry args={[3.8, 0.4, 16, 48]} />
          <meshStandardMaterial
            color="#F5B942"
            emissive="#B87800"
            emissiveIntensity={repaired ? 2.5 : 0.6}
            roughness={0.3}
            metalness={0.9}
          />
        </mesh>
      </group>

      {/* Inner Electromagnetic Coils */}
      <group ref={innerCoilRef}>
        <mesh>
          <torusGeometry args={[2.8, 0.25, 16, 32]} />
          <meshStandardMaterial
            color={coreColor}
            emissive={emissiveColor}
            emissiveIntensity={repaired ? 2.8 : 0.8}
            roughness={0.2}
            metalness={0.8}
          />
        </mesh>
      </group>

      {/* Central Quantum Plasma Reactor Sphere */}
      <mesh ref={plasmaCoreRef} position={[0, 0, 0]}>
        <sphereGeometry args={[1.6, 24, 24]} />
        <meshStandardMaterial
          color={coreColor}
          emissive={emissiveColor}
          emissiveIntensity={repaired ? 3.0 : 1.2}
          roughness={0.1}
          metalness={0.9}
        />
      </mesh>

      {/* Reactor Illumination Light */}
      <pointLight
        color={coreColor}
        intensity={repaired ? 85 : 25}
        distance={35}
        decay={2}
      />
    </group>
  );
}
