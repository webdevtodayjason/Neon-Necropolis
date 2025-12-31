# AI Asset Generation Guide for Neon Necropolis

This guide provides prompts and specifications for generating all visual and audio assets using AI APIs.

---

## Visual Assets Generation

### Player Sprite

**API**: DALL-E 3 (OpenAI)
**Size**: 64x64px
**Format**: PNG with transparency

**Prompt**:
```
Top-down view of a cyberpunk character, glowing cyan outline, humanoid silhouette, dark center with bright neon edges, game sprite, pixel art style, transparent background, centered, facing up, 64x64 pixels
```

**Post-processing**:
- Resize to exactly 64x64px
- Ensure transparency
- Add glow effect in code

---

### Zombie Sprites (8 Types)

**API**: DALL-E 3
**Size**: 48x48px to 96x96px (varies by type)
**Format**: PNG with transparency

#### 1. Shambler
```
Top-down zombie sprite, slow shambling pose, dark silhouette with glowing red eyes, cyberpunk neon style, transparent background, 48x48 pixels, pixel art
```

#### 2. Runner
```
Top-down zombie sprite, running pose, lean body, dark silhouette with glowing red eyes, motion blur trail, cyberpunk style, transparent background, 48x48 pixels
```

#### 3. Tank
```
Top-down zombie sprite, large bulky body, armored appearance, dark silhouette with glowing red eyes, 96x96 pixels, cyberpunk heavy zombie, transparent background
```

#### 4. Exploder
```
Top-down zombie sprite, pulsing red glow effect, unstable appearance, dark silhouette with bright red core, cyberpunk bomb zombie, transparent background, 56x56 pixels
```

#### 5. Spitter
```
Top-down zombie sprite, elongated head, acid dripping effect, dark silhouette with glowing green mouth, cyberpunk acid zombie, transparent background, 48x48 pixels
```

#### 6. Swarm (Tiny)
```
Top-down zombie sprite, very small body, fast movement pose, dark silhouette with red eyes, pack creature, cyberpunk style, transparent background, 24x24 pixels
```

#### 7. Brute
```
Top-down zombie sprite, massive muscular body, hulking pose, dark silhouette with glowing red fists, cyberpunk heavy attacker, transparent background, 96x96 pixels
```

#### 8. Phantom
```
Top-down zombie sprite, semi-transparent ghostly appearance, teleporting effect, glowing purple outline, cyberpunk ghost zombie, transparent background, 48x48 pixels
```

---

### Weapon Effect Sprites

**API**: Stable Diffusion (Replicate) or DALL-E 3
**Format**: PNG with transparency

#### Laser Beam
```
Glowing cyan laser beam sprite, straight line, bright core with bloom effect, side view, transparent background, high contrast, neon cyberpunk style, 512x64 pixels
```

#### Shotgun Pellets
```
Small glowing white projectile, circular shape, bright center with glow, transparent background, 16x16 pixels, pixel art
```

#### Lightning Chain
```
Electric arc sprite, crackling lightning bolt, bright blue-white color, jagged edges, transparent background, animated frames, cyberpunk style, 256x256 pixels
```

#### Flame Effect
```
Animated fire sprite sheet, orange to yellow gradient, flame shapes, transparent background, 8 frames, 64x64 pixels each, cyberpunk neon fire
```

#### Ice Shards
```
Crystalline ice projectile, sharp edges, cyan glow, transparent background, 32x32 pixels, frozen shard sprite
```

#### Poison Cloud
```
Toxic green gas cloud, semi-transparent, swirling effect, glowing particles, transparent background, 128x128 pixels
```

---

### Particle Textures

**API**: Stable Diffusion
**Size**: 32x32px to 64x64px
**Purpose**: Used in particle systems

#### Blood Splatter Particle
```
Magenta blood splatter texture, single droplet, glowing neon pink, transparent background, soft edges, 32x32 pixels
```

#### Explosion Particle
```
Bright orange circular particle, glowing core, soft gradient to transparent edges, explosion fragment, 64x64 pixels
```

#### XP Orb
```
Glowing cyan energy orb, pulsing light effect, bright center, transparent background, 32x32 pixels, game collectible
```

#### Spark Particle
```
Small electric spark, bright white-blue color, star shape, glow effect, transparent background, 16x16 pixels
```

---

### UI Elements

**API**: DALL-E 3
**Format**: PNG with transparency

#### Health Bar Border
```
Cyberpunk UI health bar frame, rectangular shape, neon pink edges, corner decorations, transparent center, 320x40 pixels
```

#### Button Background
```
Cyberpunk UI button, rectangular with beveled edges, neon cyan border, dark semi-transparent center, 200x60 pixels
```

#### Level-Up Badge
```
Circular badge icon, glowing cyan and magenta, star burst pattern, "LEVEL UP" text, transparent background, 128x128 pixels
```

---

## Audio Assets Generation

### Weapon Sounds

**API**: ElevenLabs Sound Generation
**Duration**: 0.5s - 2.0s per sound
**Format**: MP3 or WAV

#### Pistol Fire
```
Sci-fi pistol gunshot sound, sharp electronic pew, short duration, cyberpunk laser gun, clean and punchy
```

#### Shotgun Blast
```
Heavy shotgun blast, deep bass boom, electronic distortion, cyberpunk shotgun, powerful impact sound, 1 second
```

#### Laser Beam
```
Continuous laser beam sound, buzzing hum, high-pitched electronic tone, sci-fi weapon, 1.5 seconds
```

#### Lightning Chain
```
Electric crackling sound, sharp zapping noise, Tesla coil discharge, cyberpunk electricity, rapid bursts
```

#### Missile Launch
```
Rocket launcher whoosh sound, building to explosion, sci-fi missile launch, dramatic buildup, 2 seconds
```

#### Flamethrower
```
Continuous flame roar, whooshing fire sound, intense heat effect, cyberpunk flamethrower, 2 seconds
```

#### Tesla Coil Zap
```
Electric pulse sound, sharp zap with bass, Tesla coil discharge, cyberpunk energy weapon, 0.5 seconds
```

#### Ice Shards
```
Crystalline chime sound, ice cracking and shooting, magical ice spell, high-pitched tinkle, 0.8 seconds
```

#### Explosion
```
Large explosion sound, heavy bass boom, electronic distortion, cyberpunk bomb blast, debris sounds, 2 seconds
```

---

### Enemy Sounds

**API**: ElevenLabs
**Duration**: 0.5s - 1.5s

#### Zombie Moan (Generic)
```
Distorted zombie groan, electronic glitch effect, cyberpunk undead, low-pitched moan with digital artifacts, 1 second
```

**Generate 8 variations with different pitches**

#### Zombie Death Scream
```
Zombie death sound, high-pitched electronic scream, digital distortion, cyberpunk undead dying, fade out effect, 1.2 seconds
```

**Generate 5 variations**

#### Exploder Beep
```
Warning beep sound, high-pitched electronic tone, urgent alert, bomb countdown, 0.3 seconds
```

#### Spitter Attack
```
Acid spit sound, wet splat with sizzle, corrosive liquid, gross organic sound with electronic effect, 0.7 seconds
```

---

### UI Sounds

**API**: ElevenLabs
**Duration**: 0.2s - 1.0s

#### Level Up
```
Power-up sound effect, ascending electronic tones, triumphant synth chord, cyberpunk achievement, 1 second
```

#### XP Pickup
```
Collectible pickup sound, satisfying bloop, gentle electronic chime, positive feedback, 0.3 seconds
```

#### Damage Taken
```
Player hit sound, distorted glitch noise, digital pain effect, screen shake audio, 0.4 seconds
```

#### Menu Select
```
UI button click, crisp electronic beep, cyberpunk interface sound, satisfying snap, 0.2 seconds
```

#### Menu Navigate
```
Menu hover sound, soft electronic tick, subtle UI feedback, gentle beep, 0.1 seconds
```

#### Game Over
```
Dramatic death sound, descending synth notes, electronic funeral march, cyberpunk defeat, 2 seconds
```

#### Victory
```
Triumphant victory fanfare, uplifting synth melody, cyberpunk win theme, celebratory, 3 seconds
```

---

### Background Music

**API**: Mubert or Suno AI
**Duration**: 3-5 minutes (looping)
**Format**: MP3, 320kbps

#### Main Theme
```
Synthwave music track, dark cyberpunk atmosphere, 128 BPM, C minor key, driving bassline, atmospheric pads, arpeggiated synths, no vocals, loopable, 3 minutes
```

#### Intensity Layer 1 (Add at Wave 10)
```
Additional percussion layer, electronic drums, building tension, fits 128 BPM synthwave track, 3 minutes
```

#### Intensity Layer 2 (Add at Wave 20)
```
Lead synth melody layer, urgent and intense, 128 BPM, C minor, cyberpunk battle theme addition, 3 minutes
```

---

## Asset Organization

Save generated assets to:

```
src/assets/
├── sprites/
│   ├── player.png
│   ├── zombies/
│   │   ├── shambler.png
│   │   ├── runner.png
│   │   ├── tank.png
│   │   ├── exploder.png
│   │   ├── spitter.png
│   │   ├── swarm.png
│   │   ├── brute.png
│   │   └── phantom.png
│   └── weapons/
│       ├── laser-beam.png
│       ├── shotgun-pellet.png
│       ├── lightning.png
│       ├── flame.png
│       ├── ice-shard.png
│       └── poison-cloud.png
├── particles/
│   ├── blood-splatter.png
│   ├── explosion.png
│   ├── xp-orb.png
│   └── spark.png
├── ui/
│   ├── health-bar.png
│   ├── button.png
│   └── level-up-badge.png
├── sounds/
│   ├── weapons/
│   │   ├── pistol.mp3
│   │   ├── shotgun.mp3
│   │   ├── laser.mp3
│   │   ├── lightning.mp3
│   │   ├── missile.mp3
│   │   ├── flamethrower.mp3
│   │   ├── tesla.mp3
│   │   ├── ice.mp3
│   │   └── explosion.mp3
│   ├── enemies/
│   │   ├── zombie-moan-1.mp3
│   │   ├── zombie-moan-2.mp3
│   │   ├── zombie-death-1.mp3
│   │   ├── exploder-beep.mp3
│   │   └── spitter-attack.mp3
│   └── ui/
│       ├── level-up.mp3
│       ├── xp-pickup.mp3
│       ├── damage-taken.mp3
│       ├── menu-select.mp3
│       └── victory.mp3
└── music/
    ├── main-theme.mp3
    ├── intensity-layer-1.mp3
    └── intensity-layer-2.mp3
```

---

## Generation Scripts

MAO agents can use this script template:

```typescript
// generate-assets.ts
import { generateImage, generateSound, generateMusic } from './ai-apis';

async function generateAllAssets() {
  // Visual Assets
  await generateImage({
    prompt: "Top-down cyberpunk character...",
    size: "64x64",
    output: "src/assets/sprites/player.png"
  });

  // Zombie sprites
  for (const zombie of ZOMBIE_TYPES) {
    await generateImage({
      prompt: zombie.prompt,
      size: zombie.size,
      output: `src/assets/sprites/zombies/${zombie.name}.png`
    });
  }

  // Audio Assets
  await generateSound({
    prompt: "Sci-fi pistol gunshot...",
    duration: 0.5,
    output: "src/assets/sounds/weapons/pistol.mp3"
  });

  // Music
  await generateMusic({
    prompt: "Synthwave music track...",
    duration: 180,
    output: "src/assets/music/main-theme.mp3"
  });
}
```

---

## Cost Estimate

- **Visual Assets**: 40 images × $0.04 = $1.60
- **Audio Assets**: 30 sounds × $0.002/s × 1s avg = $0.06
- **Music**: 3 tracks × $0.50 = $1.50

**Total**: ~$3.20 for complete asset generation

---

**Note**: All assets should be reviewed for quality and consistency before integration. Regenerate if needed.
