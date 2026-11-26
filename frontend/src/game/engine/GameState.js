/**
 * AERVYN: Echoes of Time - Central Game State Manager
 * Reactive state store with event listeners for 3D engine, HUD, and backend synchronization.
 */

class GameStateManager {
  constructor() {
    this.listeners = new Set();

    this.state = {
      // Game Execution State: 'loading' | 'menu' | 'playing' | 'paused' | 'victory' | 'gameover'
      currentScene: 'menu',

      // World Info
      worldId: 'world_1',
      worldName: 'World 1: The Lost Kingdom',

      // Player Telemetry
      player: {
        position: [0, 1, 6],
        rotation: 0,
        health: 100,
        maxHealth: 100,
        chronoEnergy: 100,
        maxChronoEnergy: 100,
        isGrounded: true,
        isSprinting: false,
        isMoving: false,
        animation: 'idle' // 'idle' | 'walk' | 'run' | 'jump' | 'interact'
      },

      // Mission & 10-Step Story Progress
      mission: {
        id: 'mission_1',
        title: 'Awakening the Keystone',
        currentStep: 1, // 1 through 10
        totalSteps: 10,
        currentObjective: 'Step forward and explore the Ancient Castle Courtyard.',
        completedObjectives: [],
        stepDescriptions: {
          1: 'Welcome to Aervyn. Move with [W/A/S/D] or Joystick to begin.',
          2: 'Learn character traversal: Sprint with [Shift] and Jump with [Space].',
          3: 'Investigate the ancient pedestal at the center of the courtyard.',
          4: 'Interact [E] with the Chrono Keystone on the pedestal.',
          5: 'Search the ruins to collect 3 Temporal Energy Fragments (0/3).',
          6: 'Collect the remaining Temporal Energy Fragments (Fragments Gathered).',
          7: 'Approach the Ancient Stone Gate and channel fragments into the runic lock.',
          8: 'Enter the Inner Chamber and align the Chrono Alignment Mechanism.',
          9: 'Step to the Central Portal Dais and initiate Temporal Shift [E].',
          10: 'Step into the Active Time Portal to restore Timeline 1!'
        }
      },

      // Inventory
      inventory: {
        items: [],
        fragmentsCollected: 0,
        hasKeystone: false
      },

      // World Objects State
      objects: {
        doorUnlocked: false,
        doorOpenProgress: 0,
        puzzleSolved: false,
        puzzleDials: [45, 180, 270], // Target: [0, 0, 0]
        portalActive: false,
        portalCharging: false
      },

      // Active Checkpoint
      checkpoint: {
        id: 'courtyard_start',
        name: 'Castle Courtyard Entrance',
        position: [0, 1, 6]
      },

      // Nearby Interactive Target Prompt
      interactionPrompt: null, // { text, action } | null

      // Game Telemetry & Playtime
      playtimeSeconds: 0,
      score: 0,

      // Settings
      settings: {
        musicVolume: 0.5,
        sfxVolume: 0.8,
        mouseSensitivity: 1.0,
        graphicsQuality: 'high', // 'low' | 'medium' | 'high'
        cameraDistance: 7
      }
    };
  }

  getState() {
    return this.state;
  }

  setState(updates) {
    this.state = {
      ...this.state,
      ...updates
    };
    this.notify();
  }

  // Subscribe to state updates (e.g., in React hooks)
  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    for (const listener of this.listeners) {
      listener(this.state);
    }
  }

  // Set interaction prompt
  setInteractionPrompt(prompt) {
    if (JSON.stringify(this.state.interactionPrompt) !== JSON.stringify(prompt)) {
      this.state.interactionPrompt = prompt;
      this.notify();
    }
  }

  // Collect Energy Fragment
  collectFragment(fragmentId, name) {
    const existing = this.state.inventory.items.find((item) => item.id === fragmentId);
    if (!existing) {
      const items = [...this.state.inventory.items, { id: fragmentId, name, type: 'fragment' }];
      const count = items.filter((i) => i.type === 'fragment').length;

      this.setState({
        inventory: {
          ...this.state.inventory,
          items,
          fragmentsCollected: count
        }
      });

      // Update mission step if all 3 gathered
      if (count >= 3 && this.state.mission.currentStep <= 6) {
        this.advanceStep(7);
      } else if (count > 0 && this.state.mission.currentStep === 5) {
        this.state.mission.currentObjective = `Search the ruins to collect 3 Temporal Energy Fragments (${count}/3).`;
        this.notify();
      }
    }
  }

  // Advance 10-step sequence
  advanceStep(stepNumber) {
    if (stepNumber > this.state.mission.currentStep) {
      const stepDesc = this.state.mission.stepDescriptions[stepNumber] || '';
      const completed = [...this.state.mission.completedObjectives, this.state.mission.currentStep];

      this.setState({
        mission: {
          ...this.state.mission,
          currentStep: stepNumber,
          currentObjective: stepDesc,
          completedObjectives: completed
        }
      });
    }
  }

  // Checkpoint save
  setCheckpoint(id, name, position) {
    this.setState({
      checkpoint: { id, name, position }
    });
  }

  // Set scene
  setScene(scene) {
    this.setState({ currentScene: scene });
  }

  // Reset Run
  reset() {
    this.setState({
      currentScene: 'playing',
      player: {
        ...this.state.player,
        position: [0, 1, 6],
        health: 100,
        chronoEnergy: 100
      },
      mission: {
        ...this.state.mission,
        currentStep: 1,
        currentObjective: this.state.mission.stepDescriptions[1],
        completedObjectives: []
      },
      inventory: {
        items: [],
        fragmentsCollected: 0,
        hasKeystone: false
      },
      objects: {
        doorUnlocked: false,
        doorOpenProgress: 0,
        puzzleSolved: false,
        puzzleDials: [45, 180, 270],
        portalActive: false,
        portalCharging: false
      },
      interactionPrompt: null
    });
  }
}

export const GameState = new GameStateManager();
export default GameState;
