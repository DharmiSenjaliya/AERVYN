import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import CharacterController from './CharacterController';
import DesktopControls from '../controls/DesktopControls';
import GameState from '../engine/GameState';
import InteractionSystem from '../systems/InteractionSystem';

/**
 * Enhanced 3D Protagonist Character Model & Procedural Animator
 * Features:
 * - Natural idle breathing sway
 * - Sprint forward lean with flowing cape
 * - Jump apex tuck and landing squash/bounce
 * - Interactive arm reach animation
 * - Chrono Keystone backpack gear mechanics
 */
export default function PlayerCharacter({ playerRef, mobileInput = null }) {
  const controller = useRef(new CharacterController());

  // Mesh limb refs for animation
  const torsoRef = useRef();
  const leftLegRef = useRef();
  const rightLegRef = useRef();
  const leftArmRef = useRef();
  const rightArmRef = useRef();
  const chronoCoreRef = useRef();
  const capeRef = useRef();
  const visorRef = useRef();

  useEffect(() => {
    // Listen for interaction events to trigger reach pose
    const handleInteractEvent = () => {
      controller.current.triggerInteractAnimation();
    };

    window.addEventListener('aervyn:player-interact', handleInteractEvent);
    return () => window.removeEventListener('aervyn:player-interact', handleInteractEvent);
  }, []);

  useFrame((state, delta) => {
    if (!playerRef.current) return;

    // 1. Gather movement input (blend desktop controls with mobile joystick)
    const desktopInput = DesktopControls.getMovementVector();
    let forward = desktopInput.forward;
    let right = desktopInput.right;
    let sprint = desktopInput.sprint;
    let jump = desktopInput.jump;

    if (mobileInput) {
      if (mobileInput.x !== 0 || mobileInput.y !== 0) {
        forward = mobileInput.y;
        right = mobileInput.x;
      }
      if (mobileInput.sprint) sprint = true;
      if (mobileInput.jump) jump = true;
    }

    // 2. Physics & locomotion update
    controller.current.update(
      playerRef.current,
      { forward, right, sprint, jump },
      delta
    );

    // 3. Spatial interaction query
    const pos = playerRef.current.position;
    InteractionSystem.update([pos.x, pos.y, pos.z]);

    // Tutorial step triggers
    if ((forward !== 0 || right !== 0) && GameState.getState().mission.currentStep === 1) {
      GameState.advanceStep(2);
    }
    if ((sprint || jump) && GameState.getState().mission.currentStep === 2) {
      GameState.advanceStep(3);
    }

    // 4. Procedural Character Animation Blending
    const time = state.clock.elapsedTime;
    const isMoving = forward !== 0 || right !== 0;
    const isInteracting = controller.current.isInteracting;
    const isGrounded = controller.current.isGrounded;
    const animSpeed = sprint ? 16 : 9.5;

    // A. Interacting Pose (Arm Reach)
    if (isInteracting) {
      if (rightArmRef.current) {
        rightArmRef.current.rotation.x = -1.35; // Extend arm forward toward relic
        rightArmRef.current.rotation.z = 0.2;
      }
      if (torsoRef.current) torsoRef.current.rotation.x = 0.12;
    }
    // B. In-Air Jump Pose
    else if (!isGrounded) {
      if (leftLegRef.current) leftLegRef.current.rotation.x = 0.45;
      if (rightLegRef.current) rightLegRef.current.rotation.x = 0.25;
      if (leftArmRef.current) leftArmRef.current.rotation.x = -0.6;
      if (rightArmRef.current) rightArmRef.current.rotation.x = -0.6;
      if (capeRef.current) capeRef.current.rotation.x = 0.55;
    }
    // C. Walk / Run Locomotion
    else if (isMoving) {
      const swing = Math.sin(time * animSpeed) * (sprint ? 0.72 : 0.42);
      if (leftLegRef.current) leftLegRef.current.rotation.x = swing;
      if (rightLegRef.current) rightLegRef.current.rotation.x = -swing;
      if (leftArmRef.current) leftArmRef.current.rotation.x = -swing * 0.85;
      if (rightArmRef.current) rightArmRef.current.rotation.x = swing * 0.85;

      // Sprint forward lean
      const lean = sprint ? 0.18 : 0.08;
      if (torsoRef.current) {
        torsoRef.current.rotation.x = lean;
        torsoRef.current.rotation.y = Math.sin(time * animSpeed * 0.5) * 0.08;
      }
      if (capeRef.current) {
        capeRef.current.rotation.x = (sprint ? 0.65 : 0.3) + Math.sin(time * animSpeed) * 0.1;
      }
    }
    // D. Idle Breathing Sway
    else {
      const breathe = Math.sin(time * 2.2) * 0.035;
      if (torsoRef.current) {
        torsoRef.current.position.y = 0.85 + breathe;
        torsoRef.current.rotation.x = 0;
        torsoRef.current.rotation.y = 0;
      }
      if (leftLegRef.current) leftLegRef.current.rotation.x = 0;
      if (rightLegRef.current) rightLegRef.current.rotation.x = 0;
      if (leftArmRef.current) leftArmRef.current.rotation.x = breathe;
      if (rightArmRef.current) rightArmRef.current.rotation.x = -breathe;
      if (capeRef.current) capeRef.current.rotation.x = 0.08 + Math.sin(time * 1.5) * 0.04;
    }

    // Chrono Core Gear Rotation
    if (chronoCoreRef.current) {
      chronoCoreRef.current.rotation.z += delta * (isMoving ? 3.5 : 1.2);
    }

    // Cyan Visor Pulse
    if (visorRef.current) {
      visorRef.current.material.emissiveIntensity = 2.0 + Math.sin(time * 3.5) * 0.5;
    }
  });

  return (
    <group ref={playerRef} position={[0, 0, 6]}>
      {/* --- TORSO & CHEST ARMOR --- */}
      <group ref={torsoRef} position={[0, 0.85, 0]}>
        {/* Upper Chest Plate */}
        <mesh position={[0, 0.35, 0]} castShadow>
          <boxGeometry args={[0.62, 0.55, 0.34]} />
          <meshStandardMaterial color="#0c162d" roughness={0.3} metalness={0.8} />
        </mesh>

        {/* Chrono Energy Core Chest Inset */}
        <mesh position={[0, 0.38, 0.18]}>
          <circleGeometry args={[0.1, 16]} />
          <meshStandardMaterial
            color="#00D9FF"
            emissive="#00D9FF"
            emissiveIntensity={2.0}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Waist / Belt */}
        <mesh position={[0, 0.05, 0]} castShadow>
          <boxGeometry args={[0.54, 0.2, 0.3]} />
          <meshStandardMaterial color="#1f293d" roughness={0.5} metalness={0.6} />
        </mesh>

        {/* --- HEAD & HELMET --- */}
        <group position={[0, 0.82, 0]}>
          {/* Main Helmet Shell */}
          <mesh castShadow>
            <sphereGeometry args={[0.24, 16, 16]} />
            <meshStandardMaterial color="#080e1e" roughness={0.25} metalness={0.9} />
          </mesh>

          {/* Luminous Cyan Visor */}
          <mesh ref={visorRef} position={[0, 0.02, 0.18]}>
            <boxGeometry args={[0.28, 0.07, 0.12]} />
            <meshStandardMaterial
              color="#00D9FF"
              emissive="#00D9FF"
              emissiveIntensity={2.5}
            />
          </mesh>

          {/* Helmet Gold Crest */}
          <mesh position={[0, 0.24, -0.05]}>
            <boxGeometry args={[0.06, 0.12, 0.32]} />
            <meshStandardMaterial color="#F5B942" roughness={0.3} metalness={0.8} />
          </mesh>
        </group>

        {/* --- CHRONO DEVICE BACKPACK --- */}
        <group position={[0, 0.35, -0.25]}>
          {/* Main Device Housing */}
          <mesh castShadow>
            <boxGeometry args={[0.34, 0.44, 0.18]} />
            <meshStandardMaterial color="#1a233a" roughness={0.4} metalness={0.8} />
          </mesh>

          {/* Rotating Bronze Chrono Gear */}
          <mesh ref={chronoCoreRef} position={[0, 0, -0.1]}>
            <torusGeometry args={[0.12, 0.025, 8, 24]} />
            <meshStandardMaterial
              color="#F5B942"
              emissive="#D48800"
              emissiveIntensity={1.0}
              metalness={0.9}
            />
          </mesh>

          {/* Ambient Portal Light from Device */}
          <pointLight color="#00D9FF" intensity={14} distance={8} position={[0, 0, 0.2]} />
        </group>

        {/* Adventurer Cape */}
        <mesh ref={capeRef} position={[0, 0.55, -0.2]} rotation={[0.15, 0, 0]}>
          <planeGeometry args={[0.55, 0.9]} />
          <meshStandardMaterial color="#162238" roughness={0.9} side={THREE.DoubleSide} />
        </mesh>

        {/* --- LEFT ARM --- */}
        <group ref={leftArmRef} position={[-0.42, 0.5, 0]}>
          <mesh position={[0, -0.28, 0]} castShadow>
            <cylinderGeometry args={[0.08, 0.07, 0.55, 12]} />
            <meshStandardMaterial color="#168CFF" roughness={0.4} metalness={0.7} />
          </mesh>
          <mesh position={[0, -0.45, 0]}>
            <boxGeometry args={[0.12, 0.16, 0.12]} />
            <meshStandardMaterial color="#0c162d" roughness={0.3} metalness={0.9} />
          </mesh>
        </group>

        {/* --- RIGHT ARM --- */}
        <group ref={rightArmRef} position={[0.42, 0.5, 0]}>
          <mesh position={[0, -0.28, 0]} castShadow>
            <cylinderGeometry args={[0.08, 0.07, 0.55, 12]} />
            <meshStandardMaterial color="#168CFF" roughness={0.4} metalness={0.7} />
          </mesh>
          <mesh position={[0, -0.45, 0]}>
            <boxGeometry args={[0.12, 0.16, 0.12]} />
            <meshStandardMaterial color="#0c162d" roughness={0.3} metalness={0.9} />
          </mesh>
        </group>
      </group>

      {/* --- LEGS --- */}
      {/* Left Leg */}
      <group ref={leftLegRef} position={[-0.18, 0.8, 0]}>
        <mesh position={[0, -0.4, 0]} castShadow>
          <cylinderGeometry args={[0.11, 0.09, 0.8, 12]} />
          <meshStandardMaterial color="#0c1328" roughness={0.5} metalness={0.6} />
        </mesh>
        <mesh position={[0, -0.78, 0.05]} castShadow>
          <boxGeometry args={[0.16, 0.14, 0.28]} />
          <meshStandardMaterial color="#1e293b" roughness={0.6} />
        </mesh>
      </group>

      {/* Right Leg */}
      <group ref={rightLegRef} position={[0.18, 0.8, 0]}>
        <mesh position={[0, -0.4, 0]} castShadow>
          <cylinderGeometry args={[0.11, 0.09, 0.8, 12]} />
          <meshStandardMaterial color="#0c1328" roughness={0.5} metalness={0.6} />
        </mesh>
        <mesh position={[0, -0.78, 0.05]} castShadow>
          <boxGeometry args={[0.16, 0.14, 0.28]} />
          <meshStandardMaterial color="#1e293b" roughness={0.6} />
        </mesh>
      </group>
    </group>
  );
}
