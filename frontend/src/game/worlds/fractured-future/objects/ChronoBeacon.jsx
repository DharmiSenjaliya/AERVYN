import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import GameState from '../../../systems/../engine/GameState';
import InteractionSystem from '../../../systems/InteractionSystem';
import AudioSystem from '../../../systems/AudioSystem';

/**
 * World 3: Chrono Beacon (Mission 1 Objective)
 * Position: [0, 2, 16]
 * Player calibrates timeline frequencies to scan for Chrono Shards
 */
export default function ChronoBeacon() {
  const ringsRef = useRef();
  const [calibrated, setCalibrated] = React.useState(
    GameState.getState().objects.beaconCalibrated
  );

  useEffect(() => {
    const unsub = GameState.subscribe((state) => {
      setCalibrated(state.objects.beaconCalibrated);
    });

    // Register spatial interaction
    InteractionSystem.registerInteractiveObject('chrono_beacon', {
      position: [0, 2, 16],
      radius: 3.5,
      promptText: 'Calibrate Chrono Beacon [E]',
      onInteract: () => {
        if (!GameState.getState().objects.beaconCalibrated) {
          AudioSystem.playInteract();
          GameState.setState({
            objects: {
              ...GameState.getState().objects,
              beaconCalibrated: true
            }
          });
          GameState.setCheckpoint('world_3_beacon', 'Chrono Beacon Plaza', [0, 2, 16]);
          GameState.advanceStep(2);
        }
      }
    });

    return () => {
      unsub();
      InteractionSystem.unregisterInteractiveObject('chrono_beacon');
    };
  }, []);

  useFrame((state, delta) => {
    if (ringsRef.current) {
      ringsRef.current.rotation.y += delta * (calibrated ? 2.5 : 0.8);
      ringsRef.current.rotation.x += delta * (calibrated ? 1.2 : 0.4);
    }
  });

  return (
    <group position={[0, 2, 16]}>
      {/* Base Pedestal */}
      <mesh position={[0, 0.4, 0]} castShadow>
        <cylinderGeometry args={[1.2, 1.5, 0.8, 8]} />
        <meshStandardMaterial color="#10172e" roughness={0.3} metalness={0.8} />
      </mesh>

      {/* Runic Glow Ring on Base */}
      <mesh position={[0, 0.82, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.9, 1.1, 16]} />
        <meshStandardMaterial
          color={calibrated ? '#00D9FF' : '#7047FF'}
          emissive={calibrated ? '#00D9FF' : '#7047FF'}
          emissiveIntensity={2.5}
        />
      </mesh>

      {/* Main Antenna Mast */}
      <mesh position={[0, 2.2, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.18, 2.8, 12]} />
        <meshStandardMaterial color="#192542" roughness={0.2} metalness={0.9} />
      </mesh>

      {/* Gyroscopic Holographic Pulse Rings */}
      <group ref={ringsRef} position={[0, 3.2, 0]}>
        <mesh>
          <torusGeometry args={[0.8, 0.04, 8, 24]} />
          <meshStandardMaterial
            color="#00D9FF"
            emissive="#00D9FF"
            emissiveIntensity={3.0}
          />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.6, 0.035, 8, 24]} />
          <meshStandardMaterial
            color="#C084FC"
            emissive="#7047FF"
            emissiveIntensity={2.5}
          />
        </mesh>
      </group>

      {/* Center Beacon Crystal */}
      <mesh position={[0, 3.2, 0]}>
        <octahedronGeometry args={[0.35, 0]} />
        <meshStandardMaterial
          color={calibrated ? '#00D9FF' : '#F5B942'}
          emissive={calibrated ? '#00D9FF' : '#F5B942'}
          emissiveIntensity={calibrated ? 3.5 : 2.0}
        />
      </mesh>

      {/* Beacon Light */}
      <pointLight
        position={[0, 3.5, 0]}
        color={calibrated ? '#00D9FF' : '#7047FF'}
        intensity={calibrated ? 15 : 8}
        distance={12}
      />
    </group>
  );
}
