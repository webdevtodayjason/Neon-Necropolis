# Audio System Integration Guide

Quick reference for integrating the audio system into NEON NECROPOLIS.

## 1. Import Audio in main.ts

```typescript
// Add these imports at the top of main.ts
import { getAudioManager, getMusicManager } from './audio';

// Add audio initialization after canvas setup
let audioInitialized = false;

async function initializeAudio() {
  if (audioInitialized) return;
  
  try {
    const audioManager = getAudioManager();
    await audioManager.initialize();
    await audioManager.unlock();
    
    // Start background music
    const musicManager = getMusicManager();
    musicManager.start();
    musicManager.setIntensity('calm');
    
    audioInitialized = true;
    console.log('✅ Audio initialized');
  } catch (error) {
    console.error('Failed to initialize audio:', error);
  }
}

// Initialize audio on first user input
document.addEventListener('keydown', initializeAudio, { once: true });
document.addEventListener('click', initializeAudio, { once: true });
```

## 2. Add Sound Effects to Game.ts

```typescript
import { getSoundEffects, getMusicManager } from './audio';

export class Game {
  private sfx = getSoundEffects();
  private music = getMusicManager();
  
  // In update() method, add music intensity updates
  update(deltaTime: number, movement: Movement): void {
    // ... existing code ...
    
    // Update music intensity based on enemy count
    this.updateMusicIntensity();
  }
  
  private updateMusicIntensity(): void {
    const enemyCount = this.zombies.length;
    
    if (enemyCount > 30) {
      this.music.setIntensity('boss');
    } else if (enemyCount > 20) {
      this.music.setIntensity('high');
    } else if (enemyCount > 10) {
      this.music.setIntensity('medium');
    } else if (enemyCount > 5) {
      this.music.setIntensity('low');
    } else {
      this.music.setIntensity('calm');
    }
  }
  
  // Add to onZombieKilled()
  private onZombieKilled(zombie: Zombie): void {
    // ... existing code ...
    this.sfx.playEnemyDeath();
  }
  
  // Add to player level up
  private onPlayerLevelUp(): void {
    // ... existing code ...
    this.sfx.playLevelUp();
  }
}
```

## 3. Add Sound to Player.ts

```typescript
import { getSoundEffects } from './audio';

export class Player {
  private sfx = getSoundEffects();
  
  takeDamage(amount: number): void {
    // ... existing code ...
    this.sfx.playPlayerDamage();
    
    // Low health warning
    if (this.health < 20) {
      this.sfx.playHeartbeat();
    }
  }
  
  gainXP(amount: number): void {
    // ... existing code ...
    this.sfx.playXPPickup();
  }
  
  die(): void {
    // ... existing code ...
    this.sfx.playPlayerDeath();
  }
}
```

## 4. Add Weapon Sounds

Create a mapping in your weapon system:

```typescript
const WEAPON_SOUNDS = {
  'pistol': () => getSoundEffects().playPistol(),
  'shotgun': () => getSoundEffects().playShotgun(),
  'laser': () => getSoundEffects().playLaser(),
  'lightning': () => getSoundEffects().playLightning(),
  'missile': () => getSoundEffects().playMissile(),
  'flamethrower': () => getSoundEffects().playFlamethrower(),
  'tesla': () => getSoundEffects().playTesla(),
  'ice': () => getSoundEffects().playIce(),
  'orbital': () => getSoundEffects().playOrbital(),
  'poison': () => getSoundEffects().playPoison(),
};

// When weapon fires
function onWeaponFire(weaponType: string): void {
  WEAPON_SOUNDS[weaponType]?.();
}
```

## 5. Add Settings UI

```typescript
import { getAudioManager } from './audio';

class SettingsUI {
  createVolumeControls(): void {
    const audio = getAudioManager();
    
    // Master volume slider
    const masterSlider = document.createElement('input');
    masterSlider.type = 'range';
    masterSlider.min = '0';
    masterSlider.max = '100';
    masterSlider.value = String(audio.getMasterVolume() * 100);
    masterSlider.oninput = (e) => {
      const value = parseInt((e.target as HTMLInputElement).value) / 100;
      audio.setMasterVolume(value);
    };
    
    // Similar for SFX and Music volumes
  }
}
```

## Quick Testing

After integration, test in browser console:

```javascript
// Check if audio is working
audioDemo.status()

// Test a few sounds
audioDemo.quickTest()

// Test all weapons
audioDemo.testWeapons()
```

## Common Issues

1. **No sound on page load**: Audio requires user interaction first
2. **Sounds cutting off**: Increase MAX_SOUNDS in AudioManager.ts
3. **Music too loud**: Adjust music volume: `getAudioManager().setMusicVolume(0.3)`

## Complete Example

See `AudioDemo.ts` for a complete working example of all features.
