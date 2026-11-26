/**
 * AERVYN: Echoes of Time - Multi-World Game State Manager
 * Reactive state store supporting World 1 (The Lost Kingdom) and World 2 (The Broken Present),
 * dynamic mission tracking, inventory, health/damage system, and backend persistence.
 */

import AudioSystem from '../systems/AudioSystem';

class GameStateManager {
  constructor() {
    this.listeners = new Set();
    this.worldConfigs = {
      world_1: {
        id: 'world_1',
        name: 'World 1: The Lost Kingdom',
        spawn: [0, 0, 6],
        checkpoint: { id: 'courtyard_start', name: 'Castle Courtyard Entrance', position: [0, 0, 6] },
        mission: {
          id: 'mission_1',
          title: 'Awakening the Keystone',
          currentStep: 1,
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
        }
      },
      world_2: {
        id: 'world_2',
        name: 'World 2: The Broken Present',
        spawn: [0, 0, 12],
        checkpoint: { id: 'highway_overlook', name: 'Shattered Highway Overlook', position: [0, 0, 12] },
        mission: {
          id: 'mission_2',
          title: 'The Broken Present',
          currentStep: 1,
          totalSteps: 7,
          currentObjective: 'Mission 1: Arrival in the Broken City — Locate the damaged city access terminal.',
          completedObjectives: [],
          stepDescriptions: {
            1: 'Mission 1: Arrival in the Broken City — Locate and interact [E] with the damaged access terminal.',
            2: 'Mission 2: The Lost Signal — Locate the communication relay station and activate emergency power.',
            3: 'Mission 3: Energy Recovery — Explore the ruins to recover 3 Quantum Energy Cores (0/3).',
            4: 'Mission 4: The Underground Lab — Unlock the security bulkhead and enter the subterranean research lab.',
            5: 'Mission 5: The Time Anomaly — Navigate the temporal distortion zone and align the phase prisms.',
            6: 'Mission 6: Repair the Time Core — Install all 3 Energy Cores into the Central Time Core reactor [E].',
            7: 'Mission 7: World Completion — Step through the stabilized temporal gateway!'
          }
        }
      }
    };

    const initialWorld = 'world_1';
    const cfg = this.worldConfigs[initialWorld];

    this.state = {
      currentScene: 'menu',
      worldId: cfg.id,
      worldName: cfg.name,

      player: {
        position: [...cfg.spawn],
        rotation: 0,
        health: 100,
        maxHealth: 100,
        chronoEnergy: 100,
        maxChronoEnergy: 100,
        isGrounded: true,
        isSprinting: false,
        isMoving: false,
        animation: 'idle'
      },

      mission: { ...cfg.mission },

      inventory: {
        items: [],
        fragmentsCollected: 0,
        hasKeystone: false,
        quantumCoresCollected: 0
      },

      objects: {
        // World 1
        doorUnlocked: false,
        puzzleSolved: false,
        puzzleDials: [45, 180, 270],
        portalActive: false,
        portalCharging: false,

        // World 2
        terminalHacked: false,
        commRelayActivated: false,
        labBulkheadUnlocked: false,
        phasePuzzleSolved: false,
        timeCoreRepaired: false,
        world2GatewayActive: false
      },

      checkpoint: { ...cfg.checkpoint },
      interactionPrompt: null,
      playtimeSeconds: 0,
      damageFlash: false,

      settings: {
        musicVolume: 0.5,
        sfxVolume: 0.8,
        mouseSensitivity: 1.0,
        graphicsQuality: 'high',
        cameraDistance: 7.0
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

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    for (const listener of this.listeners) {
      listener(this.state);
    }
  }

  // Switch Active World (world_1 or world_2)
  setWorld(worldId) {
    const cfg = this.worldConfigs[worldId] || this.worldConfigs.world_1;
    this.setState({
      worldId: cfg.id,
      worldName: cfg.name,
      player: {
        ...this.state.player,
        position: [...cfg.spawn],
        health: 100
      },
      mission: {
        ...cfg.mission,
        currentStep: 1,
        currentObjective: cfg.mission.stepDescriptions[1],
        completedObjectives: []
      },
      checkpoint: { ...cfg.checkpoint },
      interactionPrompt: null
    });
  }

  setInteractionPrompt(prompt) {
    if (JSON.stringify(this.state.interactionPrompt) !== JSON.stringify(prompt)) {
      this.state.interactionPrompt = prompt;
      this.notify();
    }
  }

  // Damage player from hazards (security drones / anomaly arcs)
  damagePlayer(amount) {
    const currentHealth = this.state.player.health;
    const newHealth = Math.max(0, currentHealth - amount);

    this.setState({
      damageFlash: true,
      player: {
        ...this.state.player,
        health: newHealth
      }
    });

    setTimeout(() => {
      this.setState({ damageFlash: false });
    }, 200);

    if (newHealth <= 0) {
      this.setScene('gameover');
    }
  }

  // World 1: Collect Energy Fragment
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

      if (count >= 3 && this.state.mission.currentStep <= 6) {
        this.advanceStep(7);
      } else if (count > 0 && this.state.mission.currentStep === 5) {
        this.state.mission.currentObjective = `Search the ruins to collect 3 Temporal Energy Fragments (${count}/3).`;
        this.notify();
      }
    }
  }

  // World 2: Collect Quantum Energy Core
  collectQuantumCore(coreId, name) {
    const existing = this.state.inventory.items.find((item) => item.id === coreId);
    if (!existing) {
      const items = [...this.state.inventory.items, { id: coreId, name, type: 'quantum_core' }];
      const count = items.filter((i) => i.type === 'quantum_core').length;

      this.setState({
        inventory: {
          ...this.state.inventory,
          items,
          quantumCoresCollected: count
        }
      });

      if (count >= 3 && this.state.mission.currentStep === 3) {
        this.advanceStep(4);
      } else if (count > 0 && this.state.mission.currentStep === 3) {
        this.state.mission.currentObjective = `Mission 3: Energy Recovery — Recover 3 Quantum Energy Cores (${count}/3).`;
        this.notify();
      }
    }
  }

  // Advance step for current active mission
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

  setCheckpoint(id, name, position) {
    this.setState({
      checkpoint: { id, name, position }
    });
  }

  setScene(scene) {
    this.setState({ currentScene: scene });
  }

  reset() {
    const cfg = this.worldConfigs[this.state.worldId] || this.worldConfigs.world_1;
    this.setState({
      currentScene: 'playing',
      player: {
        ...this.state.player,
        position: [...cfg.spawn],
        health: 100,
        chronoEnergy: 100
      },
      mission: {
        ...cfg.mission,
        currentStep: 1,
        currentObjective: cfg.mission.stepDescriptions[1],
        completedObjectives: []
      },
      inventory: {
        items: [],
        fragmentsCollected: 0,
        hasKeystone: false,
        quantumCoresCollected: 0
      },
      objects: {
        doorUnlocked: false,
        puzzleSolved: false,
        puzzleDials: [45, 180, 270],
        portalActive: false,
        portalCharging: false,
        terminalHacked: false,
        commRelayActivated: false,
        labBulkheadUnlocked: false,
        phasePuzzleSolved: false,
        timeCoreRepaired: false,
        world2GatewayActive: false
      },
      interactionPrompt: null
    });
  }
}

export const GameState = new GameStateManager();
export default GameState;
