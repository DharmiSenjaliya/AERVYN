/**
 * AERVYN: Echoes of Time - Enhanced Character Locomotion Controller
 * Smooth acceleration/deceleration, camera-relative vectors, jump dynamics,
 * interaction state triggers, and robust collision detection.
 */

import * as THREE from 'three';
import GameState from '../engine/GameState';
import CollisionSystem from '../systems/CollisionSystem';
import AudioSystem from '../systems/AudioSystem';

export class CharacterController {
  constructor() {
    this.currentVelocity = new THREE.Vector2(0, 0);
    this.verticalVelocity = 0;
    this.isGrounded = true;
    this.characterRotation = 0;
    this.targetRotation = 0;
    this.jumpForce = 11.2;
    this.gravity = 27.0;
    this.isInteracting = false;
    this.interactTimer = 0;
  }

  triggerInteractAnimation() {
    this.isInteracting = true;
    this.interactTimer = 0.6; // 600ms reach animation
  }

  update(playerGroup, movementInput, delta) {
    if (!playerGroup) return;

    const { forward, right, sprint, jump } = movementInput;
    const isMoving = forward !== 0 || right !== 0;
    const targetSpeed = isMoving ? (sprint ? 9.8 : 5.4) : 0;

    // 1. Interaction Timer Countdown
    if (this.isInteracting) {
      this.interactTimer -= delta;
      if (this.interactTimer <= 0) {
        this.isInteracting = false;
      }
    }

    // 2. Camera-Relative Movement
    const cameraYaw = GameState.state.cameraYaw || 0;
    let targetMoveX = 0;
    let targetMoveZ = 0;

    if (isMoving) {
      const forwardX = -Math.sin(cameraYaw);
      const forwardZ = -Math.cos(cameraYaw);
      const rightX = -forwardZ;
      const rightZ = forwardX;

      const inputLen = Math.sqrt(forward * forward + right * right) || 1;
      const normForward = forward / inputLen;
      const normRight = right / inputLen;

      targetMoveX = (forwardX * normForward + rightX * normRight) * targetSpeed;
      targetMoveZ = (forwardZ * normForward + rightZ * normRight) * targetSpeed;

      // Target character mesh orientation toward move direction
      this.targetRotation = Math.atan2(targetMoveX, targetMoveZ);

      // Footstep cadence
      if (this.isGrounded) {
        AudioSystem.playFootstep(sprint, true);
      }
    }

    // Smooth Velocity Interpolation (Acceleration & Deceleration to eliminate sliding)
    const accelRate = isMoving ? 14.0 : 18.0;
    this.currentVelocity.x += (targetMoveX - this.currentVelocity.x) * accelRate * delta;
    this.currentVelocity.y += (targetMoveZ - this.currentVelocity.y) * accelRate * delta;

    // Smooth Direction-based Character Rotation
    if (isMoving) {
      let diff = this.targetRotation - this.characterRotation;
      while (diff < -Math.PI) diff += Math.PI * 2;
      while (diff > Math.PI) diff -= Math.PI * 2;
      this.characterRotation += diff * 14 * delta;
      playerGroup.rotation.y = this.characterRotation;
    }

    // 3. Collision Resolution against World Obstacles
    const currX = playerGroup.position.x;
    const currZ = playerGroup.position.z;
    const resolved = CollisionSystem.resolveMovement(
      currX,
      currZ,
      currX + this.currentVelocity.x * delta,
      currZ + this.currentVelocity.y * delta,
      0.55
    );

    playerGroup.position.x = resolved.x;
    playerGroup.position.z = resolved.z;

    // 4. Vertical Physics (Jumping, Gravity & Step Elevation)
    if (this.isGrounded) {
      if (jump) {
        this.verticalVelocity = this.jumpForce;
        this.isGrounded = false;
        AudioSystem.playJump();
      } else {
        this.verticalVelocity = 0;
        playerGroup.position.y = 0;
      }
    } else {
      this.verticalVelocity -= this.gravity * delta;
      playerGroup.position.y += this.verticalVelocity * delta;

      // Ground plane collision (y = 0)
      if (playerGroup.position.y <= 0) {
        playerGroup.position.y = 0;
        this.verticalVelocity = 0;
        this.isGrounded = true;
        AudioSystem.playLanding();
      }
    }

    // 5. Update GameState Telemetry
    GameState.state.player.position = [
      playerGroup.position.x,
      playerGroup.position.y,
      playerGroup.position.z
    ];
    GameState.state.player.rotation = this.characterRotation;
    GameState.state.player.isGrounded = this.isGrounded;
    GameState.state.player.isSprinting = sprint && isMoving;
    GameState.state.player.isMoving = isMoving;
    GameState.state.player.animation = this.isInteracting
      ? 'interact'
      : !this.isGrounded
      ? 'jump'
      : isMoving
      ? sprint
        ? 'run'
        : 'walk'
      : 'idle';
  }
}

export default CharacterController;
