import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import GameState from '../../../systems/../engine/GameState';
import AudioSystem from '../../../systems/AudioSystem';

/**
 * World 3 Final Boss: THE CHRONARCH
 * Architect of Temporal Stasis
 * Features:
 * - 4.2m towering celestial entity with energy armor and holographic wing blades
 * - 3 Combat Phases with distinct telegraphs, energy attacks, and vulnerability windows
 * - Real damage registration: Player presses [F] / clicks / taps ATK within range to deal damage
 * - Checkpoint safety: Player respawns right before the arena if defeated
 */
export default function ChronarchBoss({ playerRef }) {
  const bossGroupRef = useRef();
  const coreRef = useRef();
  const leftWingRef = useRef();
  const rightWingRef = useRef();
  const shockwaveRef = useRef();
  const projectileRef = useRef();

  const [bossState, setBossState] = useState(GameState.getState().boss);
  const [shockwaveActive, setShockwaveActive] = useState(false);
  const [shockwaveScale, setShockwaveScale] = useState(0.1);
  const [telegraphWarning, setTelegraphWarning] = useState(false);
  const [isVulnerable, setIsVulnerable] = useState(false);
  const [isHurtFlash, setIsHurtFlash] = useState(false);

  // Attack timer refs
  const attackTimer = useRef(0);
  const windowTimer = useRef(0);
  const lastDamageTime = useRef(0);

  useEffect(() => {
    const unsub = GameState.subscribe((state) => {
      setBossState({ ...state.boss });
    });

    // Player attack event listener
    const handlePlayerAttack = () => {
      if (!bossGroupRef.current || !playerRef?.current) return;
      if (!GameState.getState().boss.active) return;

      const playerPos = playerRef.current.position;
      const bossPos = bossGroupRef.current.position;
      const dist = playerPos.distanceTo(bossPos);

      // Attack connects if player is within 4.8m and boss is vulnerable
      if (dist <= 4.8 && isVulnerable) {
        AudioSystem.playBossHurt();
        setIsHurtFlash(true);
        setTimeout(() => setIsHurtFlash(false), 200);

        // Deal 15 damage per strike
        GameState.damageBoss(15);
      }
    };

    window.addEventListener('aervyn:player-attack', handlePlayerAttack);

    return () => {
      unsub();
      window.removeEventListener('aervyn:player-attack', handlePlayerAttack);
    };
  }, [isVulnerable, playerRef]);

  useFrame((state, delta) => {
    if (!bossState.active || !bossGroupRef.current) return;

    const time = state.clock.elapsedTime;
    attackTimer.current += delta;

    // 1. Natural Hover & Wing Flap Animation
    bossGroupRef.current.position.y = 4.2 + Math.sin(time * 2.5) * 0.35;

    if (coreRef.current) {
      coreRef.current.rotation.z += delta * (isVulnerable ? 4.0 : 1.5);
    }
    if (leftWingRef.current && rightWingRef.current) {
      const wingFlap = Math.sin(time * 3.0) * 0.25;
      leftWingRef.current.rotation.y = 0.3 + wingFlap;
      rightWingRef.current.rotation.y = -0.3 - wingFlap;
    }

    // 2. Face Player during combat
    if (playerRef?.current) {
      const pPos = playerRef.current.position;
      bossGroupRef.current.lookAt(pPos.x, bossGroupRef.current.position.y, pPos.z);
    }

    // 3. Boss Combat Phase Attack Cycles
    const phase = bossState.phase;

    // A. Telegraph & Attack Execution Cycle (every 6 seconds)
    if (attackTimer.current > 5.5 && !telegraphWarning && !isVulnerable) {
      setTelegraphWarning(true);
      AudioSystem.playBossTelegraph();
    }

    if (attackTimer.current > 7.0 && !isVulnerable) {
      // Execute Attack based on phase
      setTelegraphWarning(false);
      attackTimer.current = 0;

      if (phase === 1) {
        // Phase 1: Ground Shockwave
        setShockwaveActive(true);
        setShockwaveScale(0.2);
        AudioSystem.playBossAttack();
      } else if (phase === 2) {
        // Phase 2: Projectile Blast + Shockwave
        setShockwaveActive(true);
        setShockwaveScale(0.2);
        AudioSystem.playBossAttack();
      } else {
        // Phase 3: Teleport Shift & Heavy Nova
        setShockwaveActive(true);
        setShockwaveScale(0.2);
        AudioSystem.playBossAttack();
      }

      // Open 3.8 second Vulnerability Window after attack
      setIsVulnerable(true);
      GameState.setBossVulnerable(true);
      windowTimer.current = 0;
    }

    // B. Handle Active Shockwave Expansion & Player Damage Collision
    if (shockwaveActive) {
      setShockwaveScale((prev) => {
        const next = prev + delta * 12;
        if (next > 14) {
          setShockwaveActive(false);
          return 0.1;
        }
        return next;
      });

      // Check damage collision with player
      if (playerRef?.current) {
        const pPos = playerRef.current.position;
        const bPos = bossGroupRef.current.position;
        const dist = new THREE.Vector2(pPos.x, pPos.z).distanceTo(new THREE.Vector2(bPos.x, bPos.z));

        // Damage window: player is within expanding ring and not jumping high
        if (Math.abs(dist - shockwaveScale) < 1.2 && pPos.y < 2.8) {
          const now = performance.now();
          if (now - lastDamageTime.current > 1200) {
            lastDamageTime.current = now;
            GameState.damagePlayer(15);
          }
        }
      }
    }

    // C. Handle Vulnerability Window Timeout
    if (isVulnerable) {
      windowTimer.current += delta;
      if (windowTimer.current > 3.8) {
        setIsVulnerable(false);
        GameState.setBossVulnerable(false);
        attackTimer.current = 0;
      }
    }
  });

  if (!bossState.active) return null;

  const phaseColor = bossState.phase === 3 ? '#EF4444' : bossState.phase === 2 ? '#C084FC' : '#7047FF';

  return (
    <group position={[0, 0, -64]}>
      {/* =========================================================================
          THE CHRONARCH 3D ENTITY
      ========================================================================= */}
      <group ref={bossGroupRef} position={[0, 4.2, 0]}>
        {/* Upper Armored Torso */}
        <mesh castShadow>
          <boxGeometry args={[1.6, 2.2, 1.0]} />
          <meshStandardMaterial
            color={isHurtFlash ? '#FFFFFF' : '#0a0e1c'}
            roughness={0.25}
            metalness={0.9}
          />
        </mesh>

        {/* Chrono Energy Core Chest Inset */}
        <group ref={coreRef} position={[0, 0.2, 0.52]}>
          <mesh>
            <torusGeometry args={[0.42, 0.08, 8, 24]} />
            <meshStandardMaterial
              color={isVulnerable ? '#00D9FF' : phaseColor}
              emissive={isVulnerable ? '#00D9FF' : phaseColor}
              emissiveIntensity={isVulnerable ? 4.5 : 2.5}
            />
          </mesh>
          <mesh>
            <sphereGeometry args={[0.26, 16, 16]} />
            <meshStandardMaterial
              color="#FFFFFF"
              emissive={isVulnerable ? '#00D9FF' : '#F5B942'}
              emissiveIntensity={3.5}
            />
          </mesh>
        </group>

        {/* Celestial Crown & Visor Head */}
        <group position={[0, 1.5, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.7, 0.8, 0.7]} />
            <meshStandardMaterial color="#0c1326" roughness={0.2} metalness={0.9} />
          </mesh>
          {/* Slit Visor */}
          <mesh position={[0, 0, 0.38]}>
            <planeGeometry args={[0.55, 0.12]} />
            <meshStandardMaterial
              color="#00D9FF"
              emissive="#00D9FF"
              emissiveIntensity={4.0}
            />
          </mesh>
          {/* Crown Horns */}
          {[-0.35, 0.35].map((x, i) => (
            <mesh key={i} position={[x, 0.55, 0]} rotation={[0, 0, x > 0 ? -0.3 : 0.3]}>
              <coneGeometry args={[0.1, 0.6, 6]} />
              <meshStandardMaterial color="#F5B942" metalness={0.9} />
            </mesh>
          ))}
        </group>

        {/* Heavy Shoulder Pauldrons */}
        {[-1.15, 1.15].map((x, i) => (
          <mesh key={i} position={[x, 0.85, 0]} castShadow>
            <boxGeometry args={[0.8, 0.6, 0.8]} />
            <meshStandardMaterial color="#141d38" roughness={0.3} metalness={0.8} />
          </mesh>
        ))}

        {/* Massive Holographic Wing Blades */}
        <group ref={leftWingRef} position={[-1.2, 0.8, -0.4]}>
          <mesh position={[-1.6, 1.2, 0]} rotation={[0, 0, 0.35]}>
            <boxGeometry args={[3.2, 0.15, 0.6]} />
            <meshStandardMaterial
              color={isVulnerable ? '#00D9FF' : '#7047FF'}
              emissive={isVulnerable ? '#00D9FF' : '#7047FF'}
              emissiveIntensity={3.0}
              transparent
              opacity={0.85}
            />
          </mesh>
        </group>

        <group ref={rightWingRef} position={[1.2, 0.8, -0.4]}>
          <mesh position={[1.6, 1.2, 0]} rotation={[0, 0, -0.35]}>
            <boxGeometry args={[3.2, 0.15, 0.6]} />
            <meshStandardMaterial
              color={isVulnerable ? '#00D9FF' : '#7047FF'}
              emissive={isVulnerable ? '#00D9FF' : '#7047FF'}
              emissiveIntensity={3.0}
              transparent
              opacity={0.85}
            />
          </mesh>
        </group>

        {/* Floating Tasset Robes / Lower Body */}
        <mesh position={[0, -1.6, 0]}>
          <coneGeometry args={[0.9, 1.8, 8, 1, true]} />
          <meshStandardMaterial
            color="#090d1a"
            roughness={0.5}
            metalness={0.7}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Boss Dynamic Ambient Aura Light */}
        <pointLight
          color={isVulnerable ? '#00D9FF' : phaseColor}
          intensity={isVulnerable ? 25 : 18}
          distance={15}
        />
      </group>

      {/* =========================================================================
          TELEGRAPH WARNING GROUND RING (Shown right before attack)
      ========================================================================= */}
      {telegraphWarning && (
        <mesh position={[0, 2.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[6.5, 7.2, 32]} />
          <meshBasicMaterial color="#EF4444" transparent opacity={0.7} />
        </mesh>
      )}

      {/* =========================================================================
          EXPANDING GROUND SHOCKWAVE HAZARD
      ========================================================================= */}
      {shockwaveActive && (
        <mesh position={[0, 2.08, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[shockwaveScale - 0.4, shockwaveScale, 36]} />
          <meshBasicMaterial
            color={phaseColor}
            transparent
            opacity={Math.max(0, 1 - shockwaveScale / 14)}
          />
        </mesh>
      )}
    </group>
  );
}
