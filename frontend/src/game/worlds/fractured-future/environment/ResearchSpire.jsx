import React from 'react';
import * as THREE from 'three';

/**
 * World 3: Central Research Spire (Mission 5 Narrative Chamber)
 * Features:
 * - Monumental futuristic research tower rising 36m with vertical energy fissures
 * - Interior sanctum holding the Master Chrono Archive Terminal
 * - Portal archway leading through to the Boss Arena dais
 */
export default function ResearchSpire() {
  return (
    <group position={[0, 2, -44]}>
      {/* =========================================================================
          1. SPIRE FOUNDATION & SANCTUM FLOOR
      ========================================================================= */}
      {/* Octagonal Foundation Base */}
      <mesh position={[0, -0.2, 0]} receiveShadow>
        <cylinderGeometry args={[8.5, 9, 0.6, 8]} />
        <meshStandardMaterial color="#0c1224" roughness={0.4} metalness={0.7} />
      </mesh>

      {/* Sanctum Floor Circuit Ring */}
      <mesh position={[0, 0.12, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[6.5, 7.2, 8]} />
        <meshStandardMaterial color="#C084FC" emissive="#7047FF" emissiveIntensity={2.2} />
      </mesh>

      {/* =========================================================================
          2. SOARING SPIRE WALLS & ARCHITECTURAL ARCHES
      ========================================================================= */}
      {/* Main Spire Tower Shaft (Hexagonal hollow tower rising 36m) */}
      <mesh position={[0, 18, 0]} castShadow>
        <cylinderGeometry args={[6.5, 8.5, 36, 6, 1, true]} />
        <meshStandardMaterial
          color="#090e1f"
          roughness={0.3}
          metalness={0.85}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Exterior Vertical Neon Energy Fissures on Tower Faces */}
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const angle = (i * Math.PI) / 3;
        const x = Math.sin(angle) * 7.4;
        const z = Math.cos(angle) * 7.4;
        return (
          <mesh key={i} position={[x, 18, z]} rotation={[0, angle, 0]}>
            <planeGeometry args={[0.3, 32]} />
            <meshStandardMaterial
              color="#00D9FF"
              emissive="#00D9FF"
              emissiveIntensity={3.0}
              side={THREE.DoubleSide}
            />
          </mesh>
        );
      })}

      {/* =========================================================================
          3. INTERIOR HOLOGRAPHIC DATA COLUMNS & AMBIENT GLOW
      ========================================================================= */}
      {[-4, 4].map((x, i) => (
        <group key={i} position={[x, 3, 0]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.35, 0.35, 6, 12]} />
            <meshStandardMaterial color="#162340" roughness={0.3} metalness={0.8} />
          </mesh>
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[0.42, 0.42, 5.2, 12]} />
            <meshBasicMaterial color="#00D9FF" transparent opacity={0.35} />
          </mesh>
        </group>
      ))}

      {/* Internal Atmospheric Sanctum Lighting */}
      <pointLight position={[0, 5, 0]} color="#C084FC" intensity={18} distance={22} />
      <pointLight position={[0, 2, -3]} color="#00D9FF" intensity={12} distance={15} />

      {/* Gateway Arch Leading to Boss Dais at North (z = -7 relative to spire) */}
      <group position={[0, 0, -7]}>
        {[-2.5, 2.5].map((x, i) => (
          <mesh key={i} position={[x, 2.5, 0]} castShadow>
            <boxGeometry args={[0.8, 5, 0.8]} />
            <meshStandardMaterial color="#0c1224" roughness={0.3} metalness={0.8} />
          </mesh>
        ))}
        <mesh position={[0, 4.8, 0]} castShadow>
          <boxGeometry args={[5.2, 0.8, 0.8]} />
          <meshStandardMaterial color="#0c1224" roughness={0.3} metalness={0.8} />
        </mesh>
      </group>
    </group>
  );
}
