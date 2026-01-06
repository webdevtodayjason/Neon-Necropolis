/**
 * AudioManager tests
 * Tests audio system initialization, lifecycle, volume controls, and sound pooling
 */
import { AudioManager, getAudioManager } from '../src/audio/AudioManager';

describe('AudioManager', () => {
  let audioManager: AudioManager;

  beforeEach(() => {
    // Get fresh instance
    audioManager = AudioManager.getInstance();
  });

  afterEach(() => {
    // Clean up after each test
    if (audioManager) {
      try {
        audioManager.destroy();
      } catch (e) {
        // Ignore errors during cleanup
      }
    }
  });

  describe('Singleton Pattern', () => {
    test('should return same instance', () => {
      const instance1 = AudioManager.getInstance();
      const instance2 = AudioManager.getInstance();
      expect(instance1).toBe(instance2);
    });

    test('should be accessible via getAudioManager', () => {
      const instance = getAudioManager();
      expect(instance).toBeInstanceOf(AudioManager);
    });
  });

  describe('Initialization', () => {
    test('should initialize audio context', async () => {
      await audioManager.unlock();
      expect(audioManager.isReady()).toBe(true);
    });

    test('should not reinitialize if already initialized', async () => {
      await audioManager.unlock();
      const firstInit = audioManager.isReady();
      await audioManager.unlock();
      const secondInit = audioManager.isReady();
      expect(firstInit).toBe(secondInit);
    });

    test('should have default master volume', () => {
      expect(audioManager.getMasterVolume()).toBe(0.7);
    });

    test('should have default SFX volume', () => {
      expect(audioManager.getSFXVolume()).toBe(0.8);
    });

    test('should have default music volume', () => {
      expect(audioManager.getMusicVolume()).toBe(0.5);
    });

    test('should initialize synth engine', async () => {
      await audioManager.initialize();
      const synthEngine = audioManager.getSynthEngine();
      expect(synthEngine).toBeDefined();
    });

    test('should create master gain node', async () => {
      await audioManager.initialize();
      const masterGain = audioManager.getMasterGain();
      expect(masterGain).toBeDefined();
      expect(masterGain.gain.value).toBe(0.7);
    });

    test('should get audio context', async () => {
      await audioManager.initialize();
      const context = audioManager.getContext();
      expect(context).toBeDefined();
      expect(context.state).toBeDefined();
    });

    test('should throw error when getting context before initialization', () => {
      expect(() => audioManager.getContext()).toThrow();
    });

    test('should throw error when getting synth engine before initialization', () => {
      expect(() => audioManager.getSynthEngine()).toThrow();
    });

    test('should throw error when getting master gain before initialization', () => {
      expect(() => audioManager.getMasterGain()).toThrow();
    });
  });

  describe('Audio Context Lifecycle', () => {
    test('should resume audio context', async () => {
      await audioManager.unlock();
      await audioManager.resume();
      expect(audioManager.isReady()).toBe(true);
    });

    test('should initialize and resume in unlock', async () => {
      await audioManager.unlock();
      expect(audioManager.isReady()).toBe(true);
    });

    test('should not unlock twice', async () => {
      await audioManager.unlock();
      const firstState = audioManager.isReady();
      await audioManager.unlock();
      const secondState = audioManager.isReady();
      expect(firstState).toBe(secondState);
    });

    test('should suspend audio context', async () => {
      await audioManager.initialize();
      await audioManager.suspend();
      const context = audioManager.getContext();
      expect(context.state).toBe('suspended');
    });

    test('should destroy audio manager', async () => {
      await audioManager.initialize();
      audioManager.destroy();
      expect(audioManager.isReady()).toBe(false);
    });
  });

  describe('Volume Controls', () => {
    test('should set master volume', () => {
      audioManager.setMasterVolume(0.5);
      expect(audioManager.getMasterVolume()).toBe(0.5);
    });

    test('should clamp master volume to 0-1 range', () => {
      audioManager.setMasterVolume(1.5);
      expect(audioManager.getMasterVolume()).toBe(1.0);

      audioManager.setMasterVolume(-0.5);
      expect(audioManager.getMasterVolume()).toBe(0.0);
    });

    test('should set SFX volume', () => {
      audioManager.setSFXVolume(0.6);
      expect(audioManager.getSFXVolume()).toBe(0.6);
    });

    test('should clamp SFX volume to 0-1 range', () => {
      audioManager.setSFXVolume(2.0);
      expect(audioManager.getSFXVolume()).toBe(1.0);

      audioManager.setSFXVolume(-1.0);
      expect(audioManager.getSFXVolume()).toBe(0.0);
    });

    test('should set music volume', () => {
      audioManager.setMusicVolume(0.3);
      expect(audioManager.getMusicVolume()).toBe(0.3);
    });

    test('should clamp music volume to 0-1 range', () => {
      audioManager.setMusicVolume(3.0);
      expect(audioManager.getMusicVolume()).toBe(1.0);

      audioManager.setMusicVolume(-2.0);
      expect(audioManager.getMusicVolume()).toBe(0.0);
    });

    test('should update master gain node when setting volume', async () => {
      await audioManager.initialize();
      audioManager.setMasterVolume(0.4);
      const masterGain = audioManager.getMasterGain();
      expect(masterGain.gain.value).toBe(0.4);
    });
  });

  describe('Gain Node Creation', () => {
    beforeEach(async () => {
      await audioManager.initialize();
    });

    test('should create SFX gain node', () => {
      const gain = audioManager.createSFXGain();
      expect(gain).toBeDefined();
      expect(gain.gain.value).toBe(audioManager.getSFXVolume());
    });

    test('should create music gain node', () => {
      const gain = audioManager.createMusicGain();
      expect(gain).toBeDefined();
      expect(gain.gain.value).toBe(audioManager.getMusicVolume());
    });

    test('should create SFX gain with correct volume', () => {
      audioManager.setSFXVolume(0.3);
      const gain = audioManager.createSFXGain();
      expect(gain.gain.value).toBe(0.3);
    });

    test('should create music gain with correct volume', () => {
      audioManager.setMusicVolume(0.2);
      const gain = audioManager.createMusicGain();
      expect(gain.gain.value).toBe(0.2);
    });
  });

  describe('Sound Registration and Tracking', () => {
    beforeEach(async () => {
      await audioManager.initialize();
    });

    test('should register sound', () => {
      const context = audioManager.getContext();
      const osc = context.createOscillator();
      const gain = context.createGain();

      const id = audioManager.registerSound([osc, gain], 1.0);
      expect(id).toBeDefined();
      expect(typeof id).toBe('string');
      expect(id).toContain('sound_');
    });

    test('should generate unique sound IDs', () => {
      const context = audioManager.getContext();
      const id1 = audioManager.registerSound([context.createOscillator()], 1.0);
      const id2 = audioManager.registerSound([context.createOscillator()], 1.0);
      expect(id1).not.toBe(id2);
    });

    test('should stop sound by ID', () => {
      const context = audioManager.getContext();
      const osc = context.createOscillator();
      const id = audioManager.registerSound([osc], 1.0);

      expect(() => audioManager.stopSound(id)).not.toThrow();
    });

    test('should handle stopping non-existent sound', () => {
      expect(() => audioManager.stopSound('non-existent')).not.toThrow();
    });

    test('should stop all sounds', () => {
      const context = audioManager.getContext();

      // Register multiple sounds
      audioManager.registerSound([context.createOscillator()], 1.0);
      audioManager.registerSound([context.createOscillator()], 1.0);
      audioManager.registerSound([context.createOscillator()], 1.0);

      expect(() => audioManager.stopAllSounds()).not.toThrow();
    });

    test('should handle stopping already stopped sound', () => {
      const context = audioManager.getContext();
      const id = audioManager.registerSound([context.createOscillator()], 1.0);

      audioManager.stopSound(id);
      // Stopping again should not throw
      expect(() => audioManager.stopSound(id)).not.toThrow();
    });
  });

  describe('Sound Pooling and Limits', () => {
    beforeEach(async () => {
      await audioManager.initialize();
    });

    test('should enforce maximum sound limit', () => {
      const context = audioManager.getContext();
      const MAX_SOUNDS = 50;

      // Register more than max sounds
      for (let i = 0; i < MAX_SOUNDS + 10; i++) {
        audioManager.registerSound([context.createOscillator()], 1.0);
      }

      // Should not throw and should handle cleanup
      expect(() => {
        audioManager.registerSound([context.createOscillator()], 1.0);
      }).not.toThrow();
    });

    test('should register sounds with different durations', () => {
      const context = audioManager.getContext();

      const id1 = audioManager.registerSound([context.createOscillator()], 0.5);
      const id2 = audioManager.registerSound([context.createOscillator()], 2.0);

      expect(id1).toBeDefined();
      expect(id2).toBeDefined();
    });
  });

  describe('State Queries', () => {
    test('should report not ready before initialization', () => {
      expect(audioManager.isReady()).toBe(false);
    });

    test('should report ready after initialization and unlock', async () => {
      await audioManager.unlock();
      expect(audioManager.isReady()).toBe(true);
    });

    test('should report not ready after destroy', async () => {
      await audioManager.initialize();
      audioManager.destroy();
      expect(audioManager.isReady()).toBe(false);
    });
  });

  describe('Edge Cases', () => {
    test('should handle multiple initializations gracefully', async () => {
      await audioManager.unlock();
      await audioManager.unlock();
      await audioManager.unlock();
      expect(audioManager.isReady()).toBe(true);
    });

    test('should handle destroy before initialization', () => {
      expect(() => audioManager.destroy()).not.toThrow();
    });

    test('should handle suspend before initialization', async () => {
      await expect(audioManager.suspend()).resolves.not.toThrow();
    });

    test('should handle volume changes before initialization', () => {
      expect(() => {
        audioManager.setMasterVolume(0.5);
        audioManager.setSFXVolume(0.5);
        audioManager.setMusicVolume(0.5);
      }).not.toThrow();
    });

    test('should handle zero volume', () => {
      audioManager.setMasterVolume(0);
      audioManager.setSFXVolume(0);
      audioManager.setMusicVolume(0);

      expect(audioManager.getMasterVolume()).toBe(0);
      expect(audioManager.getSFXVolume()).toBe(0);
      expect(audioManager.getMusicVolume()).toBe(0);
    });

    test('should handle max volume', () => {
      audioManager.setMasterVolume(1);
      audioManager.setSFXVolume(1);
      audioManager.setMusicVolume(1);

      expect(audioManager.getMasterVolume()).toBe(1);
      expect(audioManager.getSFXVolume()).toBe(1);
      expect(audioManager.getMusicVolume()).toBe(1);
    });

    test('should handle rapid volume changes', () => {
      for (let i = 0; i < 100; i++) {
        audioManager.setMasterVolume(Math.random());
      }
      expect(audioManager.getMasterVolume()).toBeGreaterThanOrEqual(0);
      expect(audioManager.getMasterVolume()).toBeLessThanOrEqual(1);
    });

    test('should handle registering sound with empty node array', async () => {
      await audioManager.initialize();
      const id = audioManager.registerSound([], 1.0);
      expect(id).toBeDefined();
    });

    test('should handle zero duration sounds', async () => {
      await audioManager.initialize();
      const context = audioManager.getContext();
      const id = audioManager.registerSound([context.createOscillator()], 0);
      expect(id).toBeDefined();
    });

    test('should handle very long duration sounds', async () => {
      await audioManager.initialize();
      const context = audioManager.getContext();
      const id = audioManager.registerSound([context.createOscillator()], 1000);
      expect(id).toBeDefined();
    });
  });

  describe('Integration', () => {
    test('should complete full lifecycle', async () => {
      // Initialize
      await audioManager.unlock();
      expect(audioManager.isReady()).toBe(true);

      // Set volumes
      audioManager.setMasterVolume(0.5);
      audioManager.setSFXVolume(0.6);

      // Create nodes
      const sfxGain = audioManager.createSFXGain();
      const musicGain = audioManager.createMusicGain();
      expect(sfxGain).toBeDefined();
      expect(musicGain).toBeDefined();

      // Register sounds
      const context = audioManager.getContext();
      const id1 = audioManager.registerSound([context.createOscillator()], 1.0);
      const id2 = audioManager.registerSound([context.createOscillator()], 1.0);

      // Stop sounds
      audioManager.stopSound(id1);
      audioManager.stopAllSounds();

      // Suspend and resume
      await audioManager.suspend();
      await audioManager.resume();

      // Destroy
      audioManager.destroy();
      expect(audioManager.isReady()).toBe(false);
    });
  });
});
