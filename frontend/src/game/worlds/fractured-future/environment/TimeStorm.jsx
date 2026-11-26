import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * World 3 Atmospheric Time Storm & Cosmic Vortex
 * Features:
 * - Upward swirling temporal energy particles in blue, violet, and gold
 * - Rotating celestial dimensional vortex ring high above the world
 * - Dynamic storm lightning flash simulation
 */
export default function TimeStorm() {
  const particlesRef = useRef();
  const vortexRing1Ref = useRef();
  const vortexRing2Ref = useRef();
  const lightningLightRef = useRef();

  // Create 60 particles
  const particleCount = 60;
  const initialPositions = useRef(
    new Float32Array(
      Array.from({ length: particleCount * 3 }, () => (Math.random() - 0.5) * 80)
    )
  );

  useFrame((state, delta) => {
    const time = state.clock.elapsedTime;

    // Rotate vortex rings in the sky
    if (vortexRing1Ref.current) {
      vortexRing1Ref.current.rotation.z += delta * 0.12;
    }
    if (vortexRing2Ref.current) {
      vortexRing2Ref.current.rotation.z -= delta * 0.18;
    }

    // Animate particles slowly rising and swirling
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array;
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        positions[i3 + 1] += delta * (1.2 + (i % 3) * 0.8); // Rise upward
        if (positions[i3 + 1] > 35) {
          positions[i3 + 1] = -5; // Reset to beneath islands
        }
        positions[i3] += Math.sin(time + i) * 0.04;
        positions[i3 + 2] += Math.cos(time + i) * 0.04;
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }

    // Random lightning flash in the storm clouds
    if (lightningLightRef.current) {
      const flashChance = Math.sin(time * 3) * Math.cos(time * 7);
      if (flashChance > 0.92) {
        lightningLightRef.current.intensity = 24 + Math.random() * 20;
      } else {
        lightningLightRef.current.intensity = 2.0;
      }
    }
  });

  return (
    <group>
      {/* Dynamic Storm Lightning Light */}
      <pointLight
        ref={lightningLightRef}
        position={[0, 40, -20]}
        color="#C084FC"
        intensity={2.0}
        distance={120}
      />

      {/* High Overhead Dimensional Vortex Rings (Sky Backdrop at y = 55) */}
      <group position={[0, 55, -20]} rotation={[1.1, 0, 0]}>
        <mesh ref={vortexRing1Ref}>
          <ringGeometry args={[30, 36, 48]} />
          <meshBasicMaterial
            color="#7047FF"
            transparent
            opacity={0.35}
            side={THREE.DoubleSide}
          />
        </mesh>
        <mesh ref={vortexRing2Ref} position={[0, 0, -1]}>
          <ringGeometry args={[20, 26, 36]} />
          <meshBasicMaterial
            color="#00D9FF"
            transparent
            opacity={0.45}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>

      {/* Upward Drifting Temporal Energy Particles */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particleCount}
            array={initialPositions.current}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.45}
          color="#00D9FF"
          transparent
          opacity={0.75}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Deep Void Fog Mesh (Faint bottom glow) */}
      <mesh position={[0, -15, -10]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[140, 140]} />
        <meshBasicMaterial color="#090518" transparent opacity={0.8} />
      </mesh>
    </group>
  );
}
