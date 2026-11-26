import React, { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import GameState from '../../../engine/GameState';
import InteractionSystem from '../../../systems/InteractionSystem';
import AudioSystem from '../../../systems/AudioSystem';

/**
 * City Access Terminal (Mission 1)
 * Located at highway entrance [0, 0, 7].
 * First interaction point that bridges arrival into active mission investigation.
 */
export default function CityTerminal({ position = [0, 0, 7] }) {
  const holoScreenRef = useRef();
  const [hacked, setHacked] = useState(false);

  useEffect(() => {
    const unsub = GameState.subscribe((state) => {
      setHacked(state.objects.terminalHacked);
    });

    InteractionSystem.register('city_terminal', {
      position,
      radius: 2.4,
      promptText: hacked ? 'Terminal Decrypted' : 'Access City Terminal [E]',
      onInteract: () => {
        if (hacked) return;

        AudioSystem.playInteract();
        setHacked(true);

        GameState.setState({
          objects: {
            ...GameState.getState().objects,
            terminalHacked: true
          }
        });

        // Advance to Mission 2: The Lost Signal
        GameState.advanceStep(2);
        InteractionSystem.unregister('city_terminal');
      }
    });

    return () => {
      unsub();
      InteractionSystem.unregister('city_terminal');
    };
  }, [position, hacked]);

  useFrame((state, delta) => {
    if (holoScreenRef.current) {
      holoScreenRef.current.position.y = 1.6 + Math.sin(state.clock.elapsedTime * 3) * 0.04;
    }
  });

  return (
    <group position={position}>
      {/* Terminal Pedestal Base */}
      <mesh position={[0, 0.7, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.9, 1.4, 0.7]} />
        <meshStandardMaterial color="#162035" roughness={0.4} metalness={0.8} />
      </mesh>

      {/* Cybernetic Angled Console Deck */}
      <mesh position={[0, 1.45, 0.1]} rotation={[-0.4, 0, 0]} castShadow>
        <boxGeometry args={[1.0, 0.15, 0.6]} />
        <meshStandardMaterial color="#0b101c" roughness={0.3} metalness={0.9} />
      </mesh>

      {/* Floating Holographic Interface Display */}
      <mesh ref={holoScreenRef} position={[0, 1.6, -0.05]} rotation={[-0.2, 0, 0]}>
        <planeGeometry args={[1.2, 0.75]} />
        <meshStandardMaterial
          color={hacked ? '#10B981' : '#00D9FF'}
          emissive={hacked ? '#10B981' : '#00D9FF'}
          emissiveIntensity={1.8}
          transparent={true}
          opacity={0.85}
        />
      </mesh>

      <pointLight
        color={hacked ? '#10B981' : '#00D9FF'}
        intensity={14}
        distance={6}
        position={[0, 1.8, 0]}
      />
    </group>
  );
}
