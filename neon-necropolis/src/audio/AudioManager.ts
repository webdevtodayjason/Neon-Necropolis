/**
 * AudioManager.ts
 * Central audio management system for NEON NECROPOLIS
 * Handles AudioContext lifecycle, master volume, and sound pooling
 */

import { SynthEngine } from './SynthEngine';

export interface SoundInstance {
  id: string;
  nodes: AudioNode[];
  stopTime: number;
  isPlaying: boolean;
}

export class AudioManager {
  private static instance: AudioManager | null = null;

  private audioContext: AudioContext | null = null;
  private synthEngine: SynthEngine | null = null;
  private masterGain: GainNode | null = null;
  private compressor: DynamicsCompressorNode | null = null;

  private masterVolume: number = 0.7;
  private sfxVolume: number = 0.8;
  private musicVolume: number = 0.5;

  private activeSounds: Map<string, SoundInstance> = new Map();
  private soundIdCounter: number = 0;

  private isInitialized: boolean = false;
  private isUnlocked: boolean = false;

  // Sound pooling limits
  private readonly MAX_SOUNDS = 50;
  private readonly CLEANUP_INTERVAL = 1000; // ms

  private cleanupTimer: number | null = null;

  private constructor() {
    // Private constructor for singleton
  }

  /**
   * Get singleton instance
   */
  static getInstance(): AudioManager {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager();
    }
    return AudioManager.instance;
  }

  /**
   * Initialize the audio system
   * Must be called after user interaction due to browser autoplay policies
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    try {
      // Create audio context
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

      // Create synth engine
      this.synthEngine = new SynthEngine(this.audioContext);

      // Create master gain node
      this.masterGain = this.audioContext.createGain();
      this.masterGain.gain.value = this.masterVolume;

      // Create compressor to prevent clipping
      this.compressor = this.audioContext.createDynamicsCompressor();
      this.compressor.threshold.value = -20;
      this.compressor.knee.value = 30;
      this.compressor.ratio.value = 12;
      this.compressor.attack.value = 0.003;
      this.compressor.release.value = 0.25;

      // Connect master chain: masterGain -> compressor -> destination
      this.masterGain.connect(this.compressor);
      this.compressor.connect(this.audioContext.destination);

      this.isInitialized = true;

      // Start cleanup timer
      this.startCleanupTimer();

      console.log('[AudioManager] Initialized successfully');
    } catch (error) {
      console.error('[AudioManager] Failed to initialize:', error);
      throw error;
    }
  }

  /**
   * Resume audio context (required for user interaction unlock)
   */
  async resume(): Promise<void> {
    if (!this.audioContext) {
      await this.initialize();
    }

    if (this.audioContext && this.audioContext.state === 'suspended') {
      try {
        await this.audioContext.resume();
        this.isUnlocked = true;
        console.log('[AudioManager] Audio context resumed');
      } catch (error) {
        console.error('[AudioManager] Failed to resume:', error);
      }
    }
  }

  /**
   * Unlock audio on first user interaction
   * Call this on click, touch, or keypress events
   */
  async unlock(): Promise<void> {
    if (this.isUnlocked) {
      return;
    }

    if (!this.isInitialized) {
      await this.initialize();
    }

    await this.resume();

    // Play silent sound to fully unlock on iOS
    if (this.audioContext && this.synthEngine) {
      const osc = this.synthEngine.createOscillator('sine', 440);
      const gain = this.audioContext.createGain();
      gain.gain.value = 0;
      osc.connect(gain);
      gain.connect(this.audioContext.destination);
      osc.start();
      osc.stop(this.audioContext.currentTime + 0.01);
    }

    this.isUnlocked = true;
    console.log('[AudioManager] Audio unlocked');
  }

  /**
   * Get the synth engine
   */
  getSynthEngine(): SynthEngine {
    if (!this.synthEngine) {
      throw new Error('[AudioManager] Audio system not initialized');
    }
    return this.synthEngine;
  }

  /**
   * Get the master gain node for connecting sounds
   */
  getMasterGain(): GainNode {
    if (!this.masterGain) {
      throw new Error('[AudioManager] Audio system not initialized');
    }
    return this.masterGain;
  }

  /**
   * Get audio context
   */
  getContext(): AudioContext {
    if (!this.audioContext) {
      throw new Error('[AudioManager] Audio system not initialized');
    }
    return this.audioContext;
  }

  /**
   * Create a gain node for a sound effect
   */
  createSFXGain(): GainNode {
    const context = this.getContext();
    const gain = context.createGain();
    gain.gain.value = this.sfxVolume;
    return gain;
  }

  /**
   * Create a gain node for music
   */
  createMusicGain(): GainNode {
    const context = this.getContext();
    const gain = context.createGain();
    gain.gain.value = this.musicVolume;
    return gain;
  }

  /**
   * Register a sound instance for tracking and cleanup
   */
  registerSound(nodes: AudioNode[], duration: number): string {
    const id = `sound_${this.soundIdCounter++}`;
    const stopTime = this.getContext().currentTime + duration;

    const instance: SoundInstance = {
      id,
      nodes,
      stopTime,
      isPlaying: true,
    };

    this.activeSounds.set(id, instance);

    // Enforce max sounds limit
    if (this.activeSounds.size > this.MAX_SOUNDS) {
      this.cleanupOldestSounds();
    }

    return id;
  }

  /**
   * Stop a sound by ID
   */
  stopSound(id: string): void {
    const sound = this.activeSounds.get(id);
    if (sound && sound.isPlaying) {
      sound.nodes.forEach(node => {
        try {
          if ('stop' in node && typeof (node as any).stop === 'function') {
            (node as AudioScheduledSourceNode).stop();
          }
          node.disconnect();
        } catch (e) {
          // Node may already be stopped
        }
      });
      sound.isPlaying = false;
      this.activeSounds.delete(id);
    }
  }

  /**
   * Stop all sounds
   */
  stopAllSounds(): void {
    this.activeSounds.forEach((_, id) => this.stopSound(id));
    this.activeSounds.clear();
  }

  /**
   * Cleanup finished sounds
   */
  private cleanupFinishedSounds(): void {
    const now = this.getContext().currentTime;
    const toDelete: string[] = [];

    this.activeSounds.forEach((sound, id) => {
      if (!sound.isPlaying || sound.stopTime < now) {
        toDelete.push(id);
      }
    });

    toDelete.forEach(id => this.stopSound(id));
  }

  /**
   * Force cleanup oldest sounds when limit is reached
   */
  private cleanupOldestSounds(): void {
    const sortedSounds = Array.from(this.activeSounds.entries())
      .sort((a, b) => a[1].stopTime - b[1].stopTime);

    // Remove oldest 10 sounds
    for (let i = 0; i < 10 && i < sortedSounds.length; i++) {
      this.stopSound(sortedSounds[i][0]);
    }
  }

  /**
   * Start periodic cleanup timer
   */
  private startCleanupTimer(): void {
    if (typeof window !== 'undefined') {
      this.cleanupTimer = window.setInterval(() => {
        this.cleanupFinishedSounds();
      }, this.CLEANUP_INTERVAL);
    }
  }

  /**
   * Stop cleanup timer
   */
  private stopCleanupTimer(): void {
    if (this.cleanupTimer !== null) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = null;
    }
  }

  /**
   * Set master volume (0-1)
   */
  setMasterVolume(volume: number): void {
    this.masterVolume = Math.max(0, Math.min(1, volume));
    if (this.masterGain) {
      this.masterGain.gain.value = this.masterVolume;
    }
  }

  /**
   * Set SFX volume (0-1)
   */
  setSFXVolume(volume: number): void {
    this.sfxVolume = Math.max(0, Math.min(1, volume));
  }

  /**
   * Set music volume (0-1)
   */
  setMusicVolume(volume: number): void {
    this.musicVolume = Math.max(0, Math.min(1, volume));
  }

  /**
   * Get master volume
   */
  getMasterVolume(): number {
    return this.masterVolume;
  }

  /**
   * Get SFX volume
   */
  getSFXVolume(): number {
    return this.sfxVolume;
  }

  /**
   * Get music volume
   */
  getMusicVolume(): number {
    return this.musicVolume;
  }

  /**
   * Check if audio is initialized
   */
  isReady(): boolean {
    return this.isInitialized && this.isUnlocked;
  }

  /**
   * Suspend audio context (save power when game is paused)
   */
  async suspend(): Promise<void> {
    if (this.audioContext && this.audioContext.state === 'running') {
      await this.audioContext.suspend();
      console.log('[AudioManager] Audio context suspended');
    }
  }

  /**
   * Destroy audio manager (cleanup)
   */
  destroy(): void {
    this.stopAllSounds();
    this.stopCleanupTimer();

    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }

    this.synthEngine = null;
    this.masterGain = null;
    this.compressor = null;
    this.isInitialized = false;
    this.isUnlocked = false;

    console.log('[AudioManager] Destroyed');
  }
}

// Export singleton instance getter
export const getAudioManager = () => AudioManager.getInstance();
