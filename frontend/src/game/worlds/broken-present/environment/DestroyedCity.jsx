import React, { useEffect } from 'react';
import * as THREE from 'three';
import CollisionSystem from '../../../systems/CollisionSystem';

/**
 * World 2: The Broken Present - Destroyed Futuristic City Environment
 * - Shattered elevated highway with asphalt fissures
 * - Ruined skyscrapers, steel rebar, and collapsed sky-bridges
 * - Flickering neon advertisements and cybernetic debris
 * - Registered collision bounding boxes
 */
export default function DestroyedCity() {
  useEffect(() => {
    // Register World 2 collision boundaries into CollisionSystem
    CollisionSystem.clear();

    // City Perimeter Bounds
    CollisionSystem.registerBoxCollider('city_wall_north', -30, 30, -42, -40);
    CollisionSystem.registerBoxCollider('city_wall_south', -30, 30, 22, 24);
    CollisionSystem.registerBoxCollider('city_wall_west', -30, -28, -42, 24);
    CollisionSystem.registerBoxCollider('city_wall_east', 28, 30, -42, 24);

    // Collapsed Skyscraper Bases (West & East)
    CollisionSystem.registerBoxCollider('bldg_west_1', -26, -14, -2, 10);
    CollisionSystem.registerBoxCollider('bldg_west_2', -26, -14, -26, -14);
    CollisionSystem.registerBoxCollider('bldg_east_1', 14, 26, -2, 10);
    CollisionSystem.registerBoxCollider('bldg_east_2', 14, 26, -26, -14);

    // Highway Guardrails
    CollisionSystem.registerBoxCollider('rail_west', -5.2, -4.8, 0, 20);
    CollisionSystem.registerBoxCollider('rail_east', 4.8, 5.2, 0, 20);

    return () => CollisionSystem.clear();
  }, []);

  return (
    <group>
      {/* --- SHATTERED HIGHWAY ROADWAY --- */}
      {/* Main Highway Segment */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 10]} receiveShadow>
        <planeGeometry args={[10, 26]} />
        <meshStandardMaterial color="#0b101c" roughness={0.7} metalness={0.4} />
      </mesh>

      {/* Cracked Road Stripes */}
      {[-2, 2, 6, 10, 14, 18].map((z, idx) => (
        <mesh key={`stripe_${idx}`} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, z]}>
          <planeGeometry args={[0.3, 1.8]} />
          <meshBasicMaterial color="#00D9FF" opacity={0.6} transparent={true} />
        </mesh>
      ))}

      {/* Highway Guardrails */}
      <mesh position={[-5, 0.6, 10]} castShadow>
        <boxGeometry args={[0.3, 1.2, 26]} />
        <meshStandardMaterial color="#1a243a" roughness={0.5} metalness={0.7} />
      </mesh>
      <mesh position={[5, 0.6, 10]} castShadow>
        <boxGeometry args={[0.3, 1.2, 26]} />
        <meshStandardMaterial color="#1a243a" roughness={0.5} metalness={0.7} />
      </mesh>

      {/* Concrete Highway Support Pillars (Below) */}
      {[-4, 4].map((x) => (
        <mesh key={`pillar_${x}`} position={[x, -4, 10]} receiveShadow>
          <cylinderGeometry args={[1.2, 1.4, 8, 16]} />
          <meshStandardMaterial color="#121a2c" roughness={0.9} />
        </mesh>
      ))}

      {/* --- CENTRAL PLAZA / METROPOLIS GROUND --- */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, -12]} receiveShadow>
        <planeGeometry args={[60, 48]} />
        <meshStandardMaterial color="#070c17" roughness={0.85} metalness={0.3} />
      </mesh>

      {/* --- RUINED SKYSCRAPERS --- */}
      {/* Skyscraper 1 (West - Ruined Tower with exposed rebar) */}
      <group position={[-20, 16, 4]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[11, 32, 11]} />
          <meshStandardMaterial color="#0e172a" roughness={0.6} metalness={0.6} />
        </mesh>
        {/* Flickering Neon Cyber Sign */}
        <mesh position={[5.6, 6, 0]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[7, 2.2]} />
          <meshStandardMaterial
            color="#00D9FF"
            emissive="#00D9FF"
            emissiveIntensity={1.8}
            side={THREE.DoubleSide}
          />
        </mesh>
        <pointLight color="#00D9FF" intensity={18} distance={15} position={[6, 6, 0]} />
      </group>

      {/* Skyscraper 2 (East - Fractured Monolith) */}
      <group position={[20, 20, 4]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[11, 40, 11]} />
          <meshStandardMaterial color="#0c1426" roughness={0.5} metalness={0.7} />
        </mesh>
        {/* Purple Neon Tech Ad */}
        <mesh position={[-5.6, 8, 0]} rotation={[0, -Math.PI / 2, 0]}>
          <planeGeometry args={[8, 3]} />
          <meshStandardMaterial
            color="#7047FF"
            emissive="#7047FF"
            emissiveIntensity={2.2}
            side={THREE.DoubleSide}
          />
        </mesh>
        <pointLight color="#7047FF" intensity={22} distance={18} position={[-6, 8, 0]} />
      </group>

      {/* Skyscraper 3 (Northwest Research Tower) */}
      <group position={[-20, 14, -20]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[11, 28, 11]} />
          <meshStandardMaterial color="#0b1222" roughness={0.6} metalness={0.6} />
        </mesh>
        {/* Warning Hologram Sign */}
        <mesh position={[5.6, 2, 0]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[6, 1.8]} />
          <meshStandardMaterial
            color="#EF4444"
            emissive="#EF4444"
            emissiveIntensity={1.5}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>

      {/* Skyscraper 4 (Northeast Tech Spire) */}
      <group position={[20, 24, -20]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[11, 48, 11]} />
          <meshStandardMaterial color="#0c1426" roughness={0.4} metalness={0.8} />
        </mesh>
        <mesh position={[-5.6, 12, 0]} rotation={[0, -Math.PI / 2, 0]}>
          <planeGeometry args={[8, 4]} />
          <meshStandardMaterial
            color="#00D9FF"
            emissive="#00D9FF"
            emissiveIntensity={1.8}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>

      {/* --- COLLAPSED HIGHWAY DEBRIS & BROKEN GIRDERS --- */}
      {/* Broken Girder Span */}
      <mesh position={[-2, 1.5, 2]} rotation={[0.2, 0.4, 0.5]} castShadow>
        <boxGeometry args={[1.2, 0.8, 8]} />
        <meshStandardMaterial color="#1f293d" roughness={0.7} metalness={0.8} />
      </mesh>

      {/* Abandoned Futuristic Transport Vehicle */}
      <group position={[3.2, 0.8, 5]} rotation={[0, -0.3, 0]}>
        <mesh castShadow>
          <boxGeometry args={[2.2, 1.2, 4.4]} />
          <meshStandardMaterial color="#1a253c" roughness={0.4} metalness={0.8} />
        </mesh>
        {/* Broken Cyber Lights */}
        <mesh position={[0, 0.2, 2.22]}>
          <boxGeometry args={[1.8, 0.2, 0.05]} />
          <meshBasicMaterial color="#00D9FF" opacity={0.4} transparent={true} />
        </mesh>
      </group>
    </group>
  );
}
