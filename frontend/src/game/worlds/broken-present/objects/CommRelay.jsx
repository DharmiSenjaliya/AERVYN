import React, { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import GameState from '../../../engine/GameState';
import InteractionSystem from '../../../systems/InteractionSystem';
import AudioSystem from '../../../systems/AudioSystem';

/**
 * Communication Relay Dish & Station (Mission 2)
 * Step 2 in World 2: Deciphers lost signal and points player to underground lab.
 */
export default function CommRelay({ position = [-12, 0, -4] }) {
  const dishRef = useRef();
  const [activated, setActivated] = useState(false);

  useEffect(() => {
    const unsub = GameState.subscribe((state) => {
      setActivated(state.objects.commRelayActivated);
    });

    InteractionSystem.register('comm_relay', {
      position,
      radius: 2.8,
      promptText: activated ? 'Relay Transmitting' : 'Activate Comm Relay [E]',
      onInteract: () => {
        if (activated) return;

        AudioSystem.playInteract();
        setActivated(true);

        GameState.setState({
          objects: {
            ...GameState.getState().objects,
            commRelayActivated: true
          }
        });

        // Advance to Mission 3: Energy Recovery
        GameState.advanceStep(3);
        InteractionSystem.unregister('comm_relay');
      }
    });

    return () => {
      unsub();
      InteractionSystem.unregister('comm_relay');
    };
  }, [position, activated]);

  useFrame((state, delta) => {
    if (dishRef.current && activated) {
      dishRef.current.rotation.y += delta * 0.5;
    }
  });

  return (
    <group position={position}>
      {/* Structural Tower Lattice Mast */}
      <mesh position={[0, 2.5, 0]} castShadow>
        <cylinderGeometry args={[0.4, 0.8, 5, 8]} />
        <meshStandardMaterial color="#1a253c" roughness={0.6} metalness={0.7} />
      </mesh>

      {/* Rotating Parabolic Satellite Dish */}
      <group ref={dishRef} position={[0, 5.2, 0]}>
        <mesh rotation={[0.4, 0, 0]} castShadow>
          <sphereGeometry args={[1.5, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.4]} />
          <meshStandardMaterial
            color="#22304d"
            roughness={0.4}
            metalness={0.8}
            side={2}
          />
        </mesh>
        {/* Central LNA Feed Horn */}
        <mesh position={[0, 0.4, 0.8]}>
          <cylinderGeometry args={[0.08, 0.08, 0.6, 8]} />
          <meshStandardMaterial color="#00D9FF" emissive="#00D9FF" emissiveIntensity={activated ? 2.5 : 0.4} />
        </mesh>
      </group>

      {/* Signal Beacon Light */}
      <pointLight
        color="#00D9FF"
        intensity={activated ? 25 : 6}
        distance={14}
        position={[0, 5.5, 0]}
      />
    </group>
  );
}
