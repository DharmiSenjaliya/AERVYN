import React, { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import GameState from '../../../engine/GameState';
import InteractionSystem from '../../../systems/InteractionSystem';
import AudioSystem from '../../../systems/AudioSystem';
import CollisionSystem from '../../../systems/CollisionSystem';

/**
 * Ancient Stone Gate & Runic Lock
 * Step 7 in the 10-step sequence
 */
export default function AncientDoor({ position = [0, 0, -18] }) {
  const leftDoorRef = useRef();
  const rightDoorRef = useRef();

  const [unlocked, setUnlocked] = useState(false);
  const [openAmount, setOpenAmount] = useState(0); // 0 to 1

  useEffect(() => {
    // Register door collider initially
    CollisionSystem.registerBoxCollider('ancient_door_barrier', -3.5, 3.5, -19, -17);

    const unsub = GameState.subscribe((state) => {
      setUnlocked(state.objects.doorUnlocked);
    });

    InteractionSystem.register('ancient_door', {
      position: [0, 0, -16],
      radius: 3.5,
      promptText: 'Inspect Ancient Gate',
      onInteract: () => {
        const state = GameState.getState();
        const fragments = state.inventory.fragmentsCollected;

        if (fragments >= 3 && !state.objects.doorUnlocked) {
          AudioSystem.playDoorOpen();
          GameState.setState({
            objects: { ...state.objects, doorUnlocked: true }
          });
          GameState.advanceStep(8);
          // Remove door collider barrier so player can walk through
          CollisionSystem.registerBoxCollider('ancient_door_barrier', 0, 0, 0, 0);
          InteractionSystem.unregister('ancient_door');
        } else if (fragments < 3) {
          GameState.setInteractionPrompt({
            id: 'door_locked',
            text: `Runic Lock Sealed (${fragments}/3 Fragments)`
          });
        }
      }
    });

    return () => {
      unsub();
      InteractionSystem.unregister('ancient_door');
    };
  }, []);

  useFrame((_, delta) => {
    if (unlocked && openAmount < 1) {
      const next = Math.min(1, openAmount + delta * 0.8);
      setOpenAmount(next);

      if (leftDoorRef.current) leftDoorRef.current.position.x = -1.6 - next * 2.8;
      if (rightDoorRef.current) rightDoorRef.current.position.x = 1.6 + next * 2.8;
    }
  });

  return (
    <group position={position}>
      {/* Left Heavy Stone Door Leaf */}
      <mesh ref={leftDoorRef} position={[-1.6, 3.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.2, 7, 0.8]} />
        <meshStandardMaterial color="#1a253c" roughness={0.8} />
      </mesh>

      {/* Right Heavy Stone Door Leaf */}
      <mesh ref={rightDoorRef} position={[1.6, 3.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.2, 7, 0.8]} />
        <meshStandardMaterial color="#1a253c" roughness={0.8} />
      </mesh>

      {/* Runic Lock Emblem at Gate Center */}
      {!unlocked && (
        <group position={[0, 3.5, 0.45]}>
          <mesh>
            <circleGeometry args={[0.6, 16]} />
            <meshStandardMaterial
              color="#00D9FF"
              emissive="#00D9FF"
              emissiveIntensity={1.5}
            />
          </mesh>
          <pointLight color="#00D9FF" intensity={12} distance={6} />
        </group>
      )}
    </group>
  );
}
