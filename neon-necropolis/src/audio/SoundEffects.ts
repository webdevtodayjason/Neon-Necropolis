/**
 * SoundEffects.ts
 * Procedural sound effect generation for NEON NECROPOLIS
 * All sounds created using Web Audio API synthesis
 */

import { getAudioManager } from './AudioManager';
import { SynthEngine } from './SynthEngine';

export class SoundEffects {
  private static instance: SoundEffects | null = null;

  private constructor() {}

  static getInstance(): SoundEffects {
    if (!SoundEffects.instance) {
      SoundEffects.instance = new SoundEffects();
    }
    return SoundEffects.instance;
  }

  // ============================================================================
  // WEAPON SOUNDS
  // ============================================================================

  /**
   * Pistol: Sharp "pew" sound
   */
  playPistol(): void {
    const manager = getAudioManager();
    if (!manager.isReady()) return;

    const synth = manager.getSynthEngine();
    const ctx = manager.getContext();
    const now = ctx.currentTime;

    // Create oscillator with pitch sweep
    const osc = synth.createOscillator('sine', 800);
    const gain = manager.createSFXGain();

    // Pitch sweep: 800Hz -> 200Hz
    synth.createPitchSweep(osc, 800, 200, 0.05, now);

    // Sharp attack, quick decay
    synth.applyEnvelope(gain, {
      attack: 0.001,
      decay: 0.02,
      sustain: 0.3,
      release: 0.03,
    }, now, 0.05);

    // Connect and play
    osc.connect(gain);
    gain.connect(manager.getMasterGain());

    osc.start(now);
    osc.stop(now + 0.05);

    manager.registerSound([osc, gain], 0.05);
  }

  /**
   * Shotgun: Deep "BOOM" with noise burst
   */
  playShotgun(): void {
    const manager = getAudioManager();
    if (!manager.isReady()) return;

    const synth = manager.getSynthEngine();
    const ctx = manager.getContext();
    const now = ctx.currentTime;

    // Low frequency thump
    const bass = synth.createOscillator('sine', 80);
    const bassGain = manager.createSFXGain();
    bassGain.gain.value = 1.2;

    synth.applyEnvelope(bassGain, {
      attack: 0.001,
      decay: 0.05,
      sustain: 0.1,
      release: 0.1,
    }, now, 0.15);

    // Noise burst for the "blast"
    const { source: noise, filter } = synth.createFilteredNoise(0.15, {
      type: 'bandpass',
      frequency: 400,
      Q: 2,
    });
    const noiseGain = manager.createSFXGain();
    noiseGain.gain.value = 0.8;

    synth.applyEnvelope(noiseGain, {
      attack: 0.001,
      decay: 0.03,
      sustain: 0.2,
      release: 0.08,
    }, now, 0.15);

    // Connect
    bass.connect(bassGain);
    filter.connect(noiseGain);
    bassGain.connect(manager.getMasterGain());
    noiseGain.connect(manager.getMasterGain());

    // Play
    bass.start(now);
    noise.start(now);
    bass.stop(now + 0.15);
    noise.stop(now + 0.15);

    manager.registerSound([bass, bassGain, noise, noiseGain], 0.15);
  }

  /**
   * Laser: Continuous "bzzzzz" with LFO modulation
   */
  playLaser(duration: number = 0.1): void {
    const manager = getAudioManager();
    if (!manager.isReady()) return;

    const synth = manager.getSynthEngine();
    const ctx = manager.getContext();
    const now = ctx.currentTime;

    // Sawtooth wave for bright, cutting sound
    const osc = synth.createOscillator('sawtooth', 220);
    const gain = manager.createSFXGain();

    // Add LFO for "bzzz" effect
    const { lfo, gain: lfoGain } = synth.createLFO(30, 50);
    lfoGain.connect(osc.frequency);

    // Pitch sweep for more energy
    synth.createPitchSweep(osc, 220, 180, duration, now);

    // Envelope
    synth.applyEnvelope(gain, {
      attack: 0.01,
      decay: 0.02,
      sustain: 0.7,
      release: 0.03,
    }, now, duration);

    // Connect
    osc.connect(gain);
    gain.connect(manager.getMasterGain());

    // Play
    lfo.start(now);
    osc.start(now);
    lfo.stop(now + duration);
    osc.stop(now + duration);

    manager.registerSound([osc, gain, lfo], duration);
  }

  /**
   * Lightning: "KZZZT" with ring modulation
   */
  playLightning(): void {
    const manager = getAudioManager();
    if (!manager.isReady()) return;

    const synth = manager.getSynthEngine();
    const ctx = manager.getContext();
    const now = ctx.currentTime;

    // Noise for crackle
    const { source: noise, filter } = synth.createFilteredNoise(0.2, {
      type: 'highpass',
      frequency: 2000,
      Q: 1,
    });

    // Ring modulation for electric sound
    const ringMod = synth.createRingMod(400);
    const gain = manager.createSFXGain();

    // Modulate carrier frequency
    ringMod.carrier.frequency.setValueAtTime(400, now);
    ringMod.carrier.frequency.exponentialRampToValueAtTime(100, now + 0.2);

    // Sharp, crackling envelope
    synth.applyEnvelope(gain, {
      attack: 0.001,
      decay: 0.05,
      sustain: 0.4,
      release: 0.1,
    }, now, 0.2);

    // Connect
    filter.connect(ringMod.input);
    ringMod.output.connect(gain);
    gain.connect(manager.getMasterGain());

    // Play
    noise.start(now);
    noise.stop(now + 0.2);

    manager.registerSound([noise, gain], 0.2);
  }

  /**
   * Missile: Whoosh -> explosion
   */
  playMissile(): void {
    const manager = getAudioManager();
    if (!manager.isReady()) return;

    const synth = manager.getSynthEngine();
    const ctx = manager.getContext();
    const now = ctx.currentTime;

    // Whoosh (filtered noise sweep)
    const { source: whoosh, filter: whooshFilter } = synth.createFilteredNoise(0.5, {
      type: 'bandpass',
      frequency: 800,
      Q: 5,
    });
    const whooshGain = manager.createSFXGain();
    whooshGain.gain.value = 0.5;

    // Sweep filter frequency
    whooshFilter.frequency.setValueAtTime(800, now);
    whooshFilter.frequency.exponentialRampToValueAtTime(200, now + 0.5);

    synth.applyEnvelope(whooshGain, {
      attack: 0.1,
      decay: 0.2,
      sustain: 0.5,
      release: 0.2,
    }, now, 0.5);

    // Explosion at the end
    setTimeout(() => {
      this.playExplosion();
    }, 450);

    // Connect
    whooshFilter.connect(whooshGain);
    whooshGain.connect(manager.getMasterGain());

    // Play
    whoosh.start(now);
    whoosh.stop(now + 0.5);

    manager.registerSound([whoosh, whooshGain], 0.5);
  }

  /**
   * Flamethrower: "FWOOSH" continuous
   */
  playFlamethrower(duration: number = 0.1): void {
    const manager = getAudioManager();
    if (!manager.isReady()) return;

    const synth = manager.getSynthEngine();
    const ctx = manager.getContext();
    const now = ctx.currentTime;

    // Filtered noise
    const { source: noise, filter } = synth.createFilteredNoise(duration, {
      type: 'lowpass',
      frequency: 1200,
      Q: 1,
    });
    const gain = manager.createSFXGain();
    gain.gain.value = 0.6;

    // Add LFO for flickering
    const { lfo, gain: lfoGain } = synth.createLFO(20, 200);
    lfoGain.connect(filter.frequency);

    // Envelope
    synth.applyEnvelope(gain, {
      attack: 0.02,
      decay: 0.05,
      sustain: 0.8,
      release: 0.05,
    }, now, duration);

    // Connect
    filter.connect(gain);
    gain.connect(manager.getMasterGain());

    // Play
    lfo.start(now);
    noise.start(now);
    lfo.stop(now + duration);
    noise.stop(now + duration);

    manager.registerSound([noise, gain, lfo], duration);
  }

  /**
   * Tesla: "ZAP" square wave burst
   */
  playTesla(): void {
    const manager = getAudioManager();
    if (!manager.isReady()) return;

    const synth = manager.getSynthEngine();
    const ctx = manager.getContext();
    const now = ctx.currentTime;

    // Square wave for harsh electric sound
    const osc = synth.createOscillator('square', 150);
    const gain = manager.createSFXGain();

    // Quick pitch sweep
    synth.createPitchSweep(osc, 150, 80, 0.08, now);

    // Very sharp envelope
    synth.applyEnvelope(gain, {
      attack: 0.001,
      decay: 0.02,
      sustain: 0.3,
      release: 0.04,
    }, now, 0.08);

    // Add distortion
    const distortion = synth.createDistortion(100);

    // Connect
    osc.connect(distortion);
    distortion.connect(gain);
    gain.connect(manager.getMasterGain());

    // Play
    osc.start(now);
    osc.stop(now + 0.08);

    manager.registerSound([osc, gain], 0.08);
  }

  /**
   * Ice: Crystalline chime with high harmonics
   */
  playIce(): void {
    const manager = getAudioManager();
    if (!manager.isReady()) return;

    const synth = manager.getSynthEngine();
    const ctx = manager.getContext();
    const now = ctx.currentTime;

    // Multiple sine waves for bell-like sound
    const frequencies = [1200, 1800, 2400, 3200];
    const oscs: OscillatorNode[] = [];
    const gains: GainNode[] = [];

    frequencies.forEach((freq, i) => {
      const osc = synth.createOscillator('sine', freq);
      const gain = manager.createSFXGain();
      gain.gain.value = 0.3 / (i + 1); // Decreasing amplitude for harmonics

      synth.applyEnvelope(gain, {
        attack: 0.001,
        decay: 0.1,
        sustain: 0.2,
        release: 0.3,
      }, now, 0.4);

      osc.connect(gain);
      gain.connect(manager.getMasterGain());

      osc.start(now);
      osc.stop(now + 0.4);

      oscs.push(osc);
      gains.push(gain);
    });

    manager.registerSound([...oscs, ...gains], 0.4);
  }

  /**
   * Orbital: Whooshing phaser sweep
   */
  playOrbital(): void {
    const manager = getAudioManager();
    if (!manager.isReady()) return;

    const synth = manager.getSynthEngine();
    const ctx = manager.getContext();
    const now = ctx.currentTime;

    // Sawtooth for bright sound
    const osc = synth.createOscillator('sawtooth', 100);
    const gain = manager.createSFXGain();

    // Long pitch sweep
    synth.createPitchSweep(osc, 100, 2000, 0.8, now);

    // Add filter sweep
    const filter = synth.createFilter({
      type: 'lowpass',
      frequency: 500,
      Q: 10,
    });
    filter.frequency.setValueAtTime(500, now);
    filter.frequency.exponentialRampToValueAtTime(4000, now + 0.8);

    // Envelope
    synth.applyEnvelope(gain, {
      attack: 0.1,
      decay: 0.2,
      sustain: 0.7,
      release: 0.3,
    }, now, 0.8);

    // Connect
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(manager.getMasterGain());

    // Play
    osc.start(now);
    osc.stop(now + 0.8);

    manager.registerSound([osc, gain], 0.8);
  }

  /**
   * Poison: Bubbling random blips
   */
  playPoison(): void {
    const manager = getAudioManager();
    if (!manager.isReady()) return;

    const synth = manager.getSynthEngine();
    const ctx = manager.getContext();
    const now = ctx.currentTime;

    // Random frequency blips
    for (let i = 0; i < 3; i++) {
      const freq = 200 + Math.random() * 400;
      const time = now + i * 0.05;

      const osc = synth.createOscillator('sine', freq);
      const gain = manager.createSFXGain();
      gain.gain.value = 0.3;

      synth.applyEnvelope(gain, {
        attack: 0.01,
        decay: 0.02,
        sustain: 0.5,
        release: 0.03,
      }, time, 0.06);

      osc.connect(gain);
      gain.connect(manager.getMasterGain());

      osc.start(time);
      osc.stop(time + 0.06);

      manager.registerSound([osc, gain], 0.06);
    }
  }

  /**
   * Explosion: Deep boom with noise
   */
  playExplosion(): void {
    const manager = getAudioManager();
    if (!manager.isReady()) return;

    const synth = manager.getSynthEngine();
    const ctx = manager.getContext();
    const now = ctx.currentTime;

    // Deep bass
    const bass = synth.createOscillator('sine', 40);
    const bassGain = manager.createSFXGain();
    bassGain.gain.value = 1.5;

    synth.createPitchSweep(bass, 40, 20, 0.3, now);
    synth.applyEnvelope(bassGain, {
      attack: 0.001,
      decay: 0.1,
      sustain: 0.2,
      release: 0.2,
    }, now, 0.3);

    // Noise burst
    const { source: noise, filter } = synth.createFilteredNoise(0.3, {
      type: 'lowpass',
      frequency: 800,
      Q: 1,
    });
    const noiseGain = manager.createSFXGain();
    noiseGain.gain.value = 1.0;

    synth.applyEnvelope(noiseGain, {
      attack: 0.001,
      decay: 0.05,
      sustain: 0.3,
      release: 0.15,
    }, now, 0.3);

    // Connect
    bass.connect(bassGain);
    filter.connect(noiseGain);
    bassGain.connect(manager.getMasterGain());
    noiseGain.connect(manager.getMasterGain());

    // Play
    bass.start(now);
    noise.start(now);
    bass.stop(now + 0.3);
    noise.stop(now + 0.3);

    manager.registerSound([bass, bassGain, noise, noiseGain], 0.3);
  }

  // ============================================================================
  // ENEMY SOUNDS
  // ============================================================================

  /**
   * Zombie moan: Low growl with random pitch
   */
  playZombieMoan(): void {
    const manager = getAudioManager();
    if (!manager.isReady()) return;

    const synth = manager.getSynthEngine();
    const ctx = manager.getContext();
    const now = ctx.currentTime;

    const baseFreq = 80 + Math.random() * 40;
    const osc = synth.createOscillator('sawtooth', baseFreq);
    const gain = manager.createSFXGain();
    gain.gain.value = 0.4;

    // Add LFO for vibrato
    const { lfo, gain: lfoGain } = synth.createLFO(5, 10);
    lfoGain.connect(osc.frequency);

    // Add filter for more organic sound
    const filter = synth.createFilter({
      type: 'lowpass',
      frequency: 400,
      Q: 2,
    });

    synth.applyEnvelope(gain, {
      attack: 0.1,
      decay: 0.2,
      sustain: 0.6,
      release: 0.3,
    }, now, 0.8);

    // Connect
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(manager.getMasterGain());

    // Play
    lfo.start(now);
    osc.start(now);
    lfo.stop(now + 0.8);
    osc.stop(now + 0.8);

    manager.registerSound([osc, gain, lfo], 0.8);
  }

  /**
   * Enemy death scream: Noise burst with pitch drop
   */
  playEnemyDeath(): void {
    const manager = getAudioManager();
    if (!manager.isReady()) return;

    const synth = manager.getSynthEngine();
    const ctx = manager.getContext();
    const now = ctx.currentTime;

    // High pitched scream
    const osc = synth.createOscillator('sawtooth', 800);
    const gain = manager.createSFXGain();

    synth.createPitchSweep(osc, 800, 100, 0.3, now);

    // Distortion for harshness
    const distortion = synth.createDistortion(80);

    // Noise burst
    const { source: noise, filter } = synth.createFilteredNoise(0.3, {
      type: 'bandpass',
      frequency: 1200,
      Q: 2,
    });
    const noiseGain = manager.createSFXGain();
    noiseGain.gain.value = 0.5;

    synth.applyEnvelope(gain, {
      attack: 0.01,
      decay: 0.1,
      sustain: 0.4,
      release: 0.2,
    }, now, 0.3);

    synth.applyEnvelope(noiseGain, {
      attack: 0.01,
      decay: 0.05,
      sustain: 0.3,
      release: 0.15,
    }, now, 0.3);

    // Connect
    osc.connect(distortion);
    distortion.connect(gain);
    filter.connect(noiseGain);
    gain.connect(manager.getMasterGain());
    noiseGain.connect(manager.getMasterGain());

    // Play
    osc.start(now);
    noise.start(now);
    osc.stop(now + 0.3);
    noise.stop(now + 0.3);

    manager.registerSound([osc, gain, noise, noiseGain], 0.3);
  }

  /**
   * Exploder beeping: Accelerating beeps
   */
  playExploderBeep(pitch: number = 1.0): void {
    const manager = getAudioManager();
    if (!manager.isReady()) return;

    const synth = manager.getSynthEngine();
    const ctx = manager.getContext();
    const now = ctx.currentTime;

    const freq = 600 * pitch;
    const osc = synth.createOscillator('square', freq);
    const gain = manager.createSFXGain();
    gain.gain.value = 0.4;

    synth.applyEnvelope(gain, {
      attack: 0.001,
      decay: 0.02,
      sustain: 0.5,
      release: 0.03,
    }, now, 0.06);

    // Connect
    osc.connect(gain);
    gain.connect(manager.getMasterGain());

    // Play
    osc.start(now);
    osc.stop(now + 0.06);

    manager.registerSound([osc, gain], 0.06);
  }

  // ============================================================================
  // PLAYER SOUNDS
  // ============================================================================

  /**
   * Player damage: Glitch/distortion effect
   */
  playPlayerDamage(): void {
    const manager = getAudioManager();
    if (!manager.isReady()) return;

    const synth = manager.getSynthEngine();
    const ctx = manager.getContext();
    const now = ctx.currentTime;

    // Harsh noise burst
    const { source: noise, filter } = synth.createFilteredNoise(0.15, {
      type: 'highpass',
      frequency: 800,
      Q: 2,
    });
    const gain = manager.createSFXGain();

    // Glitchy envelope
    gain.gain.setValueAtTime(0.8, now);
    gain.gain.setValueAtTime(0.2, now + 0.05);
    gain.gain.setValueAtTime(0.6, now + 0.07);
    gain.gain.setValueAtTime(0, now + 0.15);

    // Add distortion
    const distortion = synth.createDistortion(150);

    // Connect
    filter.connect(distortion);
    distortion.connect(gain);
    gain.connect(manager.getMasterGain());

    // Play
    noise.start(now);
    noise.stop(now + 0.15);

    manager.registerSound([noise, gain], 0.15);
  }

  /**
   * Level up: Rising "DING" + whoosh
   */
  playLevelUp(): void {
    const manager = getAudioManager();
    if (!manager.isReady()) return;

    const synth = manager.getSynthEngine();
    const ctx = manager.getContext();
    const now = ctx.currentTime;

    // Ding sound (bell-like)
    const frequencies = [800, 1200, 1600];
    frequencies.forEach((freq, i) => {
      const osc = synth.createOscillator('sine', freq);
      const gain = manager.createSFXGain();
      gain.gain.value = 0.5 / (i + 1);

      synth.applyEnvelope(gain, {
        attack: 0.001,
        decay: 0.1,
        sustain: 0.3,
        release: 0.4,
      }, now, 0.5);

      osc.connect(gain);
      gain.connect(manager.getMasterGain());

      osc.start(now);
      osc.stop(now + 0.5);

      manager.registerSound([osc, gain], 0.5);
    });

    // Rising whoosh
    const whooshOsc = synth.createOscillator('sawtooth', 200);
    const whooshGain = manager.createSFXGain();
    whooshGain.gain.value = 0.3;

    synth.createPitchSweep(whooshOsc, 200, 1000, 0.5, now);

    synth.applyEnvelope(whooshGain, {
      attack: 0.01,
      decay: 0.2,
      sustain: 0.5,
      release: 0.3,
    }, now, 0.5);

    whooshOsc.connect(whooshGain);
    whooshGain.connect(manager.getMasterGain());

    whooshOsc.start(now);
    whooshOsc.stop(now + 0.5);

    manager.registerSound([whooshOsc, whooshGain], 0.5);
  }

  /**
   * Player death: Dramatic descending sweep
   */
  playPlayerDeath(): void {
    const manager = getAudioManager();
    if (!manager.isReady()) return;

    const synth = manager.getSynthEngine();
    const ctx = manager.getContext();
    const now = ctx.currentTime;

    // Dramatic sweep down
    const osc = synth.createOscillator('sawtooth', 440);
    const gain = manager.createSFXGain();

    synth.createPitchSweep(osc, 440, 55, 1.5, now);

    // Add filter sweep
    const filter = synth.createFilter({
      type: 'lowpass',
      frequency: 2000,
      Q: 5,
    });
    filter.frequency.setValueAtTime(2000, now);
    filter.frequency.exponentialRampToValueAtTime(100, now + 1.5);

    synth.applyEnvelope(gain, {
      attack: 0.1,
      decay: 0.3,
      sustain: 0.6,
      release: 0.5,
    }, now, 1.5);

    // Connect
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(manager.getMasterGain());

    // Play
    osc.start(now);
    osc.stop(now + 1.5);

    manager.registerSound([osc, gain], 1.5);
  }

  /**
   * XP pickup: Satisfying "bloop"
   */
  playXPPickup(): void {
    const manager = getAudioManager();
    if (!manager.isReady()) return;

    const synth = manager.getSynthEngine();
    const ctx = manager.getContext();
    const now = ctx.currentTime;

    // Two-tone bloop
    const osc = synth.createOscillator('sine', 400);
    const gain = manager.createSFXGain();
    gain.gain.value = 0.5;

    // Quick pitch jump
    osc.frequency.setValueAtTime(400, now);
    osc.frequency.setValueAtTime(600, now + 0.05);
    osc.frequency.exponentialRampToValueAtTime(200, now + 0.15);

    synth.applyEnvelope(gain, {
      attack: 0.001,
      decay: 0.05,
      sustain: 0.3,
      release: 0.05,
    }, now, 0.15);

    // Connect
    osc.connect(gain);
    gain.connect(manager.getMasterGain());

    // Play
    osc.start(now);
    osc.stop(now + 0.15);

    manager.registerSound([osc, gain], 0.15);
  }

  // ============================================================================
  // AMBIENCE SOUNDS
  // ============================================================================

  /**
   * Heartbeat: Low thump (for low HP warning)
   */
  playHeartbeat(): void {
    const manager = getAudioManager();
    if (!manager.isReady()) return;

    const synth = manager.getSynthEngine();
    const ctx = manager.getContext();
    const now = ctx.currentTime;

    // Bass thump
    const thump = synth.createOscillator('sine', 60);
    const gain = manager.createSFXGain();
    gain.gain.value = 0.8;

    synth.createPitchSweep(thump, 60, 40, 0.2, now);

    synth.applyEnvelope(gain, {
      attack: 0.01,
      decay: 0.05,
      sustain: 0.1,
      release: 0.14,
    }, now, 0.2);

    // Connect
    thump.connect(gain);
    gain.connect(manager.getMasterGain());

    // Play
    thump.start(now);
    thump.stop(now + 0.2);

    manager.registerSound([thump, gain], 0.2);
  }

  /**
   * Boss spawn siren: Rising alarm
   */
  playBossSiren(): void {
    const manager = getAudioManager();
    if (!manager.isReady()) return;

    const synth = manager.getSynthEngine();
    const ctx = manager.getContext();
    const now = ctx.currentTime;

    // Oscillating siren
    const osc = synth.createOscillator('square', 400);
    const gain = manager.createSFXGain();
    gain.gain.value = 0.6;

    // LFO for siren oscillation
    const { lfo, gain: lfoGain } = synth.createLFO(4, 200);
    lfoGain.connect(osc.frequency);

    synth.applyEnvelope(gain, {
      attack: 0.1,
      decay: 0.2,
      sustain: 0.8,
      release: 0.3,
    }, now, 2.0);

    // Connect
    osc.connect(gain);
    gain.connect(manager.getMasterGain());

    // Play
    lfo.start(now);
    osc.start(now);
    lfo.stop(now + 2.0);
    osc.stop(now + 2.0);

    manager.registerSound([osc, gain, lfo], 2.0);
  }
}

// Export singleton instance getter
export const getSoundEffects = () => SoundEffects.getInstance();
