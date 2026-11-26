import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import CollisionSystem from '../../../systems/CollisionSystem';

/**
 * World 3: Floating Islands & Broken Celestial Sky Bridges
 * Features:
 * - 5 Celestial floating landmasses suspended over the dimensional abyss
 * - Hexagonal paved futuristic plazas with glowing cyan & purple energy trims
 * - Broken metallic skywalk bridges with safety energy rails
 * - Dynamically bobbing anti-gravity stepping platforms
 * - Registered colliders to prevent falling and guide traversal
 */
export default function FloatingIslands() {
  const bobbingPadsRef = useRef([]);

  useEffect(() => {
    // Register colliders for islands and major obstacles
    CollisionSystem.clear();

    // 1. Landing Sky Island Center [0, 0, 22] (bounds approx: x: -10 to 10, z: 12 to 32)
    // Register perimeter barriers to prevent slipping off
    CollisionSystem.registerCollider('landing_island_north_guard', {
      min: [-11, -1, 31],
      max: [11, 4, 33]
    });
    CollisionSystem.registerCollider('landing_island_east_guard', {
      min: [9.5, -1, 13],
      max: [11, 4, 31]
    });
    CollisionSystem.registerCollider('landing_island_west_guard', {
      min: [-11, -1, 13],
      max: [-9.5, 4, 31]
    });

    // 2. Sky City Promenade Island [-12, 1, 6]
    CollisionSystem.registerCollider('promenade_back_guard', {
      min: [-22, 0, 14],
      max: [-4, 5, 16]
    });
    CollisionSystem.registerCollider('promenade_west_guard', {
      min: [-22, 0, -2],
      max: [-20, 5, 14]
    });

    // 3. Central Ruins Hub Island [0, 1.5, -6]
    CollisionSystem.registerCollider('hub_east_wall', {
      min: [11, 0, -14],
      max: [13, 6, 2]
    });
    CollisionSystem.registerCollider('hub_west_wall', {
      min: [-13, 0, -14],
      max: [-11, 6, 2]
    });

    return () => {
      CollisionSystem.clear();
    };
  }, []);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    // Animate levitating stepping stones
    bobbingPadsRef.current.forEach((mesh, idx) => {
      if (mesh) {
        mesh.position.y = mesh.userData.baseY + Math.sin(time * 2 + idx * 1.3) * 0.35;
      }
    });
  });

  return (
    <group>
      {/* =========================================================================
          1. MAIN LANDING SKY ISLAND (Spawn Zone & Chrono Beacon)
          Position: [0, 0, 22]
      ========================================================================= */}
      <group position={[0, 0, 22]}>
        {/* Main Floating Island Underside (Inverted Celestial Rock Cone) */}
        <mesh position={[0, -5, 0]} castShadow receiveShadow>
          <coneGeometry args={[11, 10, 7]} />
          <meshStandardMaterial color="#0a0c1a" roughness={0.9} metalness={0.2} />
        </mesh>

        {/* Top Paved Hexagonal Surface */}
        <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <cylinderGeometry args={[10.5, 10.5, 0.6, 6]} />
          <meshStandardMaterial color="#101528" roughness={0.35} metalness={0.7} />
        </mesh>

        {/* Energy Inlay Border Rings */}
        <mesh position={[0, 0.36, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[9.5, 10.2, 6]} />
          <meshStandardMaterial
            color="#7047FF"
            emissive="#7047FF"
            emissiveIntensity={1.8}
            roughness={0.1}
          />
        </mesh>

        {/* Central Arrival Portal Dais Base */}
        <mesh position={[0, 0.45, 0]} receiveShadow>
          <cylinderGeometry args={[4.5, 4.8, 0.4, 24]} />
          <meshStandardMaterial color="#17223b" roughness={0.3} metalness={0.8} />
        </mesh>

        <mesh position={[0, 0.66, 0]}>
          <ringGeometry args={[3.6, 4.2, 24]} />
          <meshStandardMaterial
            color="#00D9FF"
            emissive="#00D9FF"
            emissiveIntensity={2.2}
          />
        </mesh>

        {/* Floating Decorative Obelisks around landing perimeter */}
        {[-7, 7].map((x, i) => (
          <group key={i} position={[x, 1.8, 4]}>
            <mesh castShadow>
              <octahedronGeometry args={[0.7, 0]} />
              <meshStandardMaterial
                color="#00D9FF"
                emissive="#7047FF"
                emissiveIntensity={1.5}
                roughness={0.2}
                metalness={0.9}
              />
            </mesh>
            <mesh position={[0, -1.8, 0]}>
              <cylinderGeometry args={[0.4, 0.5, 1.2, 8]} />
              <meshStandardMaterial color="#111728" roughness={0.5} />
            </mesh>
          </group>
        ))}
      </group>

      {/* =========================================================================
          2. BROKEN SKY BRIDGE (Connecting Landing Island to Promenade)
          Spans [0, 0, 14] to [-12, 1, 6]
      ========================================================================= */}
      <group>
        {/* Intact Bridge Section A */}
        <mesh position={[-2.5, 0.3, 15]} rotation={[0, 0.65, 0]} castShadow receiveShadow>
          <boxGeometry args={[3.2, 0.4, 7.5]} />
          <meshStandardMaterial color="#131c33" roughness={0.4} metalness={0.8} />
        </mesh>

        {/* Glowing Bridge Center Stripe */}
        <mesh position={[-2.5, 0.52, 15]} rotation={[-Math.PI / 2, 0.65, 0]}>
          <planeGeometry args={[0.3, 7.2]} />
          <meshStandardMaterial color="#00D9FF" emissive="#00D9FF" emissiveIntensity={2.5} />
        </mesh>

        {/* Levitating Broken Bridge Fragments (Stepping Stones) */}
        {[
          { pos: [-6.5, 0.6, 11], size: [2.2, 0.4, 2.2], idx: 0 },
          { pos: [-9.5, 0.9, 8.5], size: [2.4, 0.4, 2.4], idx: 1 }
        ].map((pad, idx) => (
          <mesh
            key={idx}
            ref={(el) => {
              if (el) {
                el.userData = { baseY: pad.pos[1] };
                bobbingPadsRef.current[idx] = el;
              }
            }}
            position={pad.pos}
            castShadow
            receiveShadow
          >
            <boxGeometry args={pad.size} />
            <meshStandardMaterial color="#16223d" roughness={0.4} metalness={0.7} />
          </mesh>
        ))}
      </group>

      {/* =========================================================================
          3. SKY CITY PROMENADE ISLAND (Mission 2 & Phase Bridge Terminal)
          Position: [-14, 1, 4]
      ========================================================================= */}
      <group position={[-14, 1, 4]}>
        {/* Island Rock Underside */}
        <mesh position={[0, -4.5, 0]} castShadow receiveShadow>
          <coneGeometry args={[9, 9, 6]} />
          <meshStandardMaterial color="#0a0c1a" roughness={0.9} />
        </mesh>

        {/* Promenade Plaza Floor */}
        <mesh position={[0, 0.05, 0]} receiveShadow>
          <cylinderGeometry args={[8.5, 8.5, 0.5, 6]} />
          <meshStandardMaterial color="#10172e" roughness={0.4} metalness={0.7} />
        </mesh>

        {/* Energy Trim */}
        <mesh position={[0, 0.32, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[7.8, 8.3, 6]} />
          <meshStandardMaterial color="#C084FC" emissive="#7047FF" emissiveIntensity={2.0} />
        </mesh>

        {/* Ruined Cyber Spires on Promenade Edge */}
        <group position={[-5, 2.5, -2]}>
          <mesh castShadow>
            <boxGeometry args={[1.4, 5, 1.4]} />
            <meshStandardMaterial color="#0c1224" roughness={0.3} metalness={0.8} />
          </mesh>
          <mesh position={[0, 0, 0.72]}>
            <planeGeometry args={[0.2, 4.5]} />
            <meshStandardMaterial color="#00D9FF" emissive="#00D9FF" emissiveIntensity={2.2} />
          </mesh>
        </group>
      </group>

      {/* =========================================================================
          4. CENTRAL RUINS HUB ISLAND (Gateway to Shards & Labyrinth)
          Position: [0, 1.5, -6]
      ========================================================================= */}
      <group position={[0, 1.5, -6]}>
        {/* Rock Cone */}
        <mesh position={[0, -6, 0]} castShadow receiveShadow>
          <coneGeometry args={[13, 12, 8]} />
          <meshStandardMaterial color="#080a17" roughness={0.9} />
        </mesh>

        {/* Main Paved Surface */}
        <mesh position={[0, 0.05, 0]} receiveShadow>
          <cylinderGeometry args={[12, 12, 0.6, 8]} />
          <meshStandardMaterial color="#0f162c" roughness={0.3} metalness={0.8} />
        </mesh>

        {/* Concentric Holographic Floor Circuit Lines */}
        <mesh position={[0, 0.36, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[6, 6.4, 32]} />
          <meshStandardMaterial color="#00D9FF" emissive="#00D9FF" emissiveIntensity={2.5} />
        </mesh>
        <mesh position={[0, 0.36, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[9.5, 10.0, 32]} />
          <meshStandardMaterial color="#7047FF" emissive="#7047FF" emissiveIntensity={1.8} />
        </mesh>

        {/* Monumental Pillars Flanking North Gateway */}
        {[-4.5, 4.5].map((x, i) => (
          <group key={i} position={[x, 3.5, -8]}>
            <mesh castShadow>
              <boxGeometry args={[1.2, 7, 1.2]} />
              <meshStandardMaterial color="#0c1328" roughness={0.3} metalness={0.8} />
            </mesh>
            <mesh position={[0, 0, 0.62]}>
              <planeGeometry args={[0.25, 6.4]} />
              <meshStandardMaterial color="#F5B942" emissive="#F5B942" emissiveIntensity={1.8} />
            </mesh>
          </group>
        ))}
      </group>

      {/* =========================================================================
          5. THREE CHRONO SHARD SATELLITE ISLANDS
      ========================================================================= */}
      {/* A. West Genesis Overlook Platform [16, 4, 12] */}
      <group position={[16, 4, 12]}>
        <mesh position={[0, -3.5, 0]} castShadow receiveShadow>
          <coneGeometry args={[6, 7, 6]} />
          <meshStandardMaterial color="#0a0c1a" roughness={0.9} />
        </mesh>
        <mesh position={[0, 0.05, 0]} receiveShadow>
          <cylinderGeometry args={[5.5, 5.5, 0.4, 6]} />
          <meshStandardMaterial color="#111933" roughness={0.4} metalness={0.7} />
        </mesh>
        <mesh position={[0, 0.26, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[4.8, 5.2, 6]} />
          <meshStandardMaterial color="#F5B942" emissive="#F5B942" emissiveIntensity={2.5} />
        </mesh>
      </group>

      {/* Stepping Pads between Hub and Genesis Island */}
      {[
        { pos: [8, 2.5, 2], idx: 2 },
        { pos: [12, 3.2, 7], idx: 3 }
      ].map((pad, idx) => (
        <mesh
          key={idx}
          ref={(el) => {
            if (el) {
              el.userData = { baseY: pad.pos[1] };
              bobbingPadsRef.current[pad.idx] = el;
            }
          }}
          position={pad.pos}
          castShadow
          receiveShadow
        >
          <cylinderGeometry args={[1.4, 1.4, 0.35, 6]} />
          <meshStandardMaterial color="#16223d" roughness={0.3} metalness={0.8} />
        </mesh>
      ))}

      {/* B. East Flux Anomaly Island [-18, 3, -14] */}
      <group position={[-18, 3, -14]}>
        <mesh position={[0, -4, 0]} castShadow receiveShadow>
          <coneGeometry args={[6.5, 8, 6]} />
          <meshStandardMaterial color="#0a0c1a" roughness={0.9} />
        </mesh>
        <mesh position={[0, 0.05, 0]} receiveShadow>
          <cylinderGeometry args={[6, 6, 0.4, 6]} />
          <meshStandardMaterial color="#10172d" roughness={0.4} metalness={0.7} />
        </mesh>
        <mesh position={[0, 0.26, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[5.2, 5.6, 6]} />
          <meshStandardMaterial color="#7047FF" emissive="#7047FF" emissiveIntensity={2.5} />
        </mesh>
      </group>

      {/* Stepping Pads between Hub and Flux Island */}
      {[
        { pos: [-9, 2.2, -10], idx: 4 },
        { pos: [-14, 2.6, -12], idx: 5 }
      ].map((pad, idx) => (
        <mesh
          key={idx}
          ref={(el) => {
            if (el) {
              el.userData = { baseY: pad.pos[1] };
              bobbingPadsRef.current[pad.idx] = el;
            }
          }}
          position={pad.pos}
          castShadow
          receiveShadow
        >
          <cylinderGeometry args={[1.4, 1.4, 0.35, 6]} />
          <meshStandardMaterial color="#16223d" roughness={0.3} metalness={0.8} />
        </mesh>
      ))}

      {/* C. Deep Singularity Bastion Island [16, 2, -18] */}
      <group position={[16, 2, -18]}>
        <mesh position={[0, -4, 0]} castShadow receiveShadow>
          <coneGeometry args={[6.5, 8, 6]} />
          <meshStandardMaterial color="#0a0c1a" roughness={0.9} />
        </mesh>
        <mesh position={[0, 0.05, 0]} receiveShadow>
          <cylinderGeometry args={[6, 6, 0.4, 6]} />
          <meshStandardMaterial color="#10172d" roughness={0.4} metalness={0.7} />
        </mesh>
        <mesh position={[0, 0.26, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[5.2, 5.6, 6]} />
          <meshStandardMaterial color="#00D9FF" emissive="#00D9FF" emissiveIntensity={2.5} />
        </mesh>
      </group>

      {/* Stepping Pads between Hub and Singularity Island */}
      {[
        { pos: [8, 1.8, -12], idx: 6 },
        { pos: [12, 1.9, -15], idx: 7 }
      ].map((pad, idx) => (
        <mesh
          key={idx}
          ref={(el) => {
            if (el) {
              el.userData = { baseY: pad.pos[1] };
              bobbingPadsRef.current[pad.idx] = el;
            }
          }}
          position={pad.pos}
          castShadow
          receiveShadow
        >
          <cylinderGeometry args={[1.4, 1.4, 0.35, 6]} />
          <meshStandardMaterial color="#16223d" roughness={0.3} metalness={0.8} />
        </mesh>
      ))}
    </group>
  );
}
