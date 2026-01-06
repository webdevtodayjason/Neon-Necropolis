/**
 * AudioDemo.ts
 * Demonstration and testing of the complete audio system
 * Use this to test all audio features
 */

import {
  getAudioManager,
  getSoundEffects,
  getMusicManager,
  type MusicIntensity,
} from './index';

export class AudioDemo {
  private static instance: AudioDemo | null = null;
  private isInitialized: boolean = false;

  private constructor() {}

  static getInstance(): AudioDemo {
    if (!AudioDemo.instance) {
      AudioDemo.instance = new AudioDemo();
    }
    return AudioDemo.instance;
  }

  /**
   * Initialize audio system
   * MUST be called after a user interaction (click, keypress, etc.)
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) {
      console.log('✅ Audio already initialized');
      return;
    }

    try {
      console.log('🎵 Initializing audio system...');

      const audioManager = getAudioManager();
      await audioManager.initialize();
      await audioManager.unlock();

      this.isInitialized = true;
      console.log('✅ Audio system initialized successfully!');
    } catch (error) {
      console.error('❌ Failed to initialize audio:', error);
      throw error;
    }
  }

  /**
   * Test all weapon sounds
   */
  testWeaponSounds(): void {
    if (!this.isInitialized) {
      console.warn('⚠️ Audio not initialized. Call initialize() first.');
      return;
    }

    const sfx = getSoundEffects();
    console.log('🔫 Testing weapon sounds...');

    const weapons = [
      { name: 'Pistol', fn: () => sfx.playPistol() },
      { name: 'Shotgun', fn: () => sfx.playShotgun() },
      { name: 'Laser', fn: () => sfx.playLaser() },
      { name: 'Lightning', fn: () => sfx.playLightning() },
      { name: 'Missile', fn: () => sfx.playMissile() },
      { name: 'Flamethrower', fn: () => sfx.playFlamethrower() },
      { name: 'Tesla', fn: () => sfx.playTesla() },
      { name: 'Ice', fn: () => sfx.playIce() },
      { name: 'Orbital', fn: () => sfx.playOrbital() },
      { name: 'Poison', fn: () => sfx.playPoison() },
    ];

    weapons.forEach((weapon, index) => {
      setTimeout(() => {
        console.log(`  🎯 ${weapon.name}`);
        weapon.fn();
      }, index * 800);
    });
  }

  /**
   * Test enemy sounds
   */
  testEnemySounds(): void {
    if (!this.isInitialized) {
      console.warn('⚠️ Audio not initialized. Call initialize() first.');
      return;
    }

    const sfx = getSoundEffects();
    console.log('🧟 Testing enemy sounds...');

    setTimeout(() => {
      console.log('  👻 Zombie moan');
      sfx.playZombieMoan();
    }, 0);

    setTimeout(() => {
      console.log('  💀 Enemy death');
      sfx.playEnemyDeath();
    }, 1000);

    setTimeout(() => {
      console.log('  💣 Exploder beep (low)');
      sfx.playExploderBeep(0.8);
    }, 2000);

    setTimeout(() => {
      console.log('  💣 Exploder beep (high)');
      sfx.playExploderBeep(1.5);
    }, 2500);
  }

  /**
   * Test player sounds
   */
  testPlayerSounds(): void {
    if (!this.isInitialized) {
      console.warn('⚠️ Audio not initialized. Call initialize() first.');
      return;
    }

    const sfx = getSoundEffects();
    console.log('👤 Testing player sounds...');

    setTimeout(() => {
      console.log('  ✨ XP Pickup');
      sfx.playXPPickup();
    }, 0);

    setTimeout(() => {
      console.log('  ⚡ Level Up');
      sfx.playLevelUp();
    }, 500);

    setTimeout(() => {
      console.log('  💥 Player Damage');
      sfx.playPlayerDamage();
    }, 1500);

    setTimeout(() => {
      console.log('  💀 Player Death');
      sfx.playPlayerDeath();
    }, 2000);
  }

  /**
   * Test ambient and special sounds
   */
  testAmbientSounds(): void {
    if (!this.isInitialized) {
      console.warn('⚠️ Audio not initialized. Call initialize() first.');
      return;
    }

    const sfx = getSoundEffects();
    console.log('🌆 Testing ambient sounds...');

    setTimeout(() => {
      console.log('  💓 Heartbeat');
      sfx.playHeartbeat();
    }, 0);

    setTimeout(() => {
      console.log('  💓 Heartbeat');
      sfx.playHeartbeat();
    }, 800);

    setTimeout(() => {
      console.log('  🚨 Boss Siren');
      sfx.playBossSiren();
    }, 1600);

    setTimeout(() => {
      console.log('  💥 Explosion');
      sfx.playExplosion();
    }, 4000);
  }

  /**
   * Start background music
   */
  startMusic(): void {
    if (!this.isInitialized) {
      console.warn('⚠️ Audio not initialized. Call initialize() first.');
      return;
    }

    const music = getMusicManager();
    console.log('🎶 Starting background music...');
    music.start();
  }

  /**
   * Stop background music
   */
  stopMusic(): void {
    const music = getMusicManager();
    console.log('🔇 Stopping background music...');
    music.stop();
  }

  /**
   * Cycle through music intensity levels
   */
  cycleMusicIntensity(): void {
    if (!this.isInitialized) {
      console.warn('⚠️ Audio not initialized. Call initialize() first.');
      return;
    }

    const music = getMusicManager();
    const intensities: MusicIntensity[] = ['calm', 'low', 'medium', 'high', 'boss'];

    console.log('🎵 Cycling through music intensities...');

    intensities.forEach((intensity, index) => {
      setTimeout(() => {
        console.log(`  📊 Intensity: ${intensity.toUpperCase()}`);
        music.setIntensity(intensity);
      }, index * 5000);
    });
  }

  /**
   * Test volume controls
   */
  testVolumeControls(): void {
    if (!this.isInitialized) {
      console.warn('⚠️ Audio not initialized. Call initialize() first.');
      return;
    }

    const audio = getAudioManager();
    console.log('🔊 Testing volume controls...');

    // Play test sound at different volumes
    const sfx = getSoundEffects();

    setTimeout(() => {
      console.log('  🔊 Master Volume: 100%');
      audio.setMasterVolume(1.0);
      sfx.playPistol();
    }, 0);

    setTimeout(() => {
      console.log('  🔉 Master Volume: 50%');
      audio.setMasterVolume(0.5);
      sfx.playPistol();
    }, 1000);

    setTimeout(() => {
      console.log('  🔈 Master Volume: 25%');
      audio.setMasterVolume(0.25);
      sfx.playPistol();
    }, 2000);

    setTimeout(() => {
      console.log('  🔊 Master Volume: Reset to 70%');
      audio.setMasterVolume(0.7);
      sfx.playPistol();
    }, 3000);
  }

  /**
   * Run complete audio demo
   */
  async runCompleteDemo(): Promise<void> {
    console.log('🎮 NEON NECROPOLIS - Complete Audio Demo');
    console.log('==========================================\n');

    if (!this.isInitialized) {
      console.log('Initializing audio system...');
      await this.initialize();
      console.log('');
    }

    // Start music
    this.startMusic();

    // Test weapon sounds
    setTimeout(() => this.testWeaponSounds(), 1000);

    // Test enemy sounds
    setTimeout(() => this.testEnemySounds(), 10000);

    // Test player sounds
    setTimeout(() => this.testPlayerSounds(), 14000);

    // Test ambient sounds
    setTimeout(() => this.testAmbientSounds(), 18000);

    // Cycle music intensity
    setTimeout(() => this.cycleMusicIntensity(), 24000);

    // Test volume controls
    setTimeout(() => this.testVolumeControls(), 50000);

    console.log('\n📝 Demo scheduled. Audio will play over the next ~55 seconds.');
    console.log('💡 TIP: Open browser console to see detailed logs.\n');
  }

  /**
   * Quick sound test (short demo)
   */
  quickTest(): void {
    if (!this.isInitialized) {
      console.warn('⚠️ Audio not initialized. Call initialize() first.');
      return;
    }

    const sfx = getSoundEffects();
    console.log('⚡ Quick sound test...');

    setTimeout(() => sfx.playPistol(), 0);
    setTimeout(() => sfx.playExplosion(), 200);
    setTimeout(() => sfx.playLevelUp(), 600);
  }

  /**
   * Get audio system status
   */
  getStatus(): void {
    const audio = getAudioManager();
    const music = getMusicManager();

    console.log('🎵 Audio System Status:');
    console.log('  Initialized:', this.isInitialized);
    console.log('  Ready:', audio.isReady());
    console.log('  Master Volume:', Math.round(audio.getMasterVolume() * 100) + '%');
    console.log('  SFX Volume:', Math.round(audio.getSFXVolume() * 100) + '%');
    console.log('  Music Volume:', Math.round(audio.getMusicVolume() * 100) + '%');
    console.log('  Music Playing:', music.isActive());
    if (music.isActive()) {
      console.log('  Music Intensity:', music.getIntensity());
    }
  }
}

// Export singleton instance getter
export const getAudioDemo = () => AudioDemo.getInstance();

// Export convenient testing functions for console
if (typeof window !== 'undefined') {
  (window as any).audioDemo = {
    init: async () => await getAudioDemo().initialize(),
    testWeapons: () => getAudioDemo().testWeaponSounds(),
    testEnemies: () => getAudioDemo().testEnemySounds(),
    testPlayer: () => getAudioDemo().testPlayerSounds(),
    testAmbient: () => getAudioDemo().testAmbientSounds(),
    startMusic: () => getAudioDemo().startMusic(),
    stopMusic: () => getAudioDemo().stopMusic(),
    cycleIntensity: () => getAudioDemo().cycleMusicIntensity(),
    testVolume: () => getAudioDemo().testVolumeControls(),
    fullDemo: async () => await getAudioDemo().runCompleteDemo(),
    quickTest: () => getAudioDemo().quickTest(),
    status: () => getAudioDemo().getStatus(),
  };

  console.log('🎵 Audio Demo Functions Available:');
  console.log('  audioDemo.init()           - Initialize audio system');
  console.log('  audioDemo.testWeapons()    - Test all weapon sounds');
  console.log('  audioDemo.testEnemies()    - Test enemy sounds');
  console.log('  audioDemo.testPlayer()     - Test player sounds');
  console.log('  audioDemo.testAmbient()    - Test ambient sounds');
  console.log('  audioDemo.startMusic()     - Start background music');
  console.log('  audioDemo.stopMusic()      - Stop background music');
  console.log('  audioDemo.cycleIntensity() - Cycle through music intensities');
  console.log('  audioDemo.testVolume()     - Test volume controls');
  console.log('  audioDemo.fullDemo()       - Run complete demo');
  console.log('  audioDemo.quickTest()      - Quick 3-sound test');
  console.log('  audioDemo.status()         - Show audio status');
}
