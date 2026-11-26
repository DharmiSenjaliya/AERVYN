import React, { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import GameState from '../../../engine/GameState';
import InteractionSystem from '../../../systems/InteractionSystem';
import AudioSystem from '../../../systems/AudioSystem';
import CollisionSystem from '../../../systems/CollisionSystem';

/**
 * Underground Research Lab Armored Bulkhead Door (Mission 4)
 * Step 4: Channels the 3 collected Quantum Energy Cores to grant access to the subterranean lab.
 */
export default function LabBulkhead({ position = [0, 0, -20] }) {
  const doorPanelRef = useRef();
  const [unlocked, setUnlocked] = useState(false);
  const [openHeight, setOpenHeight] = useState(0);

  useEffect(() => {
    // Register door collider barrier
    CollisionSystem.registerBoxCollider('lab_bulkhead_barrier', -4, 4, -21, -19);

    const unsub = GameState.subscribe((state) => {
      setUnlocked(state.objects.labBulkheadUnlocked);
    });

    InteractionSystem.register('lab_bulkhead', {
      position: [0, 0, -18.5],
      radius: 3.2,
      promptText: 'Inspect Lab Bulkhead',
      onInteract: () => {
        const state = GameState.getState();
        const cores = state.inventory.quantumCoresCollected;

        if (cores >= 3 && !state.objects.labBulkheadUnlocked) {
          AudioSystem.playDoorOpen();
          GameState.setState({
            objects: {
              ...GameState.getState().objects,
              labBulkheadUnlocked: true
            }
          });
          // Remove collision barrier so player can enter
          CollisionSystem.registerBoxCollider('lab_bulkhead_barrier', 0, 0, 0, 0);
          // Advance to Mission 5: The Time Anomaly
          GameState.advanceStep(5);
          InteractionSystem.unregister('lab_bulkhead');
        } else if (cores < 3) {
          GameState.setInteractionPrompt({
            id: 'bulkhead_locked',
            text: `Bulkhead Sealed (${cores}/3 Quantum Cores)`
          });
        }
      }
    });

    return () => {
      unsub();
      InteractionSystem.unregister('lab_bulkhead');
    };
  }, []);

  useFrame((_, delta) => {
    if (unlocked && openHeight < 6.5) {
      const next = Math.min(6.5, openHeight + delta * 3.5);
      setOpenHeight(next);
      if (doorPanelRef.current) {
        doorPanelRef.current.position.y = 3.2 + next;
      }
    }
  });

  return (
    <group position={position}>
      {/* Outer Door Frame Arch */}
      <mesh position={[0, 3.8, 0]} castShadow>
        <boxGeometry args={[8.5, 7.6, 1.4]} />
        <meshStandardMaterial color="#162035" roughness={0.5} metalness={0.7} />
      </mesh>

      {/* Opening Passage Hollow */}
      {/* Sliding Armored Door Panel */}
      <mesh ref={doorPanelRef} position={[0, 3.2, 0]} castShadow receiveShadow>
        <boxGeometry args={[5.2, 6.2, 0.8]} />
        <meshStandardMaterial color="#0e172a" roughness={0.4} metalness={0.8} />
      </mesh>

      {/* Biometric / Core Power Receptacle Console */}
      <group position={[3.6, 1.4, 0.8]}>
        <mesh castShadow>
          <boxGeometry args={[0.6, 1.0, 0.3]} />
          <meshStandardMaterial color="#0b101c" roughness={0.4} metalness={0.9} />
        </mesh>
        <mesh position={[0, 0.1, 0.16]}>
          <planeGeometry args={[0.4, 0.5]} />
          <meshBasicMaterial color={unlocked ? '#10B981' : '#00D9FF'} />
        </mesh>
      </group>
    </group>
  );
}
