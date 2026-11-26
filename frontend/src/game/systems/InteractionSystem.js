/**
 * AERVYN: Echoes of Time - Proximity Interaction System
 * Tracks interactive world entities, detects player proximity, displays HUD prompts,
 * and processes interaction trigger callbacks with animation event dispatch.
 */

import GameState from '../engine/GameState';
import AudioSystem from './AudioSystem';

class InteractionSystemManager {
  constructor() {
    this.targets = new Map();
    this.activeTarget = null;
  }

  // Register interactive world entity
  register(id, { position, radius = 2.2, promptText = 'Interact', onInteract }) {
    this.targets.set(id, { id, position, radius, promptText, onInteract });
  }

  unregister(id) {
    this.targets.delete(id);
    if (this.activeTarget?.id === id) {
      this.activeTarget = null;
      GameState.setInteractionPrompt(null);
    }
  }

  clear() {
    this.targets.clear();
    this.activeTarget = null;
    GameState.setInteractionPrompt(null);
  }

  // Update check called per animation frame
  update(playerPos) {
    let nearest = null;
    let minDist = Infinity;

    for (const target of this.targets.values()) {
      const dx = playerPos[0] - target.position[0];
      const dz = playerPos[2] - target.position[2];
      const dist = Math.sqrt(dx * dx + dz * dz);

      if (dist < target.radius && dist < minDist) {
        minDist = dist;
        nearest = target;
      }
    }

    if (nearest) {
      this.activeTarget = nearest;
      GameState.setInteractionPrompt({
        id: nearest.id,
        text: nearest.promptText
      });
    } else {
      if (this.activeTarget) {
        this.activeTarget = null;
        GameState.setInteractionPrompt(null);
      }
    }
  }

  // Trigger interaction (from keyboard [E] or mobile button)
  trigger() {
    if (this.activeTarget && typeof this.activeTarget.onInteract === 'function') {
      AudioSystem.playInteract();
      // Dispatch reach animation event to character
      window.dispatchEvent(new CustomEvent('aervyn:player-interact'));
      this.activeTarget.onInteract();
    }
  }
}

export const InteractionSystem = new InteractionSystemManager();
export default InteractionSystem;
