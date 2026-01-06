/**
 * Audio System Entry Point
 *
 * NEON NECROPOLIS - Complete Audio System
 * Procedural sound generation and synthwave music
 */

// Core Audio Engine
export { AudioManager, getAudioManager } from './AudioManager';
export type { SoundInstance } from './AudioManager';

// Synthesis Engine
export { SynthEngine } from './SynthEngine';
export type { OscillatorType, ADSREnvelope, FilterConfig } from './SynthEngine';

// Sound Effects
export { SoundEffects, getSoundEffects } from './SoundEffects';

// Music System
export { MusicManager, getMusicManager } from './MusicManager';
export type { MusicIntensity } from './MusicManager';

/**
 * Quick Start Guide:
 *
 * 1. Initialize audio (call on user interaction):
 *    ```typescript
 *    import { getAudioManager } from './audio';
 *    await getAudioManager().initialize();
 *    await getAudioManager().unlock();
 *    ```
 *
 * 2. Play sound effects:
 *    ```typescript
 *    import { getSoundEffects } from './audio';
 *    getSoundEffects().playPistol();
 *    getSoundEffects().playExplosion();
 *    ```
 *
 * 3. Control music:
 *    ```typescript
 *    import { getMusicManager } from './audio';
 *    getMusicManager().start();
 *    getMusicManager().setIntensity('high');
 *    ```
 *
 * 4. Adjust volumes:
 *    ```typescript
 *    getAudioManager().setMasterVolume(0.8);
 *    getAudioManager().setSFXVolume(0.9);
 *    getAudioManager().setMusicVolume(0.6);
 *    ```
 */
