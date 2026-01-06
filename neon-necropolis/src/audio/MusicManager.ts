/**
 * MusicManager.ts
 * Procedural synthwave background music for NEON NECROPOLIS
 * Dynamic intensity layers that respond to gameplay
 */

import { getAudioManager } from './AudioManager';
import { SynthEngine } from './SynthEngine';

export type MusicIntensity = 'calm' | 'low' | 'medium' | 'high' | 'boss';

interface MusicLayer {
  oscillators: OscillatorNode[];
  gains: GainNode[];
  targetVolume: number;
  currentVolume: number;
}

export class MusicManager {
  private static instance: MusicManager | null = null;

  private isPlaying: boolean = false;
  private currentIntensity: MusicIntensity = 'calm';

  // Music layers
  private bassLayer: MusicLayer | null = null;
  private padLayer: MusicLayer | null = null;
  private leadLayer: MusicLayer | null = null;
  private arpeggioLayer: MusicLayer | null = null;

  // Chord progression (I - VI - III - VII in C minor)
  private chordProgression = [
    [130.81, 155.56, 196.00], // Cm (C, Eb, G)
    [174.61, 207.65, 261.63], // Ab (Ab, C, Eb)
    [155.56, 185.00, 233.08], // Eb (Eb, G, Bb)
    [246.94, 293.66, 369.99], // Bb (Bb, D, F)
  ];

  private currentChordIndex: number = 0;
  private chordChangeInterval: number = 4000; // ms
  private lastChordChange: number = 0;

  // Bass line pattern (root notes)
  private bassPattern = [130.81, 130.81, 174.61, 155.56]; // C, C, Ab, Eb
  private currentBassIndex: number = 0;
  private bassInterval: number = 500; // ms
  private lastBassNote: number = 0;

  // Intensity volume settings
  private intensitySettings = {
    calm: { bass: 0.3, pad: 0.2, lead: 0.0, arpeggio: 0.0 },
    low: { bass: 0.4, pad: 0.3, lead: 0.1, arpeggio: 0.0 },
    medium: { bass: 0.5, pad: 0.4, lead: 0.2, arpeggio: 0.2 },
    high: { bass: 0.6, pad: 0.5, lead: 0.3, arpeggio: 0.3 },
    boss: { bass: 0.8, pad: 0.6, lead: 0.5, arpeggio: 0.4 },
  };

  private updateInterval: number | null = null;
  private readonly UPDATE_RATE = 100; // ms

  private constructor() {}

  static getInstance(): MusicManager {
    if (!MusicManager.instance) {
      MusicManager.instance = new MusicManager();
    }
    return MusicManager.instance;
  }

  /**
   * Start playing background music
   */
  start(): void {
    if (this.isPlaying) {
      return;
    }

    const manager = getAudioManager();
    if (!manager.isReady()) {
      console.warn('[MusicManager] Audio system not ready');
      return;
    }

    console.log('[MusicManager] Starting music...');

    // Initialize all layers
    this.initializeLayers();

    // Start update loop
    this.isPlaying = true;
    this.lastChordChange = Date.now();
    this.lastBassNote = Date.now();

    if (typeof window !== 'undefined') {
      this.updateInterval = window.setInterval(() => {
        this.update();
      }, this.UPDATE_RATE);
    }
  }

  /**
   * Stop the music
   */
  stop(): void {
    if (!this.isPlaying) {
      return;
    }

    console.log('[MusicManager] Stopping music...');

    // Stop all layers
    this.stopLayer(this.bassLayer);
    this.stopLayer(this.padLayer);
    this.stopLayer(this.leadLayer);
    this.stopLayer(this.arpeggioLayer);

    this.bassLayer = null;
    this.padLayer = null;
    this.leadLayer = null;
    this.arpeggioLayer = null;

    // Stop update loop
    if (this.updateInterval !== null) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }

    this.isPlaying = false;
  }

  /**
   * Set music intensity (responds to gameplay)
   */
  setIntensity(intensity: MusicIntensity): void {
    if (this.currentIntensity === intensity) {
      return;
    }

    console.log(`[MusicManager] Intensity: ${this.currentIntensity} -> ${intensity}`);
    this.currentIntensity = intensity;

    // Update target volumes for all layers
    const settings = this.intensitySettings[intensity];
    if (this.bassLayer) this.bassLayer.targetVolume = settings.bass;
    if (this.padLayer) this.padLayer.targetVolume = settings.pad;
    if (this.leadLayer) this.leadLayer.targetVolume = settings.lead;
    if (this.arpeggioLayer) this.arpeggioLayer.targetVolume = settings.arpeggio;
  }

  /**
   * Get current intensity
   */
  getIntensity(): MusicIntensity {
    return this.currentIntensity;
  }

  /**
   * Initialize all music layers
   */
  private initializeLayers(): void {
    // Bass layer - deep, pulsing sub-bass
    this.bassLayer = this.createLayer(0.4);

    // Pad layer - sustained chords
    this.padLayer = this.createLayer(0.3);
    this.startPadLayer();

    // Lead layer - melodic synth line
    this.leadLayer = this.createLayer(0.0);

    // Arpeggio layer - fast arpeggiated chords
    this.arpeggioLayer = this.createLayer(0.0);
  }

  /**
   * Create a music layer
   */
  private createLayer(initialVolume: number): MusicLayer {
    return {
      oscillators: [],
      gains: [],
      targetVolume: initialVolume,
      currentVolume: initialVolume,
    };
  }

  /**
   * Update music state
   */
  private update(): void {
    if (!this.isPlaying) {
      return;
    }

    const now = Date.now();

    // Update chord progression
    if (now - this.lastChordChange >= this.chordChangeInterval) {
      this.changeChord();
      this.lastChordChange = now;
    }

    // Update bass pattern
    if (now - this.lastBassNote >= this.bassInterval) {
      this.playBassNote();
      this.lastBassNote = now;
    }

    // Smooth volume transitions
    this.updateLayerVolumes();
  }

  /**
   * Change to next chord in progression
   */
  private changeChord(): void {
    this.currentChordIndex = (this.currentChordIndex + 1) % this.chordProgression.length;

    // Restart pad layer with new chord
    this.stopLayer(this.padLayer);
    this.startPadLayer();
  }

  /**
   * Start the pad layer (sustained chords)
   */
  private startPadLayer(): void {
    if (!this.padLayer) return;

    const manager = getAudioManager();
    const synth = manager.getSynthEngine();
    const ctx = manager.getContext();
    const now = ctx.currentTime;

    const chord = this.chordProgression[this.currentChordIndex];

    // Create oscillators for each note in the chord
    chord.forEach((freq) => {
      // Use multiple oscillators per note for richness
      const osc1 = synth.createOscillator('sawtooth', freq);
      const osc2 = synth.createOscillator('sawtooth', freq * 2); // Octave up
      const osc3 = synth.createOscillator('triangle', freq * 0.5); // Octave down

      // Create gain nodes
      const gain1 = manager.createMusicGain();
      const gain2 = manager.createMusicGain();
      const gain3 = manager.createMusicGain();

      gain1.gain.value = this.padLayer!.currentVolume * 0.4;
      gain2.gain.value = this.padLayer!.currentVolume * 0.2;
      gain3.gain.value = this.padLayer!.currentVolume * 0.3;

      // Add subtle filter for warmth
      const filter = synth.createFilter({
        type: 'lowpass',
        frequency: 800,
        Q: 1,
      });

      // Connect
      osc1.connect(gain1);
      osc2.connect(gain2);
      osc3.connect(gain3);

      gain1.connect(filter);
      gain2.connect(filter);
      gain3.connect(filter);

      filter.connect(manager.getMasterGain());

      // Start
      osc1.start(now);
      osc2.start(now);
      osc3.start(now);

      // Store references
      this.padLayer!.oscillators.push(osc1, osc2, osc3);
      this.padLayer!.gains.push(gain1, gain2, gain3);
    });
  }

  /**
   * Play a bass note
   */
  private playBassNote(): void {
    if (!this.bassLayer) return;

    const manager = getAudioManager();
    const synth = manager.getSynthEngine();
    const ctx = manager.getContext();
    const now = ctx.currentTime;

    const freq = this.bassPattern[this.currentBassIndex];
    this.currentBassIndex = (this.currentBassIndex + 1) % this.bassPattern.length;

    // Create bass oscillator
    const osc = synth.createOscillator('sine', freq);
    const gain = manager.createMusicGain();
    gain.gain.value = this.bassLayer.currentVolume;

    // Apply envelope for punchy bass
    synth.applyEnvelope(
      gain,
      {
        attack: 0.01,
        decay: 0.1,
        sustain: 0.3,
        release: 0.2,
      },
      now,
      0.4
    );

    // Connect
    osc.connect(gain);
    gain.connect(manager.getMasterGain());

    // Play
    osc.start(now);
    osc.stop(now + 0.4);

    // Clean up after it finishes
    setTimeout(() => {
      try {
        osc.disconnect();
        gain.disconnect();
      } catch (e) {
        // Already disconnected
      }
    }, 500);
  }

  /**
   * Smoothly update layer volumes
   */
  private updateLayerVolumes(): void {
    const smoothing = 0.05;

    // Update each layer
    [this.bassLayer, this.padLayer, this.leadLayer, this.arpeggioLayer].forEach((layer) => {
      if (!layer) return;

      // Smooth transition to target volume
      const diff = layer.targetVolume - layer.currentVolume;
      layer.currentVolume += diff * smoothing;

      // Update all gain nodes in the layer
      layer.gains.forEach((gain) => {
        if (gain && gain.gain) {
          gain.gain.value = layer.currentVolume;
        }
      });
    });
  }

  /**
   * Stop a music layer
   */
  private stopLayer(layer: MusicLayer | null): void {
    if (!layer) return;

    const manager = getAudioManager();
    const ctx = manager.getContext();
    const now = ctx.currentTime;

    // Fade out and stop all oscillators
    layer.gains.forEach((gain) => {
      if (gain && gain.gain) {
        gain.gain.linearRampToValueAtTime(0, now + 0.5);
      }
    });

    setTimeout(() => {
      layer.oscillators.forEach((osc) => {
        try {
          if (osc) {
            osc.stop();
            osc.disconnect();
          }
        } catch (e) {
          // Already stopped
        }
      });

      layer.gains.forEach((gain) => {
        try {
          if (gain) {
            gain.disconnect();
          }
        } catch (e) {
          // Already disconnected
        }
      });

      layer.oscillators = [];
      layer.gains = [];
    }, 600);
  }

  /**
   * Check if music is playing
   */
  isActive(): boolean {
    return this.isPlaying;
  }
}

// Export singleton instance getter
export const getMusicManager = () => MusicManager.getInstance();
