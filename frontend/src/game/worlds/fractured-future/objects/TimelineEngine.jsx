import React, { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import GameState from '../../../systems/../engine/GameState';
import InteractionSystem from '../../../systems/InteractionSystem';
import AudioSystem from '../../../systems/AudioSystem';
import SaveSystem from '../../../systems/SaveSystem';

/**
 * World 3: Master Timeline Engine (Mission 7 Victory Dais)
 * Position: [0, 2, -74]
 * Stabilizes the fractured future and seals the cosmic fracture upon boss defeat.
 */
export default function TimelineEngine() {
  const coreRing1Ref = useRef();
  const coreRing2Ref = useRef();
  const lightPillarRef = useRef();

  const [bossDefeated, setBossDefeated] = useState(
    GameState.getState().objects.bossDefeated
  );
  const [engineRestored, setEngineRestored] = useState(
    GameState.getState().objects.timelineEngineRestored
  );

  useEffect(() => {
    const unsub = GameState.subscribe((state) => {
      setBossDefeated(state.objects.bossDefeated);
      setEngineRestored(state.objects.timelineEngineRestored);
    });

    InteractionSystem.registerInteractiveObject('master_timeline_engine', {
      position: [0, 2, -74],
      radius: 4.0,
      promptText: 'Restore Master Timeline Engine [E]',
      onInteract: async () => {
        if (GameState.getState().objects.bossDefeated && !GameState.getState().objects.timelineEngineRestored) {
          AudioSystem.playVictory();
          GameState.setState({
            objects: {
              ...GameState.getState().objects,
              timelineEngineRestored: true
            }
          });

          // Save world completion telemetry to Laravel backend
          await SaveSystem.completeWorld('world_3');

          // Transition to World 3 Victory Screen
          setTimeout(() => {
            GameState.setScene('victory');
          }, 800);
        }
      }
    });

    return () => {
      unsub();
      InteractionSystem.unregisterInteractiveObject('master_timeline_engine');
    };
  }, []);

  useFrame((state, delta) => {
    const time = state.clock.elapsedTime;
    const speed = engineRestored ? 4.0 : bossDefeated ? 2.0 : 0.8;

    if (coreRing1Ref.current) {
      coreRing1Ref.current.rotation.y += delta * speed;
      coreRing1Ref.current.rotation.x += delta * (speed * 0.5);
    }
    if (coreRing2Ref.current) {
      coreRing2Ref.current.rotation.z += delta * speed;
      coreRing2Ref.current.rotation.y -= delta * (speed * 0.7);
    }
    if (lightPillarRef.current) {
      lightPillarRef.current.material.opacity = 0.5 + Math.sin(time * 3) * 0.2;
    }
  });

  return (
    <group position={[0, 2, -74]}>
      {/* Heavy Dais Base */}
      <mesh position={[0, 0.45, 0]} receiveShadow>
        <cylinderGeometry args={[3.2, 3.6, 0.9, 16]} />
        <meshStandardMaterial color="#0c1224" roughness={0.3} metalness={0.8} />
      </mesh>

      {/* Runic Glow Ring on Dais */}
      <mesh position={[0, 0.92, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.5, 2.9, 32]} />
        <meshStandardMaterial
          color={engineRestored ? '#F5B942' : '#00D9FF'}
          emissive={engineRestored ? '#D48800' : '#00D9FF'}
          emissiveIntensity={2.8}
        />
      </mesh>

      {/* Floating Counter-Rotating Gyroscopic Reactor Rings */}
      <group position={[0, 2.8, 0]}>
        <group ref={coreRing1Ref}>
          <mesh>
            <torusGeometry args={[1.6, 0.08, 8, 32]} />
            <meshStandardMaterial
              color="#F5B942"
              emissive="#D48800"
              emissiveIntensity={3.0}
            />
          </mesh>
        </group>
        <group ref={coreRing2Ref}>
          <mesh>
            <torusGeometry args={[1.2, 0.06, 8, 32]} />
            <meshStandardMaterial
              color="#00D9FF"
              emissive="#00D9FF"
              emissiveIntensity={3.5}
            />
          </mesh>
        </group>

        {/* Central Pure Plasma Sphere */}
        <mesh>
          <sphereGeometry args={[0.7, 24, 24]} />
          <meshStandardMaterial
            color="#FFFFFF"
            emissive={engineRestored ? '#F5B942' : '#00D9FF'}
            emissiveIntensity={engineRestored ? 5.0 : 3.0}
          />
        </mesh>
      </group>

      {/* Soaring Celestial Light Pillar (Revealed once boss is defeated) */}
      {bossDefeated && (
        <mesh ref={lightPillarRef} position={[0, 25, 0]}>
          <cylinderGeometry args={[1.2, 1.8, 50, 24, 1, true]} />
          <meshBasicMaterial
            color={engineRestored ? '#F5B942' : '#00D9FF'}
            transparent
            opacity={0.65}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {/* Radiance Light */}
      <pointLight
        position={[0, 3.5, 0]}
        color={engineRestored ? '#F5B942' : '#00D9FF'}
        intensity={engineRestored ? 35 : 18}
        distance={24}
      />
    </group>
  );
}
