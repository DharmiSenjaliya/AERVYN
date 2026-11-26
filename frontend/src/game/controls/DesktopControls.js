/**
 * AERVYN: Echoes of Time - Desktop Input Controller
 * Captures WASD / Arrow keys, Sprint, Jump, Interaction, Inventory, and Mouse Camera.
 */

import GameState from '../engine/GameState';
import InteractionSystem from '../systems/InteractionSystem';
import AudioSystem from '../systems/AudioSystem';

class DesktopControlsManager {
  constructor() {
    this.keys = {
      forward: false,
      backward: false,
      left: false,
      right: false,
      sprint: false,
      jump: false
    };

    this.mouseDelta = { x: 0, y: 0 };
    this.initialized = false;

    this.onKeyDown = this.handleKeyDown.bind(this);
    this.onKeyUp = this.handleKeyUp.bind(this);
    this.onMouseMove = this.handleMouseMove.bind(this);
    this.onMouseDown = this.handleMouseDown.bind(this);
  }

  init() {
    if (this.initialized) return;
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
    window.addEventListener('mousemove', this.onMouseMove);
    window.addEventListener('mousedown', this.onMouseDown);
    this.initialized = true;
  }

  destroy() {
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
    window.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('mousedown', this.onMouseDown);
    this.initialized = false;
  }

  handleKeyDown(e) {
    // Start ambient background on first keystroke
    AudioSystem.startAmbience();

    // Only capture while actively playing or paused
    if (GameState.getState().currentScene !== 'playing') {
      if (e.key === 'Escape' && GameState.getState().currentScene === 'paused') {
        GameState.setScene('playing');
      }
      return;
    }

    const key = e.key.toLowerCase();

    // Prevent default browser scrolling on space or arrow keys
    if ([' ', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(e.key)) {
      e.preventDefault();
    }

    if (key === 'w' || e.key === 'ArrowUp') this.keys.forward = true;
    if (key === 's' || e.key === 'ArrowDown') this.keys.backward = true;
    if (key === 'a' || e.key === 'ArrowLeft') this.keys.left = true;
    if (key === 'd' || e.key === 'ArrowRight') this.keys.right = true;
    if (e.key === 'Shift') this.keys.sprint = true;
    if (e.key === ' ') this.keys.jump = true;

    // Interaction trigger [E]
    if (key === 'e') {
      InteractionSystem.trigger();
    }

    // Chrono Strike / Attack trigger [F]
    if (key === 'f') {
      window.dispatchEvent(new CustomEvent('aervyn:player-attack'));
    }

    // Inventory toggle [I]
    if (key === 'i') {
      window.dispatchEvent(new CustomEvent('aervyn:toggle-inventory'));
    }

    // Story Journal toggle [J]
    if (key === 'j') {
      window.dispatchEvent(new CustomEvent('aervyn:toggle-journal'));
    }

    // Pause toggle [ESC]
    if (e.key === 'Escape') {
      GameState.setScene('paused');
    }
  }

  handleMouseDown(e) {
    if (GameState.getState().currentScene === 'playing' && e.button === 0) {
      // Don't trigger if clicking on HUD buttons or modals
      if (!e.target.closest('button') && !e.target.closest('.glass-panel')) {
        window.dispatchEvent(new CustomEvent('aervyn:player-attack'));
      }
    }
  }

  handleKeyUp(e) {
    const key = e.key.toLowerCase();
    if (key === 'w' || e.key === 'ArrowUp') this.keys.forward = false;
    if (key === 's' || e.key === 'ArrowDown') this.keys.backward = false;
    if (key === 'a' || e.key === 'ArrowLeft') this.keys.left = false;
    if (key === 'd' || e.key === 'ArrowRight') this.keys.right = false;
    if (e.key === 'Shift') this.keys.sprint = false;
    if (e.key === ' ') this.keys.jump = false;
  }

  handleMouseMove(e) {
    if (GameState.getState().currentScene === 'playing') {
      const sensitivity = GameState.getState().settings.mouseSensitivity || 1.0;
      this.mouseDelta.x += e.movementX * 0.002 * sensitivity;
      this.mouseDelta.y += e.movementY * 0.002 * sensitivity;
    }
  }

  getMovementVector() {
    let forward = 0;
    let right = 0;

    if (this.keys.forward) forward += 1;
    if (this.keys.backward) forward -= 1;
    if (this.keys.right) right += 1;
    if (this.keys.left) right -= 1;

    return {
      forward,
      right,
      sprint: this.keys.sprint,
      jump: this.keys.jump
    };
  }

  consumeMouseDelta() {
    const delta = { ...this.mouseDelta };
    this.mouseDelta.x = 0;
    this.mouseDelta.y = 0;
    return delta;
  }
}

export const DesktopControls = new DesktopControlsManager();
export default DesktopControls;
