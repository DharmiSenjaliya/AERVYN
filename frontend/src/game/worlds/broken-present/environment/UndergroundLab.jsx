import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Underground Research Laboratory Environment
 * Subterranean chamber holding quantum computers, server banks,
 * holographic data tables, and high-voltage conduit channels.
 */
export default function UndergroundLab({ position = [0, 0, -26] }) {
  const holoTableRef = useRef();

  useFrame((state, delta) => {
    if (holoTableRef.current) {
      holoTableRef.current.rotation.y += delta * 0.8;
    }
  });

  return (
    <group position={position}>
      {/* Bunker Flooring Plate */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[26, 20]} />
        <meshStandardMaterial color="#0a0f1d" roughness={0.5} metalness={0.7} />
      </mesh>

      {/* Lab Perimeter Enclosure Walls */}
      {/* Back Wall */}
      <mesh position={[0, 4, -10]} receiveShadow>
        <boxGeometry args={[26, 8, 1]} />
        <meshStandardMaterial color="#0f172a" roughness={0.6} metalness={0.5} />
      </mesh>
      {/* West Wall */}
      <mesh position={[-13, 4, 0]} receiveShadow>
        <boxGeometry args={[1, 8, 20]} />
        <meshStandardMaterial color="#0f172a" roughness={0.6} metalness={0.5} />
      </mesh>
      {/* East Wall */}
      <mesh position={[13, 4, 0]} receiveShadow>
        <boxGeometry args={[1, 8, 20]} />
        <meshStandardMaterial color="#0f172a" roughness={0.6} metalness={0.5} />
      </mesh>

      {/* --- SERVER RACKS (West Side) --- */}
      {[-6, -3, 0, 3, 6].map((z, idx) => (
        <group key={`server_${idx}`} position={[-11.5, 2.5, z]}>
          <mesh castShadow>
            <boxGeometry args={[1.2, 5, 2]} />
            <meshStandardMaterial color="#0b101c" roughness={0.3} metalness={0.9} />
          </mesh>
          {/* LED Indicator Strips */}
          <mesh position={[0.61, 0, 0]}>
            <planeGeometry args={[0.05, 4.4]} />
            <meshBasicMaterial color={idx % 2 === 0 ? '#00D9FF' : '#7047FF'} />
          </mesh>
        </group>
      ))}

      {/* --- HIGH-VOLTAGE CONDUIT PIPES (Ceiling) --- */}
      {[-4, 0, 4].map((x) => (
        <mesh key={`pipe_${x}`} position={[x, 7.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.22, 0.22, 20, 16]} />
          <meshStandardMaterial color="#1e293b" roughness={0.4} metalness={0.8} />
        </mesh>
      ))}

      {/* --- CENTRAL HOLOGRAPHIC PROJECTION TABLE --- */}
      <group position={[0, 0, 0]}>
        {/* Table Base */}
        <mesh position={[0, 0.5, 0]} castShadow>
          <cylinderGeometry args={[2.2, 2.6, 1.0, 24]} />
          <meshStandardMaterial color="#111827" roughness={0.4} metalness={0.8} />
        </mesh>

        {/* Holo Projector Glass Inset */}
        <mesh position={[0, 1.02, 0]}>
          <circleGeometry args={[2.0, 24]} />
          <meshBasicMaterial color="#00D9FF" opacity={0.7} transparent={true} side={THREE.DoubleSide} />
        </mesh>

        {/* Floating Rotating Hologram (Temporal Map Wireframe) */}
        <mesh ref={holoTableRef} position={[0, 2.2, 0]}>
          <dodecahedronGeometry args={[0.9, 0]} />
          <meshBasicMaterial color="#00D9FF" wireframe={true} />
        </mesh>

        <pointLight color="#00D9FF" intensity={20} distance={12} position={[0, 2.5, 0]} />
      </group>
    </group>
  );
}
