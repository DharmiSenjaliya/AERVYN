import React, { useEffect } from 'react';
import * as THREE from 'three';
import CollisionSystem from '../../../systems/CollisionSystem';

/**
 * World 1: Castle Ruins Environment
 * Enhanced ancient stone architecture:
 * - Flagstone courtyard with glowing runic energy grooves
 * - Ancient stone bridge crossing a mystical blue energy stream
 * - Colonnades, arches, parapets, braziers, and solid collision bounds
 */
export default function CastleRuins() {
  useEffect(() => {
    // Register structural bounding boxes into CollisionSystem
    CollisionSystem.clear();

    // Courtyard Outer Wall boundaries
    CollisionSystem.registerBoxCollider('wall_north', -28, 28, -36, -34);
    CollisionSystem.registerBoxCollider('wall_south_left', -28, -5, 20, 22);
    CollisionSystem.registerBoxCollider('wall_south_right', 5, 28, 20, 22);
    CollisionSystem.registerBoxCollider('wall_west', -28, -26, -36, 22);
    CollisionSystem.registerBoxCollider('wall_east', 26, 28, -36, 22);

    // Left Colonnade Columns
    [-10, -6, -2, 2].forEach((z, i) => {
      CollisionSystem.registerBoxCollider(`col_left_${i}`, -9, -7, z - 1, z + 1);
    });

    // Right Colonnade Columns
    [-10, -6, -2, 2].forEach((z, i) => {
      CollisionSystem.registerBoxCollider(`col_right_${i}`, 7, 9, z - 1, z + 1);
    });

    // Inner Sanctum Archway Dividers (beside the central gate)
    CollisionSystem.registerBoxCollider('gate_wall_left', -26, -3.5, -19, -17);
    CollisionSystem.registerBoxCollider('gate_wall_right', 3.5, 26, -19, -17);

    // Stone Bridge Curbs (protects player from falling into stream)
    CollisionSystem.registerBoxCollider('bridge_curb_left', -4.2, -3.6, 11, 19);
    CollisionSystem.registerBoxCollider('bridge_curb_right', 3.6, 4.2, 11, 19);

    return () => CollisionSystem.clear();
  }, []);

  return (
    <group>
      {/* --- COURTYARD MAIN FLOOR --- */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, -7]} receiveShadow>
        <planeGeometry args={[56, 56]} />
        <meshStandardMaterial color="#11192e" roughness={0.85} metalness={0.15} />
      </mesh>

      {/* --- MYSTICAL SHIMMERING STREAM (at South Entrance) --- */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.2, 15]} receiveShadow>
        <planeGeometry args={[65, 8]} />
        <meshStandardMaterial
          color="#062846"
          emissive="#005588"
          emissiveIntensity={0.6}
          roughness={0.1}
          metalness={0.9}
        />
      </mesh>
      <pointLight color="#00D9FF" intensity={15} distance={12} position={[0, 0.4, 15]} />

      {/* --- ANCIENT STONE BRIDGE (crossing the stream) --- */}
      <group position={[0, 0, 15]}>
        {/* Bridge Pavement */}
        <mesh position={[0, 0.05, 0]} receiveShadow castShadow>
          <boxGeometry args={[7.2, 0.3, 8.4]} />
          <meshStandardMaterial color="#222e4c" roughness={0.7} metalness={0.25} />
        </mesh>
        {/* Left Stone Parapet Curb */}
        <mesh position={[-3.8, 0.5, 0]} castShadow>
          <boxGeometry args={[0.5, 0.7, 8.4]} />
          <meshStandardMaterial color="#18233b" roughness={0.8} />
        </mesh>
        {/* Right Stone Parapet Curb */}
        <mesh position={[3.8, 0.5, 0]} castShadow>
          <boxGeometry args={[0.5, 0.7, 8.4]} />
          <meshStandardMaterial color="#18233b" roughness={0.8} />
        </mesh>
      </group>

      {/* --- CENTRAL RUNIC PATHWAY (Leading to Pedestal & Gate) --- */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, -5]} receiveShadow>
        <planeGeometry args={[5.5, 30]} />
        <meshStandardMaterial color="#19243d" roughness={0.75} metalness={0.2} />
      </mesh>

      {/* Glowing Runic Ground Lines */}
      {[-8, -4, 0, 4, 8].map((z, idx) => (
        <mesh key={`runic_${idx}`} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, z]}>
          <planeGeometry args={[4.2, 0.12]} />
          <meshBasicMaterial color="#00D9FF" transparent={true} opacity={0.65} />
        </mesh>
      ))}

      {/* --- COLONNADES (Pillars & Lintels) --- */}
      {/* West Colonnade */}
      {[-10, -6, -2, 2].map((z, idx) => (
        <group key={`col_west_${idx}`} position={[-8, 0, z]}>
          <mesh position={[0, 3.5, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.7, 0.85, 7, 16]} />
            <meshStandardMaterial color="#1c2742" roughness={0.9} />
          </mesh>
          <mesh position={[0, 7.2, 0]} castShadow>
            <boxGeometry args={[1.8, 0.5, 1.8]} />
            <meshStandardMaterial color="#293754" roughness={0.8} />
          </mesh>
        </group>
      ))}

      {/* East Colonnade */}
      {[-10, -6, -2, 2].map((z, idx) => (
        <group key={`col_east_${idx}`} position={[8, 0, z]}>
          <mesh position={[0, 3.5, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.7, 0.85, 7, 16]} />
            <meshStandardMaterial color="#1c2742" roughness={0.9} />
          </mesh>
          <mesh position={[0, 7.2, 0]} castShadow>
            <boxGeometry args={[1.8, 0.5, 1.8]} />
            <meshStandardMaterial color="#293754" roughness={0.8} />
          </mesh>
        </group>
      ))}

      {/* Colonnade Lintel Beams */}
      <mesh position={[-8, 7.6, -4]} castShadow>
        <boxGeometry args={[1.6, 0.6, 15]} />
        <meshStandardMaterial color="#1c2742" roughness={0.9} />
      </mesh>
      <mesh position={[8, 7.6, -4]} castShadow>
        <boxGeometry args={[1.6, 0.6, 15]} />
        <meshStandardMaterial color="#1c2742" roughness={0.9} />
      </mesh>

      {/* --- INNER SANCTUM DIVIDER WALL --- */}
      {/* Left Wall Segment */}
      <mesh position={[-15, 4, -18]} castShadow receiveShadow>
        <boxGeometry args={[23, 8, 2]} />
        <meshStandardMaterial color="#182239" roughness={0.9} />
      </mesh>

      {/* Right Wall Segment */}
      <mesh position={[15, 4, -18]} castShadow receiveShadow>
        <boxGeometry args={[23, 8, 2]} />
        <meshStandardMaterial color="#182239" roughness={0.9} />
      </mesh>

      {/* Gate Top Arch Header */}
      <mesh position={[0, 7.5, -18]} castShadow>
        <boxGeometry args={[7.2, 2.5, 2.4]} />
        <meshStandardMaterial color="#212c47" roughness={0.8} />
      </mesh>

      {/* --- RUNIC GLYPH STONES & BRAZIERS --- */}
      {[-4.5, 4.5].map((x, i) => (
        <group key={i} position={[x, 0, -16]}>
          <mesh position={[0, 1, 0]} castShadow>
            <cylinderGeometry args={[0.4, 0.5, 2, 8]} />
            <meshStandardMaterial color="#10182b" roughness={0.8} metalness={0.5} />
          </mesh>
          <mesh position={[0, 2.2, 0]}>
            <sphereGeometry args={[0.22, 8, 8]} />
            <meshBasicMaterial color="#00D9FF" />
          </mesh>
          <pointLight color="#00D9FF" intensity={15} distance={10} position={[0, 2.3, 0]} />
        </group>
      ))}

      {/* Steps leading to Time Portal Dais */}
      {[0, 1, 2].map((stepIdx) => (
        <mesh key={`step_${stepIdx}`} position={[0, 0.15 * (stepIdx + 1), -27 - stepIdx * 0.8]} receiveShadow>
          <boxGeometry args={[6.5, 0.3, 0.8]} />
          <meshStandardMaterial color="#19253d" roughness={0.8} />
        </mesh>
      ))}
    </group>
  );
}
