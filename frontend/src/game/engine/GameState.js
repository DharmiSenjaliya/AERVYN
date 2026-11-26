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
      },
      world_3: {
        id: 'world_3',
        name: 'World 3: The Fractured Future',
        spawn: [0, 2, 24],
        checkpoint: { id: 'end_of_time_landing', name: 'Landing Sky Island', position: [0, 2, 24] },
        mission: {
          id: 'mission_3',
          title: 'The Fractured Future',
          currentStep: 1,
          totalSteps: 7,
          currentObjective: 'Mission 1: Arrival at the End of Time — Locate and calibrate the Chrono Beacon [E].',
          completedObjectives: [],
          stepDescriptions: {
            1: 'Mission 1: Arrival at the End of Time — Locate and calibrate the Chrono Beacon [E].',
            2: 'Mission 2: The Fallen Sky City — Cross the sky bridge and activate the Phase Bridge Terminal [E].',
            3: 'Mission 3: The Three Chrono Shards — Recover 3 Chrono Shards across the floating islands (0/3).',
            4: 'Mission 4: The Time Labyrinth — Solve the 3 temporal resonator switches to open the Spire Gate.',
            5: 'Mission 5: The Chronarch\'s Secret — Access the Chrono Archive Terminal inside the Research Spire.',
            6: 'Mission 6: The Final Confrontation — Defeat THE CHRONARCH in the Timeline Engine Arena!',
            7: 'Mission 7: The Fractured Future — Restore the Master Timeline Engine to seal the cosmic fracture!'
          }
        }
      },
      world_final: {
        id: 'world_final',
        name: 'World 4: The Last Timeline',
        spawn: [0, 2, 20],
        checkpoint: { id: 'zero_horizon_arrival', name: 'Zero Horizon Sanctum', position: [0, 2, 20] },
        mission: {
          id: 'mission_final',
          title: 'The Last Timeline',
          currentStep: 1,
          totalSteps: 4,
          currentObjective: 'Step 1: The Zero Horizon — Cross the celestial bridge toward the Primordial Chrono Core.',
          completedObjectives: [],
          stepDescriptions: {
            1: 'Step 1: The Zero Horizon — Cross the celestial bridge toward the Primordial Chrono Core.',
            2: 'Step 2: Continuum Synchronization — Align the 3 Epoch Keystones (Antiquity, Quantum, Singularity) [E].',
            3: 'Step 3: The Nexus Decision — Harmonize the Primordial Core and choose the fate of reality [E].',
            4: 'Step 4: Epilogue — Witness the destiny of Aervyn.'
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
        quantumCoresCollected: 0,
        chronoShardsCollected: 0
      },

      boss: {
        active: false,
        name: 'THE CHRONARCH',
        subtitle: 'Architect of Temporal Stasis',
        health: 100,
        maxHealth: 100,
        phase: 1,
        isVulnerable: false
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
        world2GatewayActive: false,

        // World 3
        beaconCalibrated: false,
        phaseBridgeActive: false,
        labyrinthSwitches: { alpha: false, beta: false, gamma: false },
        labyrinthSolved: false,
        archiveTerminalAccessed: false,
        bossArenaUnlocked: false,
        bossDefeated: false,
        timelineEngineRestored: false,

        // World Final (The Last Timeline)
        synchronizationMatrix: {
          antiquity: false,
          quantum: false,
          singularity: false,
          solved: false
        },
        primordialCoreStabilized: false
      },

      endingSelected: null,
      campaignCompleted: false,
      storyJournal: [
        'prologue_origin',
        'lore_time_energy',
        'lore_ancient_kingdom'
      ],
      activeDialogue: null,

      checkpoint: { ...cfg.checkpoint },
      interactionPrompt: null,
      playtimeSeconds: 0,
      damageFlash: false,

      settings: {
        musicVolume: 0.5,
        sfxVolume: 0.8,
        mouseSensitivity: 1.0,
        graphicsQuality: (() => {
          try {
            return localStorage.getItem('aervyn_graphics_quality') || 'high';
          } catch {
            return 'high';
          }
        })(),
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

  // World 3: Collect Chrono Shard
  collectChronoShard(shardId, name) {
    const existing = this.state.inventory.items.find((item) => item.id === shardId);
    if (!existing) {
      const items = [...this.state.inventory.items, { id: shardId, name, type: 'chrono_shard' }];
      const count = items.filter((i) => i.type === 'chrono_shard').length;

      this.setState({
        inventory: {
          ...this.state.inventory,
          items,
          chronoShardsCollected: count
        }
      });

      if (count >= 3 && this.state.mission.currentStep === 3) {
        this.advanceStep(4);
      } else if (count > 0 && this.state.mission.currentStep === 3) {
        this.state.mission.currentObjective = `Mission 3: The Three Chrono Shards — Recover 3 Chrono Shards (${count}/3).`;
        this.notify();
      }
    }
  }

  // World 3: Labyrinth Switch Toggle
  setLabyrinthSwitch(switchKey, active = true) {
    const updatedSwitches = {
      ...this.state.objects.labyrinthSwitches,
      [switchKey]: active
    };
    const allActive = updatedSwitches.alpha && updatedSwitches.beta && updatedSwitches.gamma;

    this.setState({
      objects: {
        ...this.state.objects,
        labyrinthSwitches: updatedSwitches,
        labyrinthSolved: allActive
      }
    });

    if (allActive && this.state.mission.currentStep === 4) {
      this.advanceStep(5);
    }
  }

  // World 3: Boss Combat State
  setBossActive(active = true) {
    this.setState({
      boss: {
        ...this.state.boss,
        active
      }
    });
  }

  setBossVulnerable(isVulnerable = true) {
    this.setState({
      boss: {
        ...this.state.boss,
        isVulnerable
      }
    });
  }

  damageBoss(amount) {
    if (!this.state.boss.active) return;
    const currentHp = this.state.boss.health;
    const newHp = Math.max(0, currentHp - amount);

    let nextPhase = 1;
    if (newHp <= 30) nextPhase = 3;
    else if (newHp <= 65) nextPhase = 2;

    this.setState({
      boss: {
        ...this.state.boss,
        health: newHp,
        phase: nextPhase
      }
    });

    if (newHp <= 0) {
      this.setState({
        boss: {
          ...this.state.boss,
          health: 0,
          active: false
        },
        objects: {
          ...this.state.objects,
          bossDefeated: true
        }
      });
      AudioSystem.playVictory();
      this.advanceStep(7);
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

  // World 4: Continuum Synchronization Matrix Keystone Alignment
  alignEpochKeystone(epochKey) {
    if (!['antiquity', 'quantum', 'singularity'].includes(epochKey)) return;

    const currentMatrix = this.state.objects.synchronizationMatrix || {};
    if (currentMatrix[epochKey]) return; // Already aligned

    const updated = {
      ...currentMatrix,
      [epochKey]: true
    };
    const allSolved = updated.antiquity && updated.quantum && updated.singularity;
    updated.solved = allSolved;

    this.setState({
      objects: {
        ...this.state.objects,
        synchronizationMatrix: updated
      }
    });

    // Journal Unlock based on Keystone
    const journalMap = {
      antiquity: 'artifact_antiquity_keystone',
      quantum: 'artifact_quantum_flux',
      singularity: 'artifact_singularity_shard'
    };
    if (journalMap[epochKey]) {
      this.unlockJournalEntry(journalMap[epochKey]);
    }

    if (allSolved) {
      AudioSystem.playMatrixComplete();
      this.unlockJournalEntry('lore_primordial_core');
      this.advanceStep(3);
    } else {
      AudioSystem.playMatrixAlign();
    }
  }

  // World 4: Choose Temporal Ending (Ending A or Ending B)
  setEnding(endingKey) {
    if (!['ending_a', 'ending_b'].includes(endingKey)) return;

    AudioSystem.playEndingDecision();
    this.unlockJournalEntry(`destiny_${endingKey}`);

    this.setState({
      endingSelected: endingKey,
      campaignCompleted: true,
      objects: {
        ...this.state.objects,
        primordialCoreStabilized: true
      }
    });

    this.advanceStep(4);
  }

  // Story Journal System
  unlockJournalEntry(entryId) {
    if (!entryId) return;
    const current = this.state.storyJournal || [];
    if (!current.includes(entryId)) {
      this.setState({
        storyJournal: [...current, entryId]
      });
    }
  }

  // Cinematic Dialogue System
  startDialogue(dialogue) {
    this.setState({
      activeDialogue: dialogue
    });
  }

  closeDialogue() {
    this.setState({
      activeDialogue: null
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
        quantumCoresCollected: 0,
        chronoShardsCollected: 0
      },
      boss: {
        active: false,
        name: 'THE CHRONARCH',
        subtitle: 'Architect of Temporal Stasis',
        health: 100,
        maxHealth: 100,
        phase: 1,
        isVulnerable: false
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
        world2GatewayActive: false,
        beaconCalibrated: false,
        phaseBridgeActive: false,
        labyrinthSwitches: { alpha: false, beta: false, gamma: false },
        labyrinthSolved: false,
        archiveTerminalAccessed: false,
        bossArenaUnlocked: false,
        bossDefeated: false,
        timelineEngineRestored: false,
        synchronizationMatrix: { antiquity: false, quantum: false, singularity: false, solved: false },
        primordialCoreStabilized: false
      },
      endingSelected: null,
      campaignCompleted: false,
      activeDialogue: null,
      interactionPrompt: null
    });
  }
}

export const GameState = new GameStateManager();
export default GameState;
