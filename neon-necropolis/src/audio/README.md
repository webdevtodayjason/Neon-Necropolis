# NEON NECROPOLIS - Audio System

Complete procedural audio engine for the cyberpunk auto-shooter game. All sounds and music generated using Web Audio API - **zero audio files required!**

## 🎵 Features

### Core Audio Engine (`AudioManager.ts`)
- **Web Audio API AudioContext** management
- **Sound pooling** and lifecycle management (max 50 concurrent sounds)
- **Master gain chain** with dynamic compression
- **Volume controls** (master, SFX, music)
- **Browser autoplay** policy handling
- **Automatic cleanup** of finished sounds

### Synthesis Engine (`SynthEngine.ts`)
Low-level audio primitives for sound generation:
- **Oscillators**: sine, square, sawtooth, triangle
- **Noise generators**: white noise with filtering
- **ADSR envelopes**: attack, decay, sustain, release
- **Filters**: lowpass, highpass, bandpass, notch
- **Effects**: distortion, delay, reverb, ring mod, tremolo, LFO
- **Pitch sweeps**: exponential and linear

### Sound Effects (`SoundEffects.ts`)
Complete library of procedural sound effects:

#### Weapons (10 types)
- **Pistol**: Sharp "pew" with pitch sweep
- **Shotgun**: Deep "BOOM" with noise burst
- **Laser**: Continuous "bzzz" with LFO modulation
- **Lightning**: "KZZZT" with ring modulation
- **Missile**: Whoosh → explosion combo
- **Flamethrower**: "FWOOSH" continuous flame
- **Tesla**: "ZAP" square wave burst
- **Ice**: Crystalline chime with high harmonics
- **Orbital**: Whooshing phaser sweep
- **Poison**: Bubbling random blips
- **Explosion**: Deep boom with noise

#### Enemy Sounds
- **Zombie moan**: Low growl with vibrato
- **Enemy death**: Scream with pitch drop
- **Exploder beep**: Accelerating warning beeps

#### Player Sounds
- **Player damage**: Glitch/distortion effect
- **Level up**: Rising "DING" + whoosh
- **Player death**: Dramatic descending sweep
- **XP pickup**: Satisfying "bloop"

#### Ambient Sounds
- **Heartbeat**: Low thump (for low HP warning)
- **Boss siren**: Rising alarm
- **Explosion**: Deep bass with noise burst

### Music System (`MusicManager.ts`)
Dynamic synthwave background music that responds to gameplay:

#### Features
- **Procedural chord progression** (I - VI - III - VII in C minor)
- **Multiple layers**: bass, pad, lead, arpeggio
- **Dynamic intensity** levels: calm → low → medium → high → boss
- **Smooth volume transitions** between intensity levels
- **No loops** - continuously generated music

#### Music Layers
1. **Bass Layer**: Deep pulsing sub-bass following chord progression
2. **Pad Layer**: Sustained chords with multiple octaves
3. **Lead Layer**: Melodic synth line (activates at higher intensities)
4. **Arpeggio Layer**: Fast arpeggiated chords (activates at higher intensities)

## 🚀 Quick Start

### 1. Initialize Audio System

```typescript
import { getAudioManager } from './audio';

// MUST be called after user interaction (click, keypress, touch)
async function initAudio() {
  const audio = getAudioManager();
  await audio.initialize();
  await audio.unlock();
}

// Example: Initialize on game start button
document.getElementById('startButton').addEventListener('click', async () => {
  await initAudio();
  startGame();
});
```

### 2. Play Sound Effects

```typescript
import { getSoundEffects } from './audio';

const sfx = getSoundEffects();

// Weapon sounds
sfx.playPistol();
sfx.playShotgun();
sfx.playLaser();

// Player sounds
sfx.playLevelUp();
sfx.playXPPickup();

// Enemy sounds
sfx.playZombieMoan();
sfx.playEnemyDeath();

// Ambient sounds
sfx.playExplosion();
```

### 3. Control Background Music

```typescript
import { getMusicManager } from './audio';

const music = getMusicManager();

// Start music
music.start();

// Change intensity based on gameplay
music.setIntensity('calm');   // Few enemies
music.setIntensity('medium'); // Combat heating up
music.setIntensity('high');   // Intense combat
music.setIntensity('boss');   // Boss fight!

// Stop music
music.stop();
```

### 4. Adjust Volumes

```typescript
import { getAudioManager } from './audio';

const audio = getAudioManager();

// Set volumes (0.0 - 1.0)
audio.setMasterVolume(0.8);  // 80%
audio.setSFXVolume(0.9);     // 90%
audio.setMusicVolume(0.6);   // 60%

// Get volumes
const masterVol = audio.getMasterVolume();
const sfxVol = audio.getSFXVolume();
const musicVol = audio.getMusicVolume();
```

## 🎮 Integration Example

```typescript
import {
  getAudioManager,
  getSoundEffects,
  getMusicManager,
} from './audio';

class Game {
  private audio = getAudioManager();
  private sfx = getSoundEffects();
  private music = getMusicManager();

  async init() {
    // Initialize audio on user interaction
    await this.audio.initialize();
    await this.audio.unlock();

    // Start background music
    this.music.start();
    this.music.setIntensity('calm');
  }

  onPlayerShoot(weaponType: string) {
    switch (weaponType) {
      case 'pistol':
        this.sfx.playPistol();
        break;
      case 'shotgun':
        this.sfx.playShotgun();
        break;
      case 'laser':
        this.sfx.playLaser();
        break;
      // ... etc
    }
  }

  onEnemyKilled() {
    this.sfx.playEnemyDeath();
    this.sfx.playExplosion();
  }

  onPlayerLevelUp() {
    this.sfx.playLevelUp();
  }

  onPlayerDamaged() {
    this.sfx.playPlayerDamage();

    // Low health warning
    if (this.player.health < 20) {
      this.sfx.playHeartbeat();
    }
  }

  updateMusicIntensity() {
    const enemyCount = this.enemies.length;

    if (this.isBossFight) {
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
}
```

## 🧪 Testing

Use the built-in `AudioDemo` utility to test all audio features:

```typescript
import { getAudioDemo } from './audio/AudioDemo';

const demo = getAudioDemo();

// Initialize audio
await demo.initialize();

// Run complete demo (all sounds + music)
await demo.runCompleteDemo();

// Or test individual categories
demo.testWeaponSounds();
demo.testEnemySounds();
demo.testPlayerSounds();
demo.testAmbientSounds();

demo.startMusic();
demo.cycleMusicIntensity();

// Get status
demo.getStatus();
```

### Browser Console Testing

When `AudioDemo.ts` is loaded, convenient testing functions are available in the browser console:

```javascript
// Available in browser console:
audioDemo.init()           // Initialize audio
audioDemo.testWeapons()    // Test weapon sounds
audioDemo.testEnemies()    // Test enemy sounds
audioDemo.testPlayer()     // Test player sounds
audioDemo.startMusic()     // Start music
audioDemo.cycleIntensity() // Cycle through intensities
audioDemo.fullDemo()       // Run complete demo
audioDemo.quickTest()      // Quick 3-sound test
audioDemo.status()         // Show audio status
```

## 📊 System Architecture

```
┌─────────────────────────────────────────┐
│         AudioManager (Singleton)        │
│  ┌─────────────────────────────────┐   │
│  │      AudioContext               │   │
│  │           ↓                     │   │
│  │      Master Gain                │   │
│  │           ↓                     │   │
│  │   Dynamic Compressor            │   │
│  │           ↓                     │   │
│  │      Destination                │   │
│  └─────────────────────────────────┘   │
│                                         │
│  - Sound pooling (max 50)              │
│  - Volume control                       │
│  - Automatic cleanup                    │
└─────────────────────────────────────────┘
           ↓                  ↓
    ┌──────────┐      ┌──────────────┐
    │  SynthEngine     │ MusicManager │
    │                  │              │
    │  Oscillators     │  Bass Layer  │
    │  Filters         │  Pad Layer   │
    │  ADSR            │  Lead Layer  │
    │  Effects         │  Arpeggio    │
    └──────────┘      └──────────────┘
           ↓
    ┌──────────────┐
    │ SoundEffects │
    │              │
    │  Weapons     │
    │  Enemies     │
    │  Player      │
    │  Ambient     │
    └──────────────┘
```

## 🔧 Technical Details

### Sound Pooling
- Maximum 50 concurrent sounds
- Automatic cleanup of finished sounds every 1 second
- Force cleanup of oldest sounds when limit is reached

### ADSR Envelopes
Standard envelope for smooth sound shaping:
```typescript
interface ADSREnvelope {
  attack: number;   // Time to reach max volume
  decay: number;    // Time to drop to sustain level
  sustain: number;  // Hold level (0-1)
  release: number;  // Time to fade to 0
}
```

### Dynamic Compression
Prevents audio clipping with the following settings:
- Threshold: -20dB
- Knee: 30dB
- Ratio: 12:1
- Attack: 3ms
- Release: 250ms

### Browser Compatibility
- Uses Web Audio API (modern browsers)
- Handles autoplay policies (requires user interaction)
- Falls back gracefully if audio is unavailable

## 🎨 Customization

### Creating Custom Sounds

Use the `SynthEngine` directly for custom sounds:

```typescript
import { getAudioManager } from './audio';

const manager = getAudioManager();
const synth = manager.getSynthEngine();
const ctx = manager.getContext();
const now = ctx.currentTime;

// Create oscillator
const osc = synth.createOscillator('sawtooth', 440);
const gain = manager.createSFXGain();

// Apply pitch sweep
synth.createPitchSweep(osc, 440, 220, 0.5, now);

// Apply envelope
synth.applyEnvelope(gain, {
  attack: 0.1,
  decay: 0.2,
  sustain: 0.5,
  release: 0.3,
}, now, 0.8);

// Add filter
const filter = synth.createFilter({
  type: 'lowpass',
  frequency: 1000,
  Q: 2,
});

// Connect and play
osc.connect(filter);
filter.connect(gain);
gain.connect(manager.getMasterGain());

osc.start(now);
osc.stop(now + 0.8);
```

### Adding New Sound Effects

Extend `SoundEffects.ts`:

```typescript
export class SoundEffects {
  // ... existing methods

  /**
   * Custom explosion sound
   */
  playMegaExplosion(): void {
    const manager = getAudioManager();
    if (!manager.isReady()) return;

    const synth = manager.getSynthEngine();
    const ctx = manager.getContext();
    const now = ctx.currentTime;

    // Your custom sound implementation here
    // ...

    manager.registerSound([osc, gain], duration);
  }
}
```

## 📝 Performance Notes

- All audio generation happens on the audio thread (Web Audio API)
- Very low CPU usage thanks to native browser audio processing
- Sound pooling prevents memory leaks
- Automatic cleanup keeps memory usage constant
- No audio file loading = instant startup, zero bandwidth

## 🐛 Troubleshooting

### No Sound Playing

1. **Check browser autoplay policy**:
   ```typescript
   // Must unlock after user interaction
   await getAudioManager().unlock();
   ```

2. **Check if audio is initialized**:
   ```typescript
   if (!getAudioManager().isReady()) {
     console.log('Audio not ready!');
   }
   ```

3. **Check volumes**:
   ```typescript
   const audio = getAudioManager();
   console.log('Master:', audio.getMasterVolume());
   console.log('SFX:', audio.getSFXVolume());
   ```

### Audio Cutting Out

- Increase `MAX_SOUNDS` in `AudioManager.ts` if you need more concurrent sounds
- Reduce sound duration for rapid-fire sounds

### Music Too Loud/Quiet

```typescript
// Adjust music volume independently
getAudioManager().setMusicVolume(0.4);
```

## 📚 API Reference

See inline documentation in:
- `AudioManager.ts` - Core audio management
- `SynthEngine.ts` - Low-level synthesis
- `SoundEffects.ts` - Sound effect library
- `MusicManager.ts` - Music system
- `index.ts` - Exports and quick start guide

## 🎵 Sound Design Philosophy

All sounds are designed to fit the **cyberpunk/synthwave** aesthetic:
- **Synthetic** - No attempt to sound "realistic"
- **Retro-futuristic** - 80s synth vibes with modern production
- **Punchy** - Sharp attacks, quick envelopes
- **Electronic** - Heavy use of oscillators and effects
- **Neon** - Bright, cutting frequencies
- **Bass-heavy** - Strong low-end presence

## 📄 License

Part of NEON NECROPOLIS game project.

---

**Built with ❤️ using Web Audio API**
