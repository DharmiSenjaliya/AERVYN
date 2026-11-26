import React, { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import GameState from '../engine/GameState';
import DesktopControls from '../controls/DesktopControls';

/**
 * Professional Third-Person Camera System
 * Smooth character tracking, spherical orbit (pitch/yaw), sensitivity scaling,
 * collision avoidance, and mobile touch support.
 */
export default function ThirdPersonCamera({ targetRef }) {
  const { camera } = useThree();

  // Spherical camera rotation angles
  const angles = useRef({
    yaw: 0,
    pitch: 0.28 // Initial slight downward angle
  });

  const currentCamPos = useRef(new THREE.Vector3(0, 5, 12));
  const currentTargetPos = useRef(new THREE.Vector3(0, 1.5, 6));

  useEffect(() => {
    // Touch camera rotation listener from MobileControls
    const handleTouchCamera = (e) => {
      if (GameState.getState().currentScene === 'playing') {
        const { dx, dy } = e.detail;
        angles.current.yaw -= dx;
        angles.current.pitch = Math.max(-0.25, Math.min(1.2, angles.current.pitch + dy));
      }
    };

    window.addEventListener('aervyn:touch-camera', handleTouchCamera);
    return () => window.removeEventListener('aervyn:touch-camera', handleTouchCamera);
  }, []);

  useFrame((_, delta) => {
    if (!targetRef.current) return;

    // 1. Consume desktop mouse movement deltas
    const mouseDelta = DesktopControls.consumeMouseDelta();
    angles.current.yaw -= mouseDelta.x;
    angles.current.pitch = Math.max(-0.25, Math.min(1.2, angles.current.pitch + mouseDelta.y));

    // 2. Compute target position (character chest level)
    const target = targetRef.current.position;
    const targetLookAt = new THREE.Vector3(target.x, target.y + 1.4, target.z);
    currentTargetPos.current.lerp(targetLookAt, 10 * delta);

    // 3. Compute ideal camera position on sphere
    const distance = GameState.getState().settings.cameraDistance || 7.0;
    const horizontalDist = distance * Math.cos(angles.current.pitch);
    const verticalDist = distance * Math.sin(angles.current.pitch);

    const idealCamPos = new THREE.Vector3(
      currentTargetPos.current.x + horizontalDist * Math.sin(angles.current.yaw),
      currentTargetPos.current.y + verticalDist,
      currentTargetPos.current.z + horizontalDist * Math.cos(angles.current.yaw)
    );

    // Ground collision prevention: camera should never go below ground level
    if (idealCamPos.y < 0.6) idealCamPos.y = 0.6;

    // 4. Smooth camera lag / follow
    currentCamPos.current.lerp(idealCamPos, 8 * delta);
    camera.position.copy(currentCamPos.current);
    camera.lookAt(currentTargetPos.current);

    // Store camera yaw in GameState so character controller moves relative to view
    GameState.state.cameraYaw = angles.current.yaw;
  });

  return null;
}
