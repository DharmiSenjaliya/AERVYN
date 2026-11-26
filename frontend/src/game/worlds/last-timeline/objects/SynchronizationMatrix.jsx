import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import GameState from '../../../engine/GameState';
import AudioSystem from '../../../systems/AudioSystem';

/**
 * World 4: The Continuum Synchronization Matrix
 * The final tri-epoch puzzle. Players must align three Epoch Keystones:
 * 1. Antiquity Keystone (World 1 - Past Gold)
 * 2. Quantum Keystone (World 2 - Present Cyan)
 * 3. Singularity Keystone (World 3 - Future Violet)
 */

function KeystonePillar({ epochKey, label, position, color, emissive, isAligned, onAlign }) {
  const crystalRef = useRef();
  const ringRef = useRef();
  const beamRef = useRef();

  useFrame((_, delta) => {
    if (crystalRef.current) {
      const speed = isAligned ? 2.5 : 0.8;
      crystalRef.current.rotation.y += delta * speed;
      crystalRef.current.position.y = 2.4 + Math.sin(Date.now() * 0.003 * speed) * (isAligned ? 0.3 : 0.15);
    }
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * (isAligned ? 1.8 : 0.5);
    }
  });

  return (
    <group position={position}>
      {/* Stone / Metal Pedestal Base */}
      <mesh position={[0, 0.6, 0]} receiveShadow>
        <cylinderGeometry args={[1.2, 1.6, 1.2, 8]} />
        <meshStandardMaterial color="#0E0C20" roughness={0.4} metalness={0.8} />
      </mesh>

      {/* Runic Trim */}
      <mesh position={[0, 1.22, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.8, 1.2, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={emissive}
          emissiveIntensity={isAligned ? 1.5 : 0.5}
        />
      </mesh>

      {/* Rotating Gyro Ring */}
      <group position={[0, 2.4, 0]}>
        <mesh ref={ringRef}>
          <torusGeometry args={[1.2, 0.06, 12, 32]} />
          <meshStandardMaterial
            color={color}
            emissive={emissive}
            emissiveIntensity={isAligned ? 2.0 : 0.6}
          />
        </mesh>
      </group>

      {/* Floating Epoch Crystal */}
      <mesh ref={crystalRef} position={[0, 2.4, 0]} castShadow>
        <octahedronGeometry args={[0.7, 0]} />
        <meshStandardMaterial
          color={color}
          emissive={emissive}
          emissiveIntensity={isAligned ? 2.4 : 0.8}
          roughness={0.1}
          metalness={0.9}
        />
      </mesh>

      {/* Resonant Vertical Energy Beam (When Aligned) */}
      {isAligned && (
        <mesh ref={beamRef} position={[0, 9, 0]}>
          <cylinderGeometry args={[0.2, 0.4, 14, 16]} />
          <meshStandardMaterial
            color={color}
            emissive={emissive}
            emissiveIntensity={2.5}
            transparent
            opacity={0.65}
          />
        </mesh>
      )}

      {/* Omnidirectional Point Light */}
      <pointLight
        position={[0, 2.6, 0]}
        color={color}
        intensity={isAligned ? 3.0 : 1.0}
        distance={10}
      />
    </group>
  );
}

export default function SynchronizationMatrix() {
  const [matrixState, setMatrixState] = useState({
    antiquity: false,
    quantum: false,
    singularity: false,
    solved: false
  });

  const pillars = [
    {
      key: 'antiquity',
      label: 'Antiquity Keystone (Timeline I)',
      position: [-6, 0, 3],
      color: '#F5B942',
      emissive: '#D97706'
    },
    {
      key: 'quantum',
      label: 'Quantum Keystone (Timeline II)',
      position: [6, 0, 3],
      color: '#00D9FF',
      emissive: '#0284C7'
    },
    {
      key: 'singularity',
      label: 'Singularity Keystone (Timeline III)',
      position: [0, 0, -6],
      color: '#C084FC',
      emissive: '#7E22CE'
    }
  ];

  useEffect(() => {
    const unsub = GameState.subscribe((state) => {
      const current = state.objects.synchronizationMatrix || {};
      setMatrixState({
        antiquity: !!current.antiquity,
        quantum: !!current.quantum,
        singularity: !!current.singularity,
        solved: !!current.solved
      });
    });
    return unsub;
  }, []);

  useFrame(() => {
    const playerPos = GameState.getState().player.position;
    if (!playerPos) return;

    let closestPillar = null;
    let minDist = 3.2;

    for (const p of pillars) {
      const dx = playerPos[0] - p.position[0];
      const dz = playerPos[2] - p.position[2];
      const dist = Math.sqrt(dx * dx + dz * dz);
      if (dist < minDist) {
        minDist = dist;
        closestPillar = p;
      }
    }

    if (closestPillar && !matrixState[closestPillar.key]) {
      GameState.setInteractionPrompt({
        text: `Press [E] to Synchronize ${closestPillar.label}`,
        key: 'E',
        onInteract: () => {
          GameState.alignEpochKeystone(closestPillar.key);
        }
      });
    } else if (closestPillar && matrixState[closestPillar.key]) {
      GameState.setInteractionPrompt({
        text: `${closestPillar.label} is Synchronized`,
        key: null
      });
    } else {
      const currentPrompt = GameState.getState().interactionPrompt;
      if (currentPrompt && currentPrompt.text && currentPrompt.text.includes('Synchronize')) {
        GameState.setInteractionPrompt(null);
      }
    }
  });

  // Handle Desktop 'E' Key Interaction
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'e' || e.key === 'E') {
        const prompt = GameState.getState().interactionPrompt;
        if (prompt && prompt.key === 'E' && prompt.onInteract) {
          prompt.onInteract();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <group>
      {pillars.map((p) => (
        <KeystonePillar
          key={p.key}
          epochKey={p.key}
          label={p.label}
          position={p.position}
          color={p.color}
          emissive={p.emissive}
          isAligned={matrixState[p.key]}
          onAlign={() => GameState.alignEpochKeystone(p.key)}
        />
      ))}

      {/* Central Matrix Convergence Well (When all 3 are aligned) */}
      {matrixState.solved && (
        <group position={[0, 0.2, 0]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.5, 4.5, 32]} />
            <meshStandardMaterial
              color="#F5B942"
              emissive="#F59E0B"
              emissiveIntensity={1.8}
              transparent
              opacity={0.8}
            />
          </mesh>
          <pointLight position={[0, 1.5, 0]} color="#F5B942" intensity={4} distance={15} />
        </group>
      )}
    </group>
  );
}
