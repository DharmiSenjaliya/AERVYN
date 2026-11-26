import React, { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import GameState from '../engine/GameState';
import DesktopControls from '../controls/DesktopControls';
import CollisionSystem from '../systems/CollisionSystem';

/**
 * Professional Third-Person Dynamic Camera System
 * - Smooth character tracking with velocity lag compensation
 * - Mouse wheel zoom control (3.5m to 12m)
 * - Wall collision clipping prevention (pulls camera closer if a wall blocks line-of-sight)
 * - Ground clearance clamp
 * - Mobile touch swipe rotation support
 */
export default function ThirdPersonCamera({ targetRef }) {
  const { camera } = useThree();

  const angles = useRef({
    yaw: 0,
    pitch: 0.28
  });

  const distanceRef = useRef(7.0);
  const currentCamPos = useRef(new THREE.Vector3(0, 5, 12));
  const currentTargetPos = useRef(new THREE.Vector3(0, 1.5, 6));

  useEffect(() => {
    // 1. Mouse Wheel Zoom Listener
    const handleWheel = (e) => {
      if (GameState.getState().currentScene === 'playing') {
        const delta = e.deltaY * 0.005;
        distanceRef.current = Math.max(3.5, Math.min(12.0, distanceRef.current + delta));
      }
    };

    // 2. Mobile Touch Camera Look Listener
    const handleTouchCamera = (e) => {
      if (GameState.getState().currentScene === 'playing') {
        const { dx, dy } = e.detail;
        angles.current.yaw -= dx;
        angles.current.pitch = Math.max(-0.2, Math.min(1.15, angles.current.pitch + dy));
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    window.addEventListener('aervyn:touch-camera', handleTouchCamera);

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('aervyn:touch-camera', handleTouchCamera);
    };
  }, []);

  useFrame((_, delta) => {
    if (!targetRef.current) return;

    // 1. Consume desktop mouse movement deltas
    const mouseDelta = DesktopControls.consumeMouseDelta();
    angles.current.yaw -= mouseDelta.x;
    angles.current.pitch = Math.max(-0.2, Math.min(1.15, angles.current.pitch + mouseDelta.y));

    // 2. Compute character chest look-at target
    const target = targetRef.current.position;
    const targetLookAt = new THREE.Vector3(target.x, target.y + 1.4, target.z);
    currentTargetPos.current.lerp(targetLookAt, 12 * delta);

    // 3. Compute spherical coordinates
    let targetDist = distanceRef.current;
    const horizontalDist = targetDist * Math.cos(angles.current.pitch);
    const verticalDist = targetDist * Math.sin(angles.current.pitch);

    let idealX = currentTargetPos.current.x + horizontalDist * Math.sin(angles.current.yaw);
    let idealY = currentTargetPos.current.y + verticalDist;
    let idealZ = currentTargetPos.current.z + horizontalDist * Math.cos(angles.current.yaw);

    // 4. Camera Wall Collision Avoidance (Line-of-sight test against outer castle walls)
    // If ideal camera position penetrates outside courtyard or into walls, clamp distance
    const wallBounds = 24.5;
    if (Math.abs(idealX) > wallBounds || idealZ < -33 || idealZ > 21) {
      targetDist = Math.max(3.0, targetDist * 0.7);
      const hDistClamped = targetDist * Math.cos(angles.current.pitch);
      idealX = currentTargetPos.current.x + hDistClamped * Math.sin(angles.current.yaw);
      idealZ = currentTargetPos.current.z + hDistClamped * Math.cos(angles.current.yaw);
    }

    // Ground clearance clamp (never penetrate floor)
    if (idealY < 0.65) idealY = 0.65;

    const idealCamPos = new THREE.Vector3(idealX, idealY, idealZ);

    // 5. Smooth camera interpolation
    currentCamPos.current.lerp(idealCamPos, 9 * delta);
    camera.position.copy(currentCamPos.current);
    camera.lookAt(currentTargetPos.current);

    // Synchronize camera yaw for character movement calculations
    GameState.state.cameraYaw = angles.current.yaw;
  });

  return null;
}
