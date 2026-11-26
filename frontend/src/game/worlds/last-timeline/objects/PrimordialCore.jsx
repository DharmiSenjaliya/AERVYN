import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import GameState from '../../../engine/GameState';
import AudioSystem from '../../../systems/AudioSystem';

/**
 * World 4: The Primordial Chrono Core
 * The ultimate temporal nexus.
 * When the Continuum Synchronization Matrix is solved, the player approaches the Core
 * to choose the fate of reality (Ending A: The Eternal Guardian or Ending B: The Architect of Tomorrow).
 */
export default function PrimordialCore() {
  const coreRef = useRef();
  const innerRef = useRef();
  const ring1Ref = useRef();
  const ring2Ref = useRef();
  const ring3Ref = useRef();
  const flareRef = useRef();

  const [matrixSolved, setMatrixSolved] = useState(false);
  const [endingSelected, setEndingSelected] = useState(null);

  useEffect(() => {
    const unsub = GameState.subscribe((state) => {
      setMatrixSolved(!!state.objects.synchronizationMatrix?.solved);
      setEndingSelected(state.endingSelected);
    });
    return unsub;
  }, []);

  useFrame((_, delta) => {
    const speed = matrixSolved ? 2.0 : 0.6;
    if (coreRef.current) {
      coreRef.current.rotation.y += delta * 0.4 * speed;
      coreRef.current.position.y = 5.5 + Math.sin(Date.now() * 0.002 * speed) * 0.35;
    }
    if (innerRef.current) {
      innerRef.current.rotation.x -= delta * 0.6 * speed;
      innerRef.current.rotation.z += delta * 0.5 * speed;
    }
    if (ring1Ref.current) ring1Ref.current.rotation.x += delta * 0.8 * speed;
    if (ring2Ref.current) ring2Ref.current.rotation.y -= delta * 0.9 * speed;
    if (ring3Ref.current) ring3Ref.current.rotation.z += delta * 0.7 * speed;
    if (flareRef.current) {
      flareRef.current.rotation.y += delta * 0.3;
      const s = 1.0 + Math.sin(Date.now() * 0.004) * 0.15;
      flareRef.current.scale.set(s, s, s);
    }
  });

  // Proximity Detection
  useFrame(() => {
    const playerPos = GameState.getState().player.position;
    if (!playerPos) return;

    const dx = playerPos[0] - 0;
    const dz = playerPos[2] - (-18);
    const dist = Math.sqrt(dx * dx + dz * dz);

    if (dist < 4.8) {
      if (!matrixSolved) {
        GameState.setInteractionPrompt({
          text: 'The Primordial Core is Desynchronized — Align all 3 Epoch Keystones in the Matrix.',
          key: null
        });
      } else if (!endingSelected) {
        GameState.setInteractionPrompt({
          text: 'Press [E] to Commune with the Primordial Core & Determine Reality',
          key: 'E',
          onInteract: () => {
            window.dispatchEvent(new CustomEvent('OPEN_FINAL_DECISION_MODAL'));
          }
        });
      } else {
        GameState.setInteractionPrompt({
          text: `Temporal Destiny Harmonized: ${endingSelected === 'ending_a' ? 'The Eternal Guardian' : 'The Architect of Tomorrow'}`,
          key: null
        });
      }
    } else {
      const currentPrompt = GameState.getState().interactionPrompt;
      if (currentPrompt && currentPrompt.text && (currentPrompt.text.includes('Primordial Core') || currentPrompt.text.includes('Temporal Destiny'))) {
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

  const coreColor = endingSelected === 'ending_a'
    ? '#F5B942'
    : endingSelected === 'ending_b'
    ? '#38BDF8'
    : matrixSolved
    ? '#F59E0B'
    : '#7E22CE';

  const emissiveColor = endingSelected === 'ending_a'
    ? '#D97706'
    : endingSelected === 'ending_b'
    ? '#0284C7'
    : matrixSolved
    ? '#B45309'
    : '#581C87';

  return (
    <group position={[0, 0, -18]}>
      {/* Altar Pedestal Structure */}
      <mesh position={[0, 1.2, 0]} receiveShadow>
        <cylinderGeometry args={[3.2, 4.0, 2.4, 16]} />
        <meshStandardMaterial color="#0A0818" roughness={0.3} metalness={0.8} />
      </mesh>

      {/* Runic Altar Base Collar */}
      <mesh position={[0, 2.42, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.2, 3.4, 32]} />
        <meshStandardMaterial
          color={coreColor}
          emissive={emissiveColor}
          emissiveIntensity={matrixSolved ? 1.8 : 0.6}
        />
      </mesh>

      {/* Floating Rotating Primordial Core Center */}
      <group ref={coreRef} position={[0, 5.5, 0]}>
        {/* Outer Geometric Crystalline Shell */}
        <mesh castShadow>
          <icosahedronGeometry args={[1.8, 1]} />
          <meshStandardMaterial
            color={coreColor}
            emissive={emissiveColor}
            emissiveIntensity={matrixSolved ? 2.5 : 0.8}
            roughness={0.1}
            metalness={0.9}
            wireframe={!matrixSolved}
          />
        </mesh>

        {/* Inner Luminous Singularity Core */}
        <mesh ref={innerRef}>
          <octahedronGeometry args={[1.2, 0]} />
          <meshStandardMaterial
            color="#FFFFFF"
            emissive={coreColor}
            emissiveIntensity={matrixSolved ? 3.0 : 1.2}
            roughness={0.0}
            metalness={1.0}
          />
        </mesh>

        {/* Gyroscopic Harmonic Rings */}
        <mesh ref={ring1Ref}>
          <torusGeometry args={[2.5, 0.08, 16, 64]} />
          <meshStandardMaterial
            color="#F5B942"
            emissive="#D97706"
            emissiveIntensity={matrixSolved ? 2.2 : 0.6}
          />
        </mesh>

        <mesh ref={ring2Ref} rotation={[Math.PI / 3, 0, 0]}>
          <torusGeometry args={[2.9, 0.06, 16, 64]} />
          <meshStandardMaterial
            color="#00D9FF"
            emissive="#0284C7"
            emissiveIntensity={matrixSolved ? 2.2 : 0.6}
          />
        </mesh>

        <mesh ref={ring3Ref} rotation={[0, Math.PI / 3, Math.PI / 4]}>
          <torusGeometry args={[3.3, 0.05, 16, 64]} />
          <meshStandardMaterial
            color="#C084FC"
            emissive="#7E22CE"
            emissiveIntensity={matrixSolved ? 2.2 : 0.6}
          />
        </mesh>

        {/* Cosmic Radiant Flare Field */}
        <mesh ref={flareRef}>
          <sphereGeometry args={[2.1, 16, 16]} />
          <meshStandardMaterial
            color={coreColor}
            emissive={emissiveColor}
            emissiveIntensity={matrixSolved ? 1.5 : 0.4}
            transparent
            opacity={0.35}
            roughness={0.1}
          />
        </mesh>
      </group>

      {/* Dynamic Core Point Light */}
      <pointLight
        position={[0, 5.5, 0]}
        color={coreColor}
        intensity={matrixSolved ? 6.0 : 2.0}
        distance={25}
      />

      {/* Cosmic Ascension Pillar (When Matrix Solved) */}
      {matrixSolved && (
        <mesh position={[0, 16, 0]}>
          <cylinderGeometry args={[0.5, 1.2, 22, 16]} />
          <meshStandardMaterial
            color={coreColor}
            emissive={emissiveColor}
            emissiveIntensity={2.5}
            transparent
            opacity={0.45}
          />
        </mesh>
      )}
    </group>
  );
}
