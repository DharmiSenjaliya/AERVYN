/**
 * AERVYN: Echoes of Time - Professional Audio System
 * Synthesized Web Audio API sound generator providing zero-latency, cross-platform audio
 * for environmental ambience, character locomotion, interactions, puzzles, and temporal FX.
 */

import GameState from '../engine/GameState';

class AudioSystemManager {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.ambientNodes = null;
    this.lastFootstep = 0;
    this.ambientRunning = false;
  }

  getContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  getSfxVolume() {
    if (this.isMuted) return 0;
    return GameState.getState().settings.sfxVolume || 0.8;
  }

  getMusicVolume() {
    if (this.isMuted) return 0;
    return GameState.getState().settings.musicVolume || 0.5;
  }

  setMuted(muted) {
    this.isMuted = muted;
    if (this.ambientNodes) {
      this.ambientNodes.masterGain.gain.setValueAtTime(
        muted ? 0 : 0.08 * this.getMusicVolume(),
        this.ctx?.currentTime || 0
      );
    }
  }

  // 1. Continuous Environmental Forest & Wind Ambience
  startAmbience() {
    if (this.ambientRunning) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      // Master Ambient Gain
      const masterGain = ctx.createGain();
      const vol = this.isMuted ? 0 : 0.08 * this.getMusicVolume();
      masterGain.gain.setValueAtTime(vol, ctx.currentTime);
      masterGain.connect(ctx.destination);

      // Wind Synthesizer (Filtered Pink/White Noise)
      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        output[i] = (b0 + b1 + b2) * 0.15;
      }

      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = noiseBuffer;
      noiseSource.loop = true;

      const windFilter = ctx.createBiquadFilter();
      windFilter.type = 'lowpass';
      windFilter.frequency.setValueAtTime(320, ctx.currentTime);

      noiseSource.connect(windFilter);
      windFilter.connect(masterGain);
      noiseSource.start();

      // Temporal Mystic Resonance Drone (Dual detuned sine oscillators)
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const droneGain = ctx.createGain();

      osc1.type = 'sine';
      osc2.type = 'triangle';
      osc1.frequency.setValueAtTime(73.42, ctx.currentTime); // D2
      osc2.frequency.setValueAtTime(110.0, ctx.currentTime);  // A2

      droneGain.gain.setValueAtTime(0.06, ctx.currentTime);

      osc1.connect(droneGain);
      osc2.connect(droneGain);
      droneGain.connect(masterGain);

      osc1.start();
      osc2.start();

      this.ambientNodes = { masterGain, noiseSource, osc1, osc2 };
      this.ambientRunning = true;
    } catch {}
  }

  // 2. Footstep Audio with terrain differentiation
  playFootstep(isSprinting = false, onStone = true) {
    const now = performance.now();
    const interval = isSprinting ? 270 : 380;
    if (now - this.lastFootstep < interval) return;
    this.lastFootstep = now;

    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = onStone ? 'triangle' : 'sine';
      const baseFreq = onStone ? (isSprinting ? 160 : 120) : 80;
      osc.frequency.setValueAtTime(baseFreq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(35, ctx.currentTime + 0.05);

      const vol = (onStone ? 0.07 : 0.05) * this.getSfxVolume();
      gain.gain.setValueAtTime(vol, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch {}
  }

  // 3. Jump Swoosh Sound
  playJump() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(160, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(360, ctx.currentTime + 0.16);

      const vol = 0.16 * this.getSfxVolume();
      gain.gain.setValueAtTime(vol, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.16);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.16);
    } catch {}
  }

  // 4. Landing Impact Sound
  playLanding() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(100, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.09);

      const vol = 0.2 * this.getSfxVolume();
      gain.gain.setValueAtTime(vol, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.09);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.09);
    } catch {}
  }

  // 5. Collectible Shimmer Chime
  playCollect() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const freqs = [523.25, 659.25, 783.99, 1046.5, 1318.5]; // C5, E5, G5, C6, E6
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.05);

        const vol = 0.11 * this.getSfxVolume();
        gain.gain.setValueAtTime(0.001, ctx.currentTime);
        gain.gain.setValueAtTime(vol, ctx.currentTime + idx * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.05 + 0.28);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + idx * 0.05);
        osc.stop(ctx.currentTime + idx * 0.05 + 0.28);
      });
    } catch {}
  }

  // 6. Interaction Sound (Keystone touch / glyph activation)
  playInteract() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(580, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(920, ctx.currentTime + 0.09);

      const vol = 0.14 * this.getSfxVolume();
      gain.gain.setValueAtTime(vol, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.09);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.09);
    } catch {}
  }

  // 7. Puzzle Mechanism Metallic Ratchet Turn
  playPuzzleDial() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(360, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(140, ctx.currentTime + 0.06);

      const vol = 0.16 * this.getSfxVolume();
      gain.gain.setValueAtTime(vol, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.06);
    } catch {}
  }

  // 8. Ancient Stone Door Grinding Open
  playDoorOpen() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(55, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(80, ctx.currentTime + 1.4);

      const vol = 0.25 * this.getSfxVolume();
      gain.gain.setValueAtTime(0.01, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(vol, ctx.currentTime + 0.3);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.4);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 1.4);
    } catch {}
  }

  // 9. Time Portal Activation & Warp Resonance
  playPortalActivate() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sawtooth';
      osc2.type = 'sine';

      osc1.frequency.setValueAtTime(95, ctx.currentTime);
      osc1.frequency.exponentialRampToValueAtTime(480, ctx.currentTime + 1.6);

      osc2.frequency.setValueAtTime(190, ctx.currentTime);
      osc2.frequency.exponentialRampToValueAtTime(960, ctx.currentTime + 1.6);

      const vol = 0.32 * this.getSfxVolume();
      gain.gain.setValueAtTime(0.01, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(vol, ctx.currentTime + 0.6);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2.0);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start();
      osc2.start();
      osc1.stop(ctx.currentTime + 2.0);
      osc2.stop(ctx.currentTime + 2.0);
    } catch {}
  }

  // 10. Victory Chime Sequence
  playVictory() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const notes = [523.25, 659.25, 783.99, 1046.5, 1318.51, 1567.98];
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.12);

        const vol = 0.22 * this.getSfxVolume();
        gain.gain.setValueAtTime(0.001, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(vol, ctx.currentTime + i * 0.12 + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.12 + 0.7);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + i * 0.12);
        osc.stop(ctx.currentTime + i * 0.12 + 0.7);
      });
    } catch {}
  }
}

export const AudioSystem = new AudioSystemManager();
export default AudioSystem;
