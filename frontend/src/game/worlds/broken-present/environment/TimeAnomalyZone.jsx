import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Time Anomaly Zone
 * Suspended anti-gravity debris, frozen concrete fragments,
 * and shimmering purple/cyan temporal distortion fields.
 */
export default function TimeAnomalyZone({ position = [0, 0, -8] }) {
  const debrisGroupRef = useRef();
  const anomalyParticlesRef = useRef();

  // Floating debris slabs
  const debrisPieces = useMemo(() => {
    return [
      { pos: [-6, 3.5, -4], rot: [0.4, 0.2, 0.6], scale: [2.5, 0.5, 2.0] },
      { pos: [5, 4.2, -6], rot: [-0.3, 0.5, -0.2], scale: [3.0, 0.6, 1.8] },
      { pos: [-3, 6.0, 2], rot: [0.2, -0.4, 0.5], scale: [2.2, 0.4, 2.2] },
      { pos: [6, 2.8, 3], rot: [0.5, 0.1, -0.4], scale: [1.8, 0.5, 1.6] },
      { pos: [0, 7.5, -5], rot: [-0.2, 0.3, 0.4], scale: [4.0, 0.7, 2.5] }
    ];
  }, []);

  // Floating upward anti-gravity particle motes
  const particleCount = 120;
  const [positions, speeds] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const spd = new Float32Array(particleCount);
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 25;
      pos[i * 3 + 1] = Math.random() * 12;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20;
      spd[i] = 0.5 + Math.random() * 1.5;
    }
    return [pos, spd];
  }, []);

  useFrame((state, delta) => {
    // Gentle floating bob for suspended debris
    if (debrisGroupRef.current) {
      debrisGroupRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.5) * 0.2;
    }

    // Upward anti-gravity particles
    if (anomalyParticlesRef.current) {
      const posArray = anomalyParticlesRef.current.geometry.attributes.position.array;
      for (let i = 0; i < particleCount; i++) {
        posArray[i * 3 + 1] += speeds[i] * delta;
        if (posArray[i * 3 + 1] > 12) {
          posArray[i * 3 + 1] = 0.2;
        }
      }
      anomalyParticlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group position={position}>
      {/* Distortion Field Floor Grid */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <planeGeometry args={[26, 20]} />
        <meshBasicMaterial
          color="#7047FF"
          wireframe={true}
          transparent={true}
          opacity={0.35}
        />
      </mesh>

      {/* Floating Anti-Gravity Debris Slabs */}
      <group ref={debrisGroupRef}>
        {debrisPieces.map((d, idx) => (
          <mesh
            key={idx}
            position={d.pos}
            rotation={d.rot}
            castShadow
            receiveShadow
          >
            <boxGeometry args={d.scale} />
            <meshStandardMaterial
              color="#131b2e"
              roughness={0.7}
              metalness={0.5}
            />
          </mesh>
        ))}
      </group>

      {/* Upward Floating Anti-Gravity Particles */}
      <points ref={anomalyParticlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.16}
          color="#C084FC"
          transparent={true}
          opacity={0.8}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Ambient Anomaly Light */}
      <pointLight color="#7047FF" intensity={25} distance={20} position={[0, 4, 0]} />
    </group>
  );
}
