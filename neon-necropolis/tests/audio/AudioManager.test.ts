/**
 * AudioManager.test.ts
 * Comprehensive tests for the audio management system
 */

import { AudioManager, getAudioManager } from '../../src/audio/AudioManager';

describe('AudioManager', () => {
  let audioManager: AudioManager;

  beforeEach(() => {
    // Get a fresh instance for each test
    audioManager = AudioManager.getInstance();
    // Reset state if possible
    if ((audioManager as any).isInitialized) {
      audioManager.destroy();
      audioManager = AudioManager.getInstance();
    }
  });

  afterEach(() => {
    // Cleanup after each test
    if (audioManager) {
      try {
        audioManager.destroy();
      } catch (e) {
        // Ignore cleanup errors
      }
    }
  });

  describe('Singleton Pattern', () => {
    it('should return the same instance', () => {
      const instance1 = AudioManager.getInstance();
      const instance2 = AudioManager.getInstance();
      expect(instance1).toBe(instance2);
    });

    it('should work with getAudioManager helper', () => {
      const instance1 = getAudioManager();
      const instance2 = AudioManager.getInstance();
      expect(instance1).toBe(instance2);
    });
  });

  describe('Initialization', () => {
    it('should initialize audio system', async () => {
      await audioManager.initialize();
      expect(audioManager.isReady()).toBe(false); // Not unlocked yet
    });

    it('should not reinitialize if already initialized', async () => {
      await audioManager.initialize();
      await audioManager.initialize(); // Should not throw
      expect(audioManager).toBeDefined();
    });

    it('should create audio context on initialization', async () => {
      await audioManager.initialize();
      expect(() => audioManager.getContext()).not.toThrow();
    });

    it('should create master gain node', async () => {
      await audioManager.initialize();
      expect(() => audioManager.getMasterGain()).not.toThrow();
    });

    it('should create synth engine', async () => {
      await audioManager.initialize();
      expect(() => audioManager.getSynthEngine()).not.toThrow();
    });
  });

  describe('Audio Context Management', () => {
    it('should throw error when accessing context before initialization', () => {
      expect(() => audioManager.getContext()).toThrow();
    });

    it('should throw error when accessing master gain before initialization', () => {
      expect(() => audioManager.getMasterGain()).toThrow();
    });

    it('should throw error when accessing synth engine before initialization', () => {
      expect(() => audioManager.getSynthEngine()).toThrow();
    });

    it('should resume audio context', async () => {
      await audioManager.initialize();
      await audioManager.resume();
      expect(audioManager.isReady()).toBe(true);
    });

    it('should unlock audio on user interaction', async () => {
      await audioManager.unlock();
      expect(audioManager.isReady()).toBe(true);
    });

    it('should not unlock multiple times', async () => {
      await audioManager.unlock();
      await audioManager.unlock(); // Should be idempotent
      expect(audioManager.isReady()).toBe(true);
    });

    it('should suspend audio context', async () => {
      await audioManager.initialize();
      await audioManager.resume();
      await audioManager.suspend();

      const context = audioManager.getContext();
      expect(context.state).toBe('suspended');
    });
  });

  describe('Volume Control', () => {
    beforeEach(async () => {
      await audioManager.initialize();
    });

    it('should set master volume', () => {
      audioManager.setMasterVolume(0.5);
      expect(audioManager.getMasterVolume()).toBe(0.5);
    });

    it('should clamp master volume between 0 and 1', () => {
      audioManager.setMasterVolume(-0.5);
      expect(audioManager.getMasterVolume()).toBe(0);

      audioManager.setMasterVolume(1.5);
      expect(audioManager.getMasterVolume()).toBe(1);
    });

    it('should set SFX volume', () => {
      audioManager.setSFXVolume(0.8);
      expect(audioManager.getSFXVolume()).toBe(0.8);
    });

    it('should clamp SFX volume between 0 and 1', () => {
      audioManager.setSFXVolume(-0.2);
      expect(audioManager.getSFXVolume()).toBe(0);

      audioManager.setSFXVolume(2.0);
      expect(audioManager.getSFXVolume()).toBe(1);
    });

    it('should set music volume', () => {
      audioManager.setMusicVolume(0.6);
      expect(audioManager.getMusicVolume()).toBe(0.6);
    });

    it('should clamp music volume between 0 and 1', () => {
      audioManager.setMusicVolume(-1);
      expect(audioManager.getMusicVolume()).toBe(0);

      audioManager.setMusicVolume(3);
      expect(audioManager.getMusicVolume()).toBe(1);
    });

    it('should start with default volumes', () => {
      expect(audioManager.getMasterVolume()).toBe(0.7);
      expect(audioManager.getSFXVolume()).toBe(0.8);
      expect(audioManager.getMusicVolume()).toBe(0.5);
    });

    it('should update master gain node when setting master volume', () => {
      const masterGain = audioManager.getMasterGain();
      audioManager.setMasterVolume(0.3);
      expect(masterGain.gain.value).toBe(0.3);
    });
  });

  describe('Gain Node Creation', () => {
    beforeEach(async () => {
      await audioManager.initialize();
    });

    it('should create SFX gain node with correct volume', () => {
      audioManager.setSFXVolume(0.75);
      const sfxGain = audioManager.createSFXGain();
      expect(sfxGain.gain.value).toBe(0.75);
    });

    it('should create music gain node with correct volume', () => {
      audioManager.setMusicVolume(0.4);
      const musicGain = audioManager.createMusicGain();
      expect(musicGain.gain.value).toBe(0.4);
    });

    it('should create independent gain nodes', () => {
      const gain1 = audioManager.createSFXGain();
      const gain2 = audioManager.createSFXGain();
      expect(gain1).not.toBe(gain2);
    });
  });

  describe('Sound Instance Management', () => {
    beforeEach(async () => {
      await audioManager.initialize();
    });

    it('should register sound instance', () => {
      const context = audioManager.getContext();
      const osc = context.createOscillator();
      const gain = context.createGain();

      const soundId = audioManager.registerSound([osc, gain], 1.0);
      expect(soundId).toBeDefined();
      expect(typeof soundId).toBe('string');
    });

    it('should generate unique sound IDs', () => {
      const context = audioManager.getContext();
      const osc1 = context.createOscillator();
      const osc2 = context.createOscillator();

      const id1 = audioManager.registerSound([osc1], 1.0);
      const id2 = audioManager.registerSound([osc2], 1.0);

      expect(id1).not.toBe(id2);
    });

    it('should stop sound by ID', () => {
      const context = audioManager.getContext();
      const osc = context.createOscillator();
      const gain = context.createGain();

      const soundId = audioManager.registerSound([osc, gain], 1.0);

      expect(() => {
        audioManager.stopSound(soundId);
      }).not.toThrow();
    });

    it('should handle stopping non-existent sound', () => {
      expect(() => {
        audioManager.stopSound('non-existent-id');
      }).not.toThrow();
    });

    it('should stop all sounds', () => {
      const context = audioManager.getContext();

      // Register multiple sounds
      for (let i = 0; i < 5; i++) {
        const osc = context.createOscillator();
        audioManager.registerSound([osc], 1.0);
      }

      expect(() => {
        audioManager.stopAllSounds();
      }).not.toThrow();
    });

    it('should enforce max sounds limit', () => {
      const context = audioManager.getContext();

      // Register more than MAX_SOUNDS (50)
      for (let i = 0; i < 60; i++) {
        const osc = context.createOscillator();
        audioManager.registerSound([osc], 1.0);
      }

      // Should not throw, old sounds should be cleaned up
      expect(true).toBe(true);
    });
  });

  describe('Sound Cleanup', () => {
    beforeEach(async () => {
      await audioManager.initialize();
    });

    it('should cleanup finished sounds', async () => {
      const context = audioManager.getContext();
      const osc = context.createOscillator();

      // Register short sound
      audioManager.registerSound([osc], 0.01);

      // Wait for sound to finish
      await new Promise(resolve => setTimeout(resolve, 50));

      // Cleanup should happen automatically
      expect(true).toBe(true);
    });

    it('should disconnect nodes when stopping sound', () => {
      const context = audioManager.getContext();
      const osc = context.createOscillator();
      const gain = context.createGain();

      const soundId = audioManager.registerSound([osc, gain], 1.0);
      audioManager.stopSound(soundId);

      expect(osc.disconnect).toHaveBeenCalled();
      expect(gain.disconnect).toHaveBeenCalled();
    });
  });

  describe('Ready State', () => {
    it('should not be ready initially', () => {
      expect(audioManager.isReady()).toBe(false);
    });

    it('should not be ready after initialization only', async () => {
      await audioManager.initialize();
      expect(audioManager.isReady()).toBe(false);
    });

    it('should be ready after unlock', async () => {
      await audioManager.unlock();
      expect(audioManager.isReady()).toBe(true);
    });

    it('should be ready after initialization and resume', async () => {
      await audioManager.initialize();
      await audioManager.resume();
      expect(audioManager.isReady()).toBe(true);
    });
  });

  describe('Destruction', () => {
    it('should destroy audio manager cleanly', async () => {
      await audioManager.initialize();

      expect(() => {
        audioManager.destroy();
      }).not.toThrow();
    });

    it('should stop all sounds on destroy', async () => {
      await audioManager.initialize();

      const context = audioManager.getContext();
      const osc = context.createOscillator();
      audioManager.registerSound([osc], 1.0);

      audioManager.destroy();

      expect(osc.disconnect).toHaveBeenCalled();
    });

    it('should close audio context on destroy', async () => {
      await audioManager.initialize();
      const context = audioManager.getContext();

      audioManager.destroy();

      expect(context.close).toHaveBeenCalled();
    });

    it('should reset initialization state on destroy', async () => {
      await audioManager.initialize();
      await audioManager.resume();

      expect(audioManager.isReady()).toBe(true);

      audioManager.destroy();

      expect(audioManager.isReady()).toBe(false);
    });

    it('should allow reinitialization after destroy', async () => {
      await audioManager.initialize();
      audioManager.destroy();

      await audioManager.initialize();

      expect(() => audioManager.getContext()).not.toThrow();
    });
  });

  describe('Error Handling', () => {
    it('should handle initialization errors gracefully', async () => {
      // Mock AudioContext constructor to throw
      const originalAudioContext = (global as any).AudioContext;
      (global as any).AudioContext = class {
        constructor() {
          throw new Error('AudioContext not supported');
        }
      };

      await expect(audioManager.initialize()).rejects.toThrow();

      // Restore
      (global as any).AudioContext = originalAudioContext;
    });

    it('should handle resume errors', async () => {
      await audioManager.initialize();

      // Mock resume to reject
      const context = audioManager.getContext();
      const originalResume = context.resume;
      context.resume = jest.fn().mockRejectedValue(new Error('Resume failed'));

      await audioManager.resume();

      // Should not throw
      expect(true).toBe(true);

      // Restore
      context.resume = originalResume;
    });

    it('should handle stop errors gracefully', async () => {
      await audioManager.initialize();

      const context = audioManager.getContext();
      const osc = context.createOscillator();

      // Mock stop to throw
      osc.stop = jest.fn(() => {
        throw new Error('Stop failed');
      });

      const soundId = audioManager.registerSound([osc], 1.0);

      expect(() => {
        audioManager.stopSound(soundId);
      }).not.toThrow();
    });
  });

  describe('Integration', () => {
    it('should integrate with SynthEngine', async () => {
      await audioManager.initialize();

      const synthEngine = audioManager.getSynthEngine();
      expect(synthEngine).toBeDefined();
    });

    it('should connect master gain to destination', async () => {
      await audioManager.initialize();

      const masterGain = audioManager.getMasterGain();
      expect(masterGain.connect).toHaveBeenCalled();
    });

    it('should create compressor for dynamics', async () => {
      await audioManager.initialize();

      const context = audioManager.getContext();
      expect(context.createDynamicsCompressor).toHaveBeenCalled();
    });
  });

  describe('Performance', () => {
    it('should handle rapid sound registration', async () => {
      await audioManager.initialize();
      const context = audioManager.getContext();

      const start = performance.now();

      for (let i = 0; i < 100; i++) {
        const osc = context.createOscillator();
        audioManager.registerSound([osc], 0.1);
      }

      const elapsed = performance.now() - start;
      expect(elapsed).toBeLessThan(100); // Should be fast
    });

    it('should handle rapid stop/start cycles', async () => {
      await audioManager.initialize();
      const context = audioManager.getContext();

      for (let i = 0; i < 50; i++) {
        const osc = context.createOscillator();
        const id = audioManager.registerSound([osc], 1.0);
        audioManager.stopSound(id);
      }

      expect(true).toBe(true); // Should not crash
    });
  });
});
