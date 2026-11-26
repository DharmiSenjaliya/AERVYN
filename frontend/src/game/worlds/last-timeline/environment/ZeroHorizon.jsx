import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

/**
 * World 4: The Zero Horizon - Environmental Nexus
 * Transcendent celestial sanctuary outside linear time.
 * Features the Central Convergence Nexus, Ethereal Light Bridge,
 * and Three Temporal Reflection Mirrors representing Worlds 1, 2, and 3.
 */
export default function ZeroHorizon() {
  const ringRef1 = useRef();
  const ringRef2 = useRef();
  const ringRef3 = useRef();
  const mirrorRef1 = useRef();
  const mirrorRef2 = useRef();
  const mirrorRef3 = useRef();

  useFrame((_, delta) => {
    if (ringRef1.current) ringRef1.current.rotation.z += delta * 0.15;
    if (ringRef2.current) ringRef2.current.rotation.x += delta * 0.12;
    if (ringRef3.current) ringRef3.current.rotation.y += delta * 0.18;

    if (mirrorRef1.current) mirrorRef1.current.rotation.y += delta * 0.25;
    if (mirrorRef2.current) mirrorRef2.current.rotation.y -= delta * 0.22;
    if (mirrorRef3.current) mirrorRef3.current.rotation.y += delta * 0.28;
  });

  return (
    <group>
      {/* 1. Central Convergence Nexus Platform */}
      <mesh position={[0, -0.4, 0]} receiveShadow>
        <cylinderGeometry args={[14, 15, 0.8, 32]} />
        <meshStandardMaterial color="#0A0818" roughness={0.3} metalness={0.8} />
      </mesh>

      {/* Outer Runic Gold Ring */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <ringGeometry args={[11.5, 13.5, 32]} />
        <meshStandardMaterial color="#F5B942" emissive="#B45309" emissiveIntensity={0.6} roughness={0.2} metalness={0.9} />
      </mesh>

      {/* Inner Prismatic Matrix Ring */}
      <mesh position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <ringGeometry args={[5, 6.5, 32]} />
        <meshStandardMaterial color="#00D9FF" emissive="#0284C7" emissiveIntensity={0.8} roughness={0.2} metalness={0.9} />
      </mesh>

      {/* Central Sanctuary Dais */}
      <mesh position={[0, 0.1, 0]} receiveShadow>
        <cylinderGeometry args={[3.2, 3.8, 0.4, 24]} />
        <meshStandardMaterial color="#1E1638" roughness={0.4} metalness={0.7} />
      </mesh>

      {/* 2. Arrival Sanctuary Platform (South: [0, 2, 20]) */}
      <mesh position={[0, 1.6, 20]} receiveShadow>
        <cylinderGeometry args={[6, 6.5, 0.8, 24]} />
        <meshStandardMaterial color="#0E0C22" roughness={0.3} metalness={0.8} />
      </mesh>
      <mesh position={[0, 2.02, 20]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <ringGeometry args={[4.2, 5.5, 24]} />
        <meshStandardMaterial color="#C084FC" emissive="#7E22CE" emissiveIntensity={0.7} roughness={0.2} metalness={0.8} />
      </mesh>

      {/* Ethereal Light Bridge connecting Arrival [0, 2, 20] to Nexus [0, 0, 0] */}
      <mesh position={[0, 1.0, 10]} rotation={[0.08, 0, 0]} receiveShadow>
        <boxGeometry args={[4, 0.3, 19]} />
        <meshStandardMaterial
          color="#38BDF8"
          emissive="#0284C7"
          emissiveIntensity={0.6}
          roughness={0.1}
          metalness={0.6}
          transparent
          opacity={0.85}
        />
      </mesh>
      {/* Light Bridge Guard Rails */}
      <mesh position={[-2.1, 1.5, 10]} rotation={[0.08, 0, 0]}>
        <boxGeometry args={[0.2, 0.8, 19]} />
        <meshStandardMaterial color="#F5B942" emissive="#D97706" emissiveIntensity={0.8} metalness={0.9} />
      </mesh>
      <mesh position={[2.1, 1.5, 10]} rotation={[0.08, 0, 0]}>
        <boxGeometry args={[0.2, 0.8, 19]} />
        <meshStandardMaterial color="#F5B942" emissive="#D97706" emissiveIntensity={0.8} metalness={0.9} />
      </mesh>

      {/* 3. North Core Dais (Leading to the Primordial Chrono Core at [0, 3, -18]) */}
      <mesh position={[0, 2.0, -10]} rotation={[-0.12, 0, 0]} receiveShadow>
        <boxGeometry args={[5, 0.4, 15]} />
        <meshStandardMaterial
          color="#F5B942"
          emissive="#B45309"
          emissiveIntensity={0.5}
          roughness={0.2}
          metalness={0.8}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Primordial Core Altar Dais at [0, 3, -18] */}
      <mesh position={[0, 2.6, -18]} receiveShadow>
        <cylinderGeometry args={[7, 8, 1.2, 32]} />
        <meshStandardMaterial color="#0A0818" roughness={0.2} metalness={0.9} />
      </mesh>
      <mesh position={[0, 3.22, -18]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <ringGeometry args={[5.2, 6.6, 32]} />
        <meshStandardMaterial color="#F5B942" emissive="#F59E0B" emissiveIntensity={0.9} roughness={0.1} metalness={0.9} />
      </mesh>

      {/* 4. Giant Gyroscopic Celestial Rings around Sanctum */}
      <group position={[0, 10, -18]}>
        <mesh ref={ringRef1}>
          <torusGeometry args={[14, 0.25, 16, 64]} />
          <meshStandardMaterial color="#F5B942" emissive="#D97706" emissiveIntensity={0.7} metalness={0.9} />
        </mesh>
        <mesh ref={ringRef2} rotation={[Math.PI / 4, 0, 0]}>
          <torusGeometry args={[16, 0.2, 16, 64]} />
          <meshStandardMaterial color="#00D9FF" emissive="#0284C7" emissiveIntensity={0.8} metalness={0.9} />
        </mesh>
        <mesh ref={ringRef3} rotation={[0, Math.PI / 3, Math.PI / 6]}>
          <torusGeometry args={[18, 0.18, 16, 64]} />
          <meshStandardMaterial color="#C084FC" emissive="#7E22CE" emissiveIntensity={0.8} metalness={0.9} />
        </mesh>
      </group>

      {/* 5. Three Dimensional Reflection Mirrors (Worlds 1, 2, 3) */}

      {/* Mirror 1: Antiquity / World 1 (West: [-17, 3, 0]) */}
      <group position={[-17, 3, 0]}>
        {/* Ancient Stone Pedestal */}
        <mesh position={[0, -2, 0]} receiveShadow>
          <cylinderGeometry args={[2.8, 3.2, 2.5, 16]} />
          <meshStandardMaterial color="#292524" roughness={0.8} metalness={0.2} />
        </mesh>
        {/* Ornate Gold Runic Frame */}
        <mesh>
          <torusGeometry args={[3.2, 0.35, 16, 32]} />
          <meshStandardMaterial color="#F5B942" emissive="#B45309" emissiveIntensity={0.6} metalness={0.8} />
        </mesh>
        {/* Shimmering Timeline Veil */}
        <mesh ref={mirrorRef1}>
          <circleGeometry args={[3.0, 32]} />
          <meshStandardMaterial
            color="#F59E0B"
            emissive="#B45309"
            emissiveIntensity={0.8}
            roughness={0.1}
            metalness={0.4}
            transparent
            opacity={0.75}
          />
        </mesh>
        {/* Floating ancient runic crystal */}
        <mesh position={[0, 4.2, 0]}>
          <octahedronGeometry args={[0.7]} />
          <meshStandardMaterial color="#FBBF24" emissive="#D97706" emissiveIntensity={1.2} />
        </mesh>
      </group>

      {/* Mirror 2: Cybernetic Present / World 2 (East: [17, 3, 0]) */}
      <group position={[17, 3, 0]}>
        {/* Futuristic Titanium Pedestal */}
        <mesh position={[0, -2, 0]} receiveShadow>
          <cylinderGeometry args={[2.8, 3.2, 2.5, 16]} />
          <meshStandardMaterial color="#1E293B" roughness={0.3} metalness={0.8} />
        </mesh>
        {/* Cyan Cybernetic Frame */}
        <mesh>
          <torusGeometry args={[3.2, 0.35, 16, 32]} />
          <meshStandardMaterial color="#00D9FF" emissive="#0284C7" emissiveIntensity={0.8} metalness={0.8} />
        </mesh>
        {/* Holographic Cyan Timeline Veil */}
        <mesh ref={mirrorRef2}>
          <circleGeometry args={[3.0, 32]} />
          <meshStandardMaterial
            color="#38BDF8"
            emissive="#0284C7"
            emissiveIntensity={0.9}
            roughness={0.1}
            metalness={0.5}
            transparent
            opacity={0.75}
          />
        </mesh>
        {/* Floating quantum reactor crystal */}
        <mesh position={[0, 4.2, 0]}>
          <octahedronGeometry args={[0.7]} />
          <meshStandardMaterial color="#38BDF8" emissive="#0284C7" emissiveIntensity={1.2} />
        </mesh>
      </group>

      {/* Mirror 3: Fractured Future / World 3 (North-Back: [0, 8, -32]) */}
      <group position={[0, 8, -32]}>
        {/* Crystalline Singularity Frame */}
        <mesh>
          <torusGeometry args={[4.2, 0.4, 16, 32]} />
          <meshStandardMaterial color="#C084FC" emissive="#7E22CE" emissiveIntensity={0.9} metalness={0.8} />
        </mesh>
        {/* Deep Violet Singularity Veil */}
        <mesh ref={mirrorRef3}>
          <circleGeometry args={[4.0, 32]} />
          <meshStandardMaterial
            color="#A855F7"
            emissive="#6B21A8"
            emissiveIntensity={0.9}
            roughness={0.1}
            metalness={0.5}
            transparent
            opacity={0.75}
          />
        </mesh>
        {/* Floating Chronarch Shard */}
        <mesh position={[0, 5.5, 0]}>
          <octahedronGeometry args={[0.9]} />
          <meshStandardMaterial color="#C084FC" emissive="#9333EA" emissiveIntensity={1.4} />
        </mesh>
      </group>

      {/* 6. Floating Sanctuary Monoliths for Spatial Scale */}
      <mesh position={[-16, 7, -14]} rotation={[0.4, 0.3, 0.1]}>
        <boxGeometry args={[1.6, 9, 1.6]} />
        <meshStandardMaterial color="#1E1638" roughness={0.4} metalness={0.6} />
      </mesh>
      <mesh position={[16, 7, -14]} rotation={[-0.3, -0.4, -0.1]}>
        <boxGeometry args={[1.6, 9, 1.6]} />
        <meshStandardMaterial color="#1E1638" roughness={0.4} metalness={0.6} />
      </mesh>
      <mesh position={[-14, 5, 14]} rotation={[0.2, 0.5, -0.2]}>
        <boxGeometry args={[1.4, 7, 1.4]} />
        <meshStandardMaterial color="#1E1638" roughness={0.4} metalness={0.6} />
      </mesh>
      <mesh position={[14, 5, 14]} rotation={[-0.2, -0.5, 0.2]}>
        <boxGeometry args={[1.4, 7, 1.4]} />
        <meshStandardMaterial color="#1E1638" roughness={0.4} metalness={0.6} />
      </mesh>
    </group>
  );
}
