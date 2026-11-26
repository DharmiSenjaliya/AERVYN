/**
 * AERVYN: Echoes of Time - Character Locomotion Controller
 * Camera-relative movement, sprint acceleration, jumping physics, and collision resolution.
 */

import * as THREE from 'three';
import GameState from '../engine/GameState';
import CollisionSystem from '../systems/CollisionSystem';
import AudioSystem from '../systems/AudioSystem';

export class CharacterController {
  constructor() {
    this.velocity = new THREE.Vector3();
    this.isGrounded = true;
    this.characterRotation = 0;
    this.targetRotation = 0;
    this.jumpForce = 11.5;
    this.gravity = 28.0;
  }

  update(playerGroup, movementInput, delta) {
    if (!playerGroup) return;

    const { forward, right, sprint, jump } = movementInput;
    const isMoving = forward !== 0 || right !== 0;
    const speed = sprint ? 10.5 : 5.8;

    // 1. Camera-relative movement calculations
    const cameraYaw = GameState.state.cameraYaw || 0;

    let moveX = 0;
    let moveZ = 0;

    if (isMoving) {
      // Forward/Right in camera space
      const forwardX = -Math.sin(cameraYaw);
      const forwardZ = -Math.cos(cameraYaw);
      const rightX = -forwardZ;
      const rightZ = forwardX;

      moveX = (forwardX * forward + rightX * right) * speed * delta;
      moveZ = (forwardZ * forward + rightZ * right) * speed * delta;

      // Target character mesh orientation toward move direction
      this.targetRotation = Math.atan2(moveX, moveZ);

      // Play footstep sounds when grounded
      if (this.isGrounded) {
        AudioSystem.playFootstep(sprint);
      }
    }

    // Smooth character rotation interpolation
    let diff = this.targetRotation - this.characterRotation;
    while (diff < -Math.PI) diff += Math.PI * 2;
    while (diff > Math.PI) diff -= Math.PI * 2;
    this.characterRotation += diff * 12 * delta;
    playerGroup.rotation.y = this.characterRotation;

    // 2. Collision resolution for horizontal movement
    const currX = playerGroup.position.x;
    const currZ = playerGroup.position.z;
    const resolved = CollisionSystem.resolveMovement(
      currX,
      currZ,
      currX + moveX,
      currZ + moveZ,
      0.55
    );

    playerGroup.position.x = resolved.x;
    playerGroup.position.z = resolved.z;

    // 3. Jumping & Gravity Physics
    if (this.isGrounded) {
      if (jump) {
        this.velocity.y = this.jumpForce;
        this.isGrounded = false;
        AudioSystem.playJump();
      } else {
        this.velocity.y = 0;
        playerGroup.position.y = 0;
      }
    } else {
      this.velocity.y -= this.gravity * delta;
      playerGroup.position.y += this.velocity.y * delta;

      // Ground plane collision (y = 0)
      if (playerGroup.position.y <= 0) {
        playerGroup.position.y = 0;
        this.velocity.y = 0;
        this.isGrounded = true;
        AudioSystem.playLanding();
      }
    }

    // 4. Update GameState player telemetry
    GameState.state.player.position = [
      playerGroup.position.x,
      playerGroup.position.y,
      playerGroup.position.z
    ];
    GameState.state.player.rotation = this.characterRotation;
    GameState.state.player.isGrounded = this.isGrounded;
    GameState.state.player.isSprinting = sprint && isMoving;
    GameState.state.player.isMoving = isMoving;
    GameState.state.player.animation = !this.isGrounded
      ? 'jump'
      : isMoving
      ? sprint
        ? 'run'
        : 'walk'
      : 'idle';
  }
}

export default CharacterController;
