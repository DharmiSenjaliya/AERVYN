import React, { useEffect } from 'react';
import * as THREE from 'three';
import CollisionSystem from '../../../systems/CollisionSystem';

/**
 * World 1: Castle Ruins Environment
 * Detailed stone architecture, ruined colonnades, crumbling archways,
 * and registered collision boxes.
 */
export default function CastleRuins() {
  useEffect(() => {
    // Register structural bounding boxes into CollisionSystem
    CollisionSystem.clear();

    // Courtyard Outer Wall boundaries
    CollisionSystem.registerBoxCollider('wall_north', -25, 25, -35, -33);
    CollisionSystem.registerBoxCollider('wall_south', -25, 25, 20, 22);
    CollisionSystem.registerBoxCollider('wall_west', -26, -24, -35, 22);
    CollisionSystem.registerBoxCollider('wall_east', 24, 26, -35, 22);

    // Left Colonnade Columns
    [-10, -6, -2].forEach((z, i) => {
      CollisionSystem.registerBoxCollider(`col_left_${i}`, -9, -7, z - 1, z + 1);
    });

    // Right Colonnade Columns
    [-10, -6, -2].forEach((z, i) => {
      CollisionSystem.registerBoxCollider(`col_right_${i}`, 7, 9, z - 1, z + 1);
    });

    // Inner Sanctum Archway Dividers (beside the central gate)
    CollisionSystem.registerBoxCollider('gate_wall_left', -25, -3, -19, -17);
    CollisionSystem.registerBoxCollider('gate_wall_right', 3, 25, -19, -17);

    return () => CollisionSystem.clear();
  }, []);

  return (
    <group>
      {/* --- COURTYARD MAIN FLOOR --- */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[70, 70]} />
        <meshStandardMaterial color="#11192e" roughness={0.85} metalness={0.15} />
      </mesh>

      {/* Flagstone Tile Pathway */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, -5]} receiveShadow>
        <planeGeometry args={[6, 32]} />
        <meshStandardMaterial color="#1a243d" roughness={0.7} metalness={0.2} />
      </mesh>

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
      <mesh position={[-14, 4, -18]} castShadow receiveShadow>
        <boxGeometry args={[22, 8, 2]} />
        <meshStandardMaterial color="#182239" roughness={0.9} />
      </mesh>

      {/* Right Wall Segment */}
      <mesh position={[14, 4, -18]} castShadow receiveShadow>
        <boxGeometry args={[22, 8, 2]} />
        <meshStandardMaterial color="#182239" roughness={0.9} />
      </mesh>

      {/* Gate Top Arch Header */}
      <mesh position={[0, 7.5, -18]} castShadow>
        <boxGeometry args={[7, 2.5, 2.4]} />
        <meshStandardMaterial color="#212c47" roughness={0.8} />
      </mesh>

      {/* --- RUNIC GLYPH STONES & BRAZIERS --- */}
      {[-4, 4].map((x, i) => (
        <group key={i} position={[x, 0, -16]}>
          {/* Brazier Pedestal */}
          <mesh position={[0, 1, 0]} castShadow>
            <cylinderGeometry args={[0.4, 0.5, 2, 8]} />
            <meshStandardMaterial color="#10182b" roughness={0.8} metalness={0.5} />
          </mesh>
          {/* Blue Eternal Flame Glow */}
          <mesh position={[0, 2.2, 0]}>
            <sphereGeometry args={[0.22, 8, 8]} />
            <meshBasicMaterial color="#00D9FF" />
          </mesh>
          <pointLight color="#00D9FF" intensity={15} distance={10} position={[0, 2.3, 0]} />
        </group>
      ))}
    </group>
  );
}
