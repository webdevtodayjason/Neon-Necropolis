# AI Documentation Sources

This directory contains AI-readable documentation for game mechanics, systems, and patterns used in Neon Necropolis.

## Purpose

These docs help MAO agents understand:
- Auto-shooter game mechanics
- Synergy system design patterns
- Particle effect techniques
- Cyberpunk visual aesthetic
- Browser game performance optimization

## Documentation URLs to Scrape

When running `/load_ai_docs` or `/prime`, scrape these URLs:

### Game Mechanics & Design
- https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection
- https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial
- https://www.html5gamedevs.com/topic/1474-entity-component-system-in-javascript/
- https://gamedevelopment.tutsplus.com/tutorials/quick-tip-use-quadtrees-to-detect-likely-collisions-in-2d-space--gamedev-374

### Particle Systems
- https://www.patrickmuff.ch/lab/particleSystem/
- https://github.com/drawcall/Proton
- https://www.html5rocks.com/en/tutorials/canvas/performance/

### Web Audio
- https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API
- https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Using_Web_Audio_API

### TypeScript Game Development
- https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html
- https://phaser.io/tutorials/making-your-first-phaser-3-game

### Performance Optimization
- https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame
- https://developer.mozilla.org/en-US/docs/Web/API/OffscreenCanvas

## Local Documentation Files

After scraping, documentation will be saved to:

- `auto-shooter-mechanics.md` - Core gameplay patterns
- `synergy-systems.md` - Weapon combo design
- `particle-effects-guide.md` - Visual effects techniques
- `web-audio-patterns.md` - Sound management
- `canvas-rendering.md` - 2D rendering optimization
- `collision-detection.md` - Spatial hashing and quad-trees
- `typescript-game-patterns.md` - TypeScript best practices for games

## AI Asset Generation APIs

### Visual Assets

#### DALL-E 3 (OpenAI)
**Use for**: Sprite generation, UI elements, concept art
**API**: `https://api.openai.com/v1/images/generations`
**Prompts**:
- "Cyberpunk zombie sprite, top-down view, glowing red eyes, pixel art style, transparent background"
- "Neon cyan laser beam sprite, glowing effect, side view, particle trail"
- "Synthwave UI button, magenta and cyan, retro-futuristic, 200x50px"

```bash
curl https://api.openai.com/v1/images/generations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
    "model": "dall-e-3",
    "prompt": "Top-down zombie sprite, cyberpunk neon aesthetic, glowing red eyes, dark silhouette, transparent background, game asset",
    "n": 1,
    "size": "1024x1024"
  }'
```

#### Stable Diffusion (Replicate)
**Use for**: Backgrounds, particle textures, effects
**API**: `https://replicate.com/stability-ai/sdxl`
**Prompts**:
- "Cyberpunk city background, purple and black gradient, neon lights, top-down view, tileable"
- "Blood splatter particle texture, magenta color, transparent background, high contrast"

```bash
curl -X POST https://api.replicate.com/v1/predictions \
  -H "Authorization: Token $REPLICATE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "version": "stability-ai/sdxl",
    "input": {
      "prompt": "Neon particle effect texture, cyan glow, transparent background, high resolution"
    }
  }'
```

#### Leonardo.ai
**Use for**: Game-optimized sprites and tilesets
**API**: `https://cloud.leonardo.ai/api/rest/v1/generations`
**Best for**: Consistent style across multiple assets

### Audio Assets

#### ElevenLabs (Sound Effects)
**Use for**: Weapon sounds, zombie moans, UI sounds
**API**: `https://api.elevenlabs.io/v1/sound-generation`

**Prompts**:
- "Sci-fi laser pistol shot, sharp pew sound, short duration"
- "Zombie death scream, distorted, electronic glitch effect"
- "Synthwave power-up sound, ascending pitch, triumphant"
- "Electric explosion, bass-heavy boom, cyberpunk style"

```bash
curl -X POST https://api.elevenlabs.io/v1/sound-generation \
  -H "xi-api-key: $ELEVENLABS_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Cyberpunk laser gun firing sound effect, sharp electronic pew",
    "duration_seconds": 1.5,
    "prompt_influence": 0.8
  }'
```

#### Suno AI (Music Generation)
**Use for**: Background music, synthwave soundtrack
**API**: Contact Suno for API access
**Prompts**:
- "Synthwave track, 128 BPM, dark cyberpunk, minor key, looping, no vocals"
- "Intense electronic battle music, fast tempo, building tension"

#### Mubert API (Generative Music)
**Use for**: Adaptive background music
**API**: `https://api.mubert.com/v2/RecordTrack`

```bash
curl -X POST https://api-b2b.mubert.com/v2/RecordTrack \
  -H "Content-Type: application/json" \
  -d '{
    "method": "RecordTrack",
    "params": {
      "license": "community",
      "mode": "loop",
      "duration": 180,
      "tags": "synthwave,cyberpunk,dark,electronic",
      "bitrate": 320
    }
  }'
```

### Asset Generation Workflow for MAO

When building Neon Necropolis, agents should:

1. **Visual Assets** (via DALL-E 3):
   - Generate player sprite
   - Generate 8 zombie type sprites
   - Generate weapon effect sprites
   - Generate particle textures
   - Generate UI elements

2. **Audio Assets** (via ElevenLabs):
   - Generate 10 weapon sounds
   - Generate zombie death sounds (8 variants)
   - Generate UI sounds (level-up, XP pickup, etc.)
   - Generate explosion/impact sounds

3. **Music** (via Mubert or Suno):
   - Generate 3-minute looping synthwave track
   - Generate intensity layer variations

4. **Save to Project**:
   ```
   src/assets/
   ├── sprites/
   │   ├── player.png
   │   ├── zombies/
   │   │   ├── shambler.png
   │   │   ├── runner.png
   │   │   └── ...
   │   └── weapons/
   │       ├── laser-beam.png
   │       └── ...
   ├── sounds/
   │   ├── weapons/
   │   ├── enemies/
   │   └── ui/
   └── music/
       └── synthwave-main-loop.mp3
   ```

### Cost Estimates

**DALL-E 3**: ~$0.04 per image × 30 assets = $1.20
**ElevenLabs**: ~$0.002 per second × 50 sounds × 2s avg = $0.20
**Mubert**: ~$0.50 per track × 1 track = $0.50

**Total**: ~$2.00 for complete asset generation

### Environment Variables Needed

```bash
# .env
OPENAI_API_KEY=sk-...
ELEVENLABS_API_KEY=...
REPLICATE_API_KEY=...
MUBERT_API_KEY=...
```

## Usage in Autonomous Build

Agents can use these APIs during development:

```typescript
// Example: Generate weapon sound
const weaponSound = await generateSound({
  prompt: "Laser gun firing sound, cyberpunk, sharp electronic pew",
  duration: 1.0
});

saveAsset('src/assets/sounds/weapons/laser.mp3', weaponSound);
```

---

**Note**: All AI-generated assets should be reviewed for quality and consistency before final integration.
