import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Forest Terrain, Mountain Peaks, and Atmospheric Particles
 */
export default function ForestTerrain() {
  const particlesRef = useRef();

  // Floating mystical energy spores / dust motes
  const particleCount = 200;
  const [positions, phases] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const ph = new Float32Array(particleCount);
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 60;
      pos[i * 3 + 1] = Math.random() * 12 + 0.5;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 60;
      ph[i] = Math.random() * Math.PI * 2;
    }
    return [pos, ph];
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array;
      const t = state.clock.elapsedTime;
      for (let i = 0; i < particleCount; i++) {
        // Floating gentle undulation
        positions[i * 3 + 1] += Math.sin(t + phases[i]) * 0.005;
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  // Procedural ancient pine trees around boundary
  const treeLocations = [
    [-20, -10], [-22, -4], [-24, 6], [-18, 14], [-21, 20],
    [20, -10], [22, -4], [24, 6], [18, 14], [21, 20],
    [-15, 26], [0, 28], [15, 26]
  ];

  return (
    <group>
      {/* Outer Mountain Horizon Silhouettes */}
      {[-35, 0, 35].map((x, i) => (
        <mesh key={i} position={[x, 15, -45]} rotation={[0, (i - 1) * 0.2, 0]}>
          <coneGeometry args={[25, 30, 5]} />
          <meshStandardMaterial color="#070c1a" roughness={0.95} />
        </mesh>
      ))}

      {/* Pine Trees */}
      {treeLocations.map(([x, z], i) => (
        <group key={i} position={[x, 0, z]}>
          {/* Trunk */}
          <mesh position={[0, 2, 0]} castShadow>
            <cylinderGeometry args={[0.3, 0.5, 4, 8]} />
            <meshStandardMaterial color="#1f1610" roughness={0.9} />
          </mesh>
          {/* Foliage Cones */}
          <mesh position={[0, 5, 0]} castShadow>
            <coneGeometry args={[2.5, 4, 7]} />
            <meshStandardMaterial color="#0c1e28" roughness={0.8} />
          </mesh>
          <mesh position={[0, 7.5, 0]} castShadow>
            <coneGeometry args={[1.8, 3.5, 7]} />
            <meshStandardMaterial color="#0f2634" roughness={0.8} />
          </mesh>
        </group>
      ))}

      {/* Ambient Floating Spores / Fireflies */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.16}
          color="#00D9FF"
          transparent={true}
          opacity={0.7}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}
