import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import CharacterController from './CharacterController';
import DesktopControls from '../controls/DesktopControls';
import GameState from '../engine/GameState';
import InteractionSystem from '../systems/InteractionSystem';

/**
 * Original 3D Playable Character (Aervyn Protagonist)
 * Complete with procedural limb locomotion, jump dynamics, Chrono Device backpack,
 * and point lighting.
 */
export default function PlayerCharacter({ playerRef, mobileInput = null }) {
  const controller = useRef(new CharacterController());

  // Mesh limb refs for procedural animation
  const torsoRef = useRef();
  const leftLegRef = useRef();
  const rightLegRef = useRef();
  const leftArmRef = useRef();
  const rightArmRef = useRef();
  const chronoCoreRef = useRef();
  const capeRef = useRef();

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

    // 2. Update physics & locomotion
    controller.current.update(
      playerRef.current,
      { forward, right, sprint, jump },
      delta
    );

    // 3. Update spatial interaction query
    const pos = playerRef.current.position;
    InteractionSystem.update([pos.x, pos.y, pos.z]);

    // Check tutorial steps 1 and 2
    if ((forward !== 0 || right !== 0) && GameState.getState().mission.currentStep === 1) {
      GameState.advanceStep(2);
    }
    if ((sprint || jump) && GameState.getState().mission.currentStep === 2) {
      GameState.advanceStep(3);
    }

    // 4. Procedural Character Animation Blending
    const time = state.clock.elapsedTime;
    const isMoving = forward !== 0 || right !== 0;
    const animSpeed = sprint ? 16 : 9;

    if (isMoving && controller.current.isGrounded) {
      // Walk / Run Limb Swing
      const swing = Math.sin(time * animSpeed) * (sprint ? 0.75 : 0.45);
      if (leftLegRef.current) leftLegRef.current.rotation.x = swing;
      if (rightLegRef.current) rightLegRef.current.rotation.x = -swing;
      if (leftArmRef.current) leftArmRef.current.rotation.x = -swing * 0.8;
      if (rightArmRef.current) rightArmRef.current.rotation.x = swing * 0.8;
      if (torsoRef.current) torsoRef.current.rotation.y = Math.sin(time * animSpeed * 0.5) * 0.1;
      if (capeRef.current) capeRef.current.rotation.x = (sprint ? 0.6 : 0.25) + Math.sin(time * animSpeed) * 0.1;
    } else if (!controller.current.isGrounded) {
      // Jump Pose (Tucked Legs, Raised Arms)
      if (leftLegRef.current) leftLegRef.current.rotation.x = 0.5;
      if (rightLegRef.current) rightLegRef.current.rotation.x = 0.3;
      if (leftArmRef.current) leftArmRef.current.rotation.x = -0.7;
      if (rightArmRef.current) rightArmRef.current.rotation.x = -0.7;
    } else {
      // Idle Breathing Sway
      const breathe = Math.sin(time * 2.2) * 0.04;
      if (torsoRef.current) torsoRef.current.position.y = 0.85 + breathe;
      if (leftLegRef.current) leftLegRef.current.rotation.x = 0;
      if (rightLegRef.current) rightLegRef.current.rotation.x = 0;
      if (leftArmRef.current) leftArmRef.current.rotation.x = breathe;
      if (rightArmRef.current) rightArmRef.current.rotation.x = -breathe;
      if (capeRef.current) capeRef.current.rotation.x = 0.05 + Math.sin(time * 1.5) * 0.03;
    }

    // Chrono Core Gear Rotation
    if (chronoCoreRef.current) {
      chronoCoreRef.current.rotation.z += delta * 2.5;
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
            emissiveIntensity={1.8}
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
          <mesh position={[0, 0.02, 0.18]}>
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
              emissiveIntensity={0.6}
              metalness={0.9}
            />
          </mesh>

          {/* Ambient Portal Light from Device */}
          <pointLight color="#00D9FF" intensity={12} distance={8} position={[0, 0, 0.2]} />
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
          {/* Gauntlet */}
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
          {/* Gauntlet */}
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
        {/* Boot */}
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
        {/* Boot */}
        <mesh position={[0, -0.78, 0.05]} castShadow>
          <boxGeometry args={[0.16, 0.14, 0.28]} />
          <meshStandardMaterial color="#1e293b" roughness={0.6} />
        </mesh>
      </group>
    </group>
  );
}
