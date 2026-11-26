/**
 * AERVYN: Echoes of Time - Game Save & Persistence System
 * Synchronizes player checkpoint, inventory, mission objectives, and playtime
 * with Laravel Sanctum API backend and localStorage fallback.
 */

import api from '../../services/api';
import GameState from '../engine/GameState';

class SaveSystemManager {
  constructor() {
    this.autoSaveInterval = null;
    this.lastSavedTimestamp = Date.now();
  }

  // Hydrate game progress from Laravel API or localStorage
  async loadProgress(worldId = null) {
    try {
      const activeWorld = worldId || GameState.getState().worldId || 'world_1';
      const res = await api.get(`/game/state?world=${activeWorld}`);
      if (res.data?.progress) {
        const p = res.data.progress;
        GameState.setState({
          mission: {
            ...GameState.getState().mission,
            currentStep: p.current_step || 1,
            completedObjectives: p.completed_objectives || [],
            currentObjective: GameState.getState().mission.stepDescriptions[p.current_step || 1]
          },
          inventory: {
            ...GameState.getState().inventory,
            items: p.inventory || [],
            fragmentsCollected: (p.inventory || []).filter((i) => i.type === 'fragment').length,
            quantumCoresCollected: (p.inventory || []).filter((i) => i.type === 'quantum_core').length,
            chronoShardsCollected: (p.inventory || []).filter((i) => i.type === 'chrono_shard').length
          },
          checkpoint: {
            id: p.checkpoint_id || 'courtyard_start',
            name: 'Last Saved Checkpoint',
            position: p.checkpoint_position ? [p.checkpoint_position.x, p.checkpoint_position.y, p.checkpoint_position.z] : [0, 1, 6]
          },
          playtimeSeconds: p.playtime_seconds || 0,
          endingSelected: p.ending_selected || null,
          campaignCompleted: !!p.campaign_completed,
          storyJournal: p.story_journal || GameState.getState().storyJournal
        });
        return res.data;
      }
    } catch (err) {
      console.warn('API sync unavailable; loading from local storage cache:', err.message);
      const cached = localStorage.getItem('aervyn_game_save_world_1');
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          GameState.setState(parsed);
        } catch {}
      }
    }
  }

  // Persist current state to Laravel backend
  async saveProgress() {
    const state = GameState.getState();
    const elapsedSeconds = Math.round((Date.now() - this.lastSavedTimestamp) / 1000);
    this.lastSavedTimestamp = Date.now();

    const payload = {
      world_id: state.worldId,
      current_step: state.mission.currentStep,
      completed_objectives: state.mission.completedObjectives,
      inventory: state.inventory.items,
      checkpoint_id: state.checkpoint.id,
      checkpoint_position: {
        x: state.player.position[0],
        y: state.player.position[1],
        z: state.player.position[2]
      },
      playtime_increment: elapsedSeconds,
      ending_selected: state.endingSelected,
      story_journal: state.storyJournal,
      campaign_completed: state.campaignCompleted
    };

    // Always backup to localStorage
    localStorage.setItem(`aervyn_game_save_${state.worldId}`, JSON.stringify({
      mission: state.mission,
      inventory: state.inventory,
      checkpoint: state.checkpoint,
      playtimeSeconds: state.playtimeSeconds + elapsedSeconds,
      endingSelected: state.endingSelected,
      campaignCompleted: state.campaignCompleted,
      storyJournal: state.storyJournal
    }));

    try {
      const res = await api.post('/game/save', payload);
      return res.data;
    } catch (err) {
      console.warn('Backend auto-save notice (cached locally):', err.message);
    }
  }

  // Save specific checkpoint reached
  async recordCheckpoint(checkpointId, name, position) {
    GameState.setCheckpoint(checkpointId, name, position);

    try {
      await api.post('/game/checkpoint', {
        world_id: 'world_1',
        checkpoint_id: checkpointId,
        position: { x: position[0], y: position[1], z: position[2] }
      });
    } catch (err) {
      // Local fallback
    }
  }

  // Complete World 1 & trigger backend rewards
  async completeWorld() {
    try {
      const res = await api.post('/game/complete-world', {
        world_id: 'world_1'
      });
      return res.data;
    } catch (err) {
      console.warn('Complete world offline fallback:', err.message);
      return {
        status: 'success',
        xp_awarded: 500,
        message: 'World 1 Restored!'
      };
    }
  }

  // Start periodic auto-save
  startAutoSave(intervalMs = 30000) {
    this.stopAutoSave();
    this.autoSaveInterval = setInterval(() => {
      if (GameState.getState().currentScene === 'playing') {
        this.saveProgress();
      }
    }, intervalMs);
  }

  stopAutoSave() {
    if (this.autoSaveInterval) {
      clearInterval(this.autoSaveInterval);
      this.autoSaveInterval = null;
    }
  }
}

export const SaveSystem = new SaveSystemManager();
export default SaveSystem;
