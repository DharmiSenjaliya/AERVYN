import React, { useRef, useEffect, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import GameState from '../../../engine/GameState';
import InteractionSystem from '../../../systems/InteractionSystem';
import AudioSystem from '../../../systems/AudioSystem';
import SaveSystem from '../../../systems/SaveSystem';

/**
 * World 1 Central Time Portal - Enhanced Visual & Particle FX
 * Concentric gyroscopic rings, swirling vortex particle field, shockwave pulse,
 * and timeline completion leap.
 */
export default function TimePortal({ position = [0, 5, -31] }) {
  const outerRingRef = useRef();
  const innerRingRef = useRef();
  const discRef = useRef();
  const vortexRef = useRef();
  const shockwaveRef = useRef();

  const [isActive, setIsActive] = useState(false);
  const [isCharging, setIsCharging] = useState(false);
  const [shockwaveScale, setShockwaveScale] = useState(0);

  // Swirling vortex particle system
  const vortexParticleCount = 90;
  const [vortexPositions, vortexAngles, vortexRadii] = useMemo(() => {
    const pos = new Float32Array(vortexParticleCount * 3);
    const angles = new Float32Array(vortexParticleCount);
    const radii = new Float32Array(vortexParticleCount);
    for (let i = 0; i < vortexParticleCount; i++) {
      angles[i] = Math.random() * Math.PI * 2;
      radii[i] = 1.0 + Math.random() * 2.8;
      pos[i * 3] = Math.cos(angles[i]) * radii[i];
      pos[i * 3 + 1] = Math.sin(angles[i]) * radii[i];
      pos[i * 3 + 2] = (Math.random() - 0.5) * 0.8;
    }
    return [pos, angles, radii];
  }, []);

  useEffect(() => {
    const unsub = GameState.subscribe((state) => {
      setIsActive(state.objects.portalActive);
      setIsCharging(state.objects.portalCharging);
    });

    InteractionSystem.register('time_portal', {
      position: [position[0], 0, position[1] + 3],
      radius: 4.2,
      promptText: 'Activate Time Portal',
      onInteract: async () => {
        const state = GameState.getState();

        // Step 9: Initiate Portal Activation
        if (state.mission.currentStep === 9) {
          AudioSystem.playPortalActivate();
          GameState.setState({
            objects: { ...state.objects, portalCharging: true, portalActive: true }
          });
          setShockwaveScale(0.1);

          setTimeout(() => {
            GameState.advanceStep(10);
            GameState.setInteractionPrompt({
              id: 'time_portal_enter',
              text: 'Step Through Time Portal'
            });
          }, 1600);
        }
        // Step 10: Complete World 1 & Enter Timeline Leap!
        else if (state.mission.currentStep >= 10) {
          AudioSystem.playVictory();
          await SaveSystem.completeWorld();
          GameState.setScene('victory');
        } else {
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
    const speedMultiplier = isCharging ? 6.5 : isActive ? 3.2 : 1.0;

    if (outerRingRef.current) {
      outerRingRef.current.rotation.z += delta * 0.45 * speedMultiplier;
      outerRingRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.6) * 0.12;
    }
    if (innerRingRef.current) {
      innerRingRef.current.rotation.z -= delta * 0.7 * speedMultiplier;
      innerRingRef.current.rotation.y = Math.cos(state.clock.elapsedTime * 0.5) * 0.15;
    }
    if (discRef.current) {
      const pulse = 0.5 + Math.sin(state.clock.elapsedTime * 4.5) * 0.25;
      discRef.current.material.opacity = isActive ? 0.88 : 0.4 + pulse * 0.2;
    }

    // Swirling vortex particle motion
    if (vortexRef.current) {
      const posArray = vortexRef.current.geometry.attributes.position.array;
      const t = state.clock.elapsedTime;
      for (let i = 0; i < vortexParticleCount; i++) {
        vortexAngles[i] += delta * (isActive ? 3.0 : 1.2);
        const r = vortexRadii[i];
        posArray[i * 3] = Math.cos(vortexAngles[i]) * r;
        posArray[i * 3 + 1] = Math.sin(vortexAngles[i]) * r;
      }
      vortexRef.current.geometry.attributes.position.needsUpdate = true;
    }

    // Expanding shockwave pulse
    if (shockwaveRef.current && shockwaveScale > 0) {
      const nextScale = shockwaveScale + delta * 8;
      if (nextScale < 6.5) {
        setShockwaveScale(nextScale);
        shockwaveRef.current.scale.set(nextScale, nextScale, 1);
        shockwaveRef.current.material.opacity = Math.max(0, 1 - nextScale / 6.5);
      } else {
        setShockwaveScale(0);
      }
    }
  });

  const portalColor = isActive ? '#00D9FF' : '#7047FF';
  const emissiveColor = isActive ? '#00D9FF' : '#4520A8';

  return (
    <group position={position}>
      {/* Stone Dais Base */}
      <mesh position={[0, -4.5, 0]} receiveShadow>
        <cylinderGeometry args={[6.2, 7.2, 1.2, 32]} />
        <meshStandardMaterial color="#1a253d" roughness={0.8} />
      </mesh>

      {/* Outer Gyroscopic Ring */}
      <mesh ref={outerRingRef} castShadow>
        <torusGeometry args={[4.2, 0.45, 16, 64]} />
        <meshStandardMaterial
          color={portalColor}
          emissive={emissiveColor}
          emissiveIntensity={isActive ? 2.8 : 0.9}
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
          emissiveIntensity={isActive ? 2.2 : 0.6}
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

      {/* Vortex Inward Particle Field */}
      <points ref={vortexRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[vortexPositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.18}
          color="#00D9FF"
          transparent={true}
          opacity={isActive ? 0.9 : 0.5}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Shockwave Flare Ring */}
      <mesh ref={shockwaveRef} position={[0, 0, 0.1]} scale={[0.01, 0.01, 1]}>
        <ringGeometry args={[3.0, 3.4, 32]} />
        <meshBasicMaterial
          color="#00D9FF"
          transparent={true}
          opacity={0}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Dynamic Portal Light */}
      <pointLight
        color={portalColor}
        intensity={isActive ? 85 : 22}
        distance={38}
        decay={2}
      />
    </group>
  );
}
