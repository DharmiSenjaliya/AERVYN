import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import GameState from '../../../systems/../engine/GameState';
import InteractionSystem from '../../../systems/InteractionSystem';
import AudioSystem from '../../../systems/AudioSystem';

/**
 * World 3: Phase Bridge Terminal (Mission 2 Objective)
 * Position: [-12, 2, 6]
 * Activates solid-light bridge connecting Promenade Island to Central Ruins Hub
 */
export default function PhaseBridgeTerminal() {
  const holoScreenRef = useRef();
  const [active, setActive] = React.useState(
    GameState.getState().objects.phaseBridgeActive
  );

  useEffect(() => {
    const unsub = GameState.subscribe((state) => {
      setActive(state.objects.phaseBridgeActive);
    });

    InteractionSystem.registerInteractiveObject('phase_bridge_terminal', {
      position: [-12, 2, 6],
      radius: 3.2,
      promptText: 'Activate Phase Bridge [E]',
      onInteract: () => {
        if (!GameState.getState().objects.phaseBridgeActive) {
          AudioSystem.playPlatformActivate();
          GameState.setState({
            objects: {
              ...GameState.getState().objects,
              phaseBridgeActive: true
            }
          });
          GameState.advanceStep(3);
        }
      }
    });

    return () => {
      unsub();
      InteractionSystem.unregisterInteractiveObject('phase_bridge_terminal');
    };
  }, []);

  useFrame((state, delta) => {
    if (holoScreenRef.current) {
      holoScreenRef.current.position.y = 1.35 + Math.sin(state.clock.elapsedTime * 2.5) * 0.05;
    }
  });

  return (
    <group position={[-12, 2, 6]}>
      {/* Terminal Console Stand */}
      <mesh position={[0, 0.5, 0]} castShadow>
        <boxGeometry args={[1.2, 1.0, 0.8]} />
        <meshStandardMaterial color="#0e172e" roughness={0.3} metalness={0.8} />
      </mesh>

      {/* Cyber Inset Stripe */}
      <mesh position={[0, 0.5, 0.42]}>
        <planeGeometry args={[1.0, 0.15]} />
        <meshStandardMaterial
          color={active ? '#00D9FF' : '#F5B942'}
          emissive={active ? '#00D9FF' : '#F5B942'}
          emissiveIntensity={2.5}
        />
      </mesh>

      {/* Angled Console Top */}
      <mesh position={[0, 1.05, 0]} rotation={[-0.4, 0, 0]}>
        <boxGeometry args={[1.1, 0.15, 0.7]} />
        <meshStandardMaterial color="#141f3b" roughness={0.2} metalness={0.9} />
      </mesh>

      {/* Floating Holographic Display Screen */}
      <group ref={holoScreenRef}>
        <mesh position={[0, 0, 0]} rotation={[-0.2, 0, 0]}>
          <planeGeometry args={[1.4, 0.8]} />
          <meshBasicMaterial
            color={active ? '#00D9FF' : '#C084FC'}
            transparent
            opacity={0.65}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>

      {/* Light Projection Beam */}
      <pointLight
        position={[0, 1.5, 0]}
        color={active ? '#00D9FF' : '#C084FC'}
        intensity={8}
        distance={6}
      />

      {/* =========================================================================
          SOLID LIGHT ENERGY BRIDGE (Rendered when active)
          Spans [-12, 1.2, 4] toward Hub [0, 1.5, -4]
      ========================================================================= */}
      {active && (
        <group position={[6, -0.7, -5]} rotation={[0, 0.85, 0]}>
          {/* Main Translucent Solid-Light Bridge Deck */}
          <mesh receiveShadow>
            <boxGeometry args={[3.2, 0.25, 14]} />
            <meshStandardMaterial
              color="#00D9FF"
              emissive="#00D9FF"
              emissiveIntensity={1.8}
              transparent
              opacity={0.7}
              roughness={0.1}
            />
          </mesh>

          {/* Glowing Lateral Energy Guard Rails */}
          {[-1.6, 1.6].map((x, i) => (
            <mesh key={i} position={[x, 0.35, 0]}>
              <boxGeometry args={[0.15, 0.5, 14]} />
              <meshStandardMaterial
                color="#7047FF"
                emissive="#7047FF"
                emissiveIntensity={2.8}
              />
            </mesh>
          ))}
        </group>
      )}
    </group>
  );
}
