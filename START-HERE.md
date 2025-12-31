# NEON NECROPOLIS - Product Requirements Document

**Game Type**: Top-down auto-shooter with roguelite progression
**Platform**: Web browser (HTML5/Canvas)
**Inspiration**: Vampire Survivors + Geometry Wars + Cyberpunk aesthetic
**Tagline**: "Survive the neon apocalypse. Your weapons fire themselves. You just need to stay alive."

---

## 🎯 Core Concept

An auto-shooter where the player controls ONLY movement (WASD/Arrow keys). All weapons fire automatically at the nearest enemy. The challenge is positioning, dodging, and building synergistic weapon combinations as you level up.

Each run lasts up to 30 minutes. Survive the endless zombie horde, level up, unlock weapons, and create devastating combos through weapon synergies.

---

## 🎮 Core Gameplay Loop

1. **Spawn** in the center of a neon-lit arena
2. **Zombies spawn** from edges in increasing waves
3. **Move to dodge** zombie attacks (WASD/arrows)
4. **Weapons auto-fire** at nearest enemies
5. **Kill zombies** → gain XP orbs
6. **Level up** → choose new weapon OR upgrade existing
7. **Discover synergies** between weapons (ice + fire, lightning + water)
8. **Survive 30 minutes** to win OR die trying

---

## 🔫 Weapon System (Auto-Fire)

### Starting Weapon
- **Pistol**: Basic auto-fire at nearest enemy (always active)

### Unlockable Weapons (gain via level-ups)
Players choose ONE weapon/upgrade per level-up:

1. **Shotgun Spread**: Fires 5 pellets in a cone
2. **Laser Beam**: Continuous beam that pierces enemies
3. **Orbital Satellites**: 3 orbs that circle player and damage on contact
4. **Lightning Chain**: Jumps between up to 5 enemies
5. **Homing Missiles**: Tracks enemies, explodes on impact
6. **Flamethrower**: Continuous cone of fire, applies burn DOT
7. **Tesla Coil**: Periodic AOE shock around player
8. **Ice Shards**: Slows enemies, freezes on multiple hits
9. **Poison Cloud**: Area DOT that lingers
10. **Railgun**: High damage pierce shot through all enemies in line

### Weapon Upgrades (alternative to new weapons)
- **+1 Projectile** (shotgun fires 6 instead of 5)
- **+20% Damage**
- **+15% Fire Rate**
- **+30% Area of Effect**
- **Pierce +1** (hits one more enemy)

---

## ⚡ Synergy System

When specific weapon combinations are active, special effects trigger:

| Combo | Effect | Visual |
|-------|--------|--------|
| **Ice + Fire** | Frozen enemies shatter, dealing AOE damage | Steam explosion particles |
| **Lightning + Water/Ice** | Chain lightning jumps 3 extra times | Crackling electric arcs |
| **Poison + Explosion** | Toxic cloud spreads on explosion | Green gas cloud |
| **Laser + Orbital** | Orbitals reflect laser beams | Disco ball effect |
| **Fire + Poison** | Burning poison spreads faster | Green flames |
| **Ice + Lightning** | Frozen enemies conduct electricity | Blue electric tendrils |

Synergies are discovered through experimentation and displayed in UI.

---

## 🧟 Zombie Types

### Wave 1-5 (Minutes 0-5)
- **Shambler**: Slow, low HP, basic melee

### Wave 6-10 (Minutes 5-10)
- **Runner**: Fast, low HP, aggressive
- **Tank**: Slow, high HP (5x normal)

### Wave 11-15 (Minutes 10-15)
- **Exploder**: Runs at player, explodes on death (AOE damage)
- **Spitter**: Ranged acid attack, slow movement

### Wave 16-20 (Minutes 15-20)
- **Swarm**: Tiny, very fast, spawn in groups of 10
- **Brute**: Very slow, very high HP, knockback attack

### Wave 21-25 (Minutes 20-25)
- **Phantom**: Teleports every 3 seconds
- **Necromancer**: Spawns additional zombies, ranged attack

### Wave 26-30 (Minutes 25-30) - HELL MODE
- **ALL TYPES** spawn simultaneously
- Spawn rate 3x normal
- Boss spawns every 60 seconds

---

## 🎨 Visual Design (Cyberpunk Neon)

### Color Palette
- **Background**: Dark purple/black gradient (#0a0015 → #1a0033)
- **Neon Accents**:
  - Cyan (#00ffff)
  - Magenta (#ff00ff)
  - Electric Blue (#0080ff)
  - Acid Green (#00ff80)
  - Hot Pink (#ff0080)

### Visual Effects (CRITICAL)
- **Particle Systems**:
  - Blood splatter on zombie death (magenta particles)
  - XP orbs that fly to player (cyan glow)
  - Weapon fire effects (unique per weapon)
  - Screen shake on explosions
  - Chromatic aberration on damage taken
  - Scanline overlay (CRT effect)

- **Lighting**:
  - Dynamic point lights from weapons
  - Glow effects on player and weapons
  - Zombie eyes glow (red)
  - Additive blending for neon colors

- **UI Effects**:
  - Glitch text on level-up
  - Pulsing health bar
  - Combo counter with escalating glow
  - Damage numbers float up from enemies

### Player Character
- Glowing cyan humanoid silhouette
- Weapon effects emanate from center
- Trail effect when moving fast

### Zombies
- Dark silhouettes with glowing red eyes
- Different shapes per type (tall, wide, small)
- Dissolve effect on death (particles fade out)

---

## 🔊 Sound Design

### Music
- **Main Theme**: Synthwave/cyberpunk electronic (looping)
- **Intensity Layers**: Music adds layers as more enemies spawn
- **Level-Up Stinger**: Triumphant synth chord

### Sound Effects (Essential)

**Weapons:**
- Pistol: Sharp "pew" sound
- Shotgun: Deep "BOOM" with bass
- Laser: Continuous "bzzzzz" hum
- Lightning: Electric crackle "KZZZT"
- Missiles: Whoosh + explosion
- Flamethrower: Roaring fire "FWOOSH"
- Tesla: Electric pulse "ZAP"
- Ice: Crystalline "chime"
- Orbital: Whooshing rotation

**Enemies:**
- Zombie moans (randomized pitch)
- Death screams (varies by type)
- Exploder: Beeping before explosion
- Spitter: Acid spit "SPLAT"

**Player:**
- Damage taken: Distorted glitch sound
- Level up: Power-up "DING" + whoosh
- Death: Dramatic synth drop
- XP pickup: Satisfying "bloop"

**Ambience:**
- Low heartbeat when HP < 25%
- Alert siren when boss spawns
- Warning beep when exploder nearby

---

## 📊 Progression & Meta Systems

### Per-Run Progression
- **Level System**: XP from kills → Level up every 1000 XP
- **Max Level**: 30 (one level per minute)
- **Difficulty Scaling**: Zombies get 5% more HP per minute
- **Spawn Rate**: +10% every 2 minutes

### Meta Progression (Between Runs)
- **High Score**: Tracked and displayed
- **Achievements** (UI only, for now):
  - "First Blood" - Kill 100 zombies
  - "Synergy Master" - Discover 5 synergies
  - "Survivor" - Survive 30 minutes
  - "Perfectionist" - Win without taking damage (impossible but aspirational)

### Stats Tracking
- Total zombies killed
- Highest wave reached
- Best run time
- Most damage in one hit
- Favorite weapon (most used)

All stored in LocalStorage.

---

## 🎯 Win/Lose Conditions

### Victory
- **Survive 30 minutes** (1800 seconds)
- Victory screen shows:
  - Final stats (kills, level, damage dealt)
  - Synergies discovered
  - Congratulatory message
  - "Play Again" button

### Death
- **HP reaches 0**
- Death screen shows:
  - Survival time
  - Zombies killed
  - Level reached
  - "Try Again" button

---

## 🖥️ Technical Requirements

### Core Technologies
- **HTML5 Canvas** for rendering
- **Vanilla JavaScript** or **TypeScript** (preferred)
- **Web Audio API** for sound
- **LocalStorage** for persistence
- **No external dependencies** for core game (optional: bundler)

### Performance Targets
- **60 FPS** with 100+ enemies on screen
- **30 FPS minimum** with 500+ enemies (late game)
- Particle system with pooling (reuse objects)
- Efficient collision detection (spatial hashing or quad-tree)

### Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- No mobile support required (desktop only)

### Resolution
- **Default**: 1280x720 (16:9)
- **Fullscreen**: Supported (scale to fit)
- **Responsive**: Center game area, letterbox if needed

---

## 🏗️ Implementation Phases

### Phase 1: Core Mechanics (MVP)
- [ ] Player movement (WASD/arrows)
- [ ] Single weapon (pistol) auto-firing
- [ ] Basic zombie spawning
- [ ] Collision detection (player/zombie, bullet/zombie)
- [ ] Health system
- [ ] Win/lose conditions

### Phase 2: Progression
- [ ] XP orbs and collection
- [ ] Level-up system
- [ ] Multiple weapons implementation
- [ ] Weapon selection UI on level-up
- [ ] Weapon upgrades

### Phase 3: Polish & Effects
- [ ] Particle systems (blood, explosions, trails)
- [ ] Screen shake and camera effects
- [ ] Sound effects for all actions
- [ ] Background music with intensity layers
- [ ] Damage numbers

### Phase 4: Zombies & Balance
- [ ] All 8 zombie types
- [ ] Wave-based difficulty scaling
- [ ] Zombie AI (pathfinding to player)
- [ ] Boss spawns

### Phase 5: Synergies & Meta
- [ ] Synergy system implementation
- [ ] Synergy discovery UI
- [ ] High score tracking
- [ ] Stats screen
- [ ] Achievement display

### Phase 6: Visual Flair
- [ ] Cyberpunk neon aesthetic
- [ ] Glow effects and lighting
- [ ] CRT scanline shader
- [ ] Chromatic aberration
- [ ] UI animations and transitions

---

## 🧪 Testing Requirements

### Functional Tests
- Player can move in all directions
- Weapons auto-fire correctly
- Collisions detect properly
- XP collection works
- Level-up triggers correctly
- All zombie types spawn and behave correctly
- Synergies activate when weapons combine
- Win/lose conditions trigger appropriately

### Balance Tests
- Game is challenging but fair
- Synergies feel powerful but not broken
- Difficulty scales smoothly
- 30-minute runs are achievable but difficult

### Performance Tests
- 60 FPS with 100 enemies
- No memory leaks (run for 30+ minutes)
- Particle systems don't tank performance
- LocalStorage saves/loads correctly

### Browser Tests
- Works in Chrome, Firefox, Safari, Edge
- Fullscreen works correctly
- Audio plays without glitches

---

## 📁 Project Structure

```
neon-necropolis/
├── src/
│   ├── game/
│   │   ├── Game.ts              # Main game loop
│   │   ├── Player.ts            # Player entity
│   │   ├── Zombie.ts            # Zombie base class
│   │   ├── ZombieTypes.ts       # All zombie variants
│   │   ├── Weapon.ts            # Weapon base class
│   │   ├── WeaponTypes.ts       # All weapon implementations
│   │   ├── Projectile.ts        # Bullet/projectile entity
│   │   ├── Synergy.ts           # Synergy system
│   │   └── Spawner.ts           # Enemy spawning logic
│   ├── engine/
│   │   ├── Engine.ts            # Core game engine
│   │   ├── Input.ts             # Keyboard input handling
│   │   ├── Physics.ts           # Collision detection
│   │   ├── ParticleSystem.ts   # Particle effects
│   │   └── Camera.ts            # Screen shake, effects
│   ├── ui/
│   │   ├── HUD.ts               # Health, XP, level display
│   │   ├── LevelUpUI.ts         # Weapon selection screen
│   │   ├── GameOverUI.ts        # Death/victory screens
│   │   └── StatsUI.ts           # Post-game statistics
│   ├── audio/
│   │   ├── AudioManager.ts      # Sound effect management
│   │   ├── MusicManager.ts      # Background music
│   │   └── sounds/              # Sound effect files
│   └── assets/
│       ├── sprites/             # Player, zombie sprites
│       ├── effects/             # Particle textures
│       └── music/               # Background tracks
├── tests/
│   ├── game.test.ts
│   ├── weapons.test.ts
│   └── synergies.test.ts
├── index.html
├── styles.css
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🎯 Success Criteria

This project is **DONE** when:

1. ✅ Player can move and survive for 30 minutes
2. ✅ All 10 weapons are implemented and auto-fire correctly
3. ✅ All 8 zombie types spawn and behave correctly
4. ✅ At least 6 synergies work and display correctly
5. ✅ Visual effects are present (particles, screen shake, glow)
6. ✅ Sound effects play for weapons, enemies, and player actions
7. ✅ Background music plays and layers with intensity
8. ✅ Level-up system works with weapon selection UI
9. ✅ Win/lose screens display with stats
10. ✅ High score persists between sessions
11. ✅ Game runs at 60 FPS with 100+ enemies
12. ✅ Cyberpunk neon aesthetic is visually impressive

---

## 🚀 Autonomous Build Instructions

**For MAO Orchestrator:**

When `/autonomous_mode START-HERE.md` is called:

1. **Create 4 specialized agents**:
   - `game-logic-builder` (E2B) - Implements core game mechanics
   - `visual-effects-builder` (E2B) - Implements particle systems and visual polish
   - `audio-builder` (E2B) - Implements sound system and audio integration
   - `test-builder` (E2B) - Writes comprehensive tests

2. **Command agents in parallel** with phase-specific instructions

3. **Monitor completion** and run autonomous QA workflow

4. **Integration test**: Run in browser and verify gameplay

5. **Create PR** when all tests pass

---

## 🎮 Play Experience Goal

When a player launches Neon Necropolis, they should feel:

1. **Immediate satisfaction** - Weapons fire instantly, enemies die in bursts of particles
2. **Strategic depth** - Choosing weapons and discovering synergies matters
3. **Visual spectacle** - Screen is filled with neon lights, explosions, and effects
4. **Escalating tension** - Music builds, enemies swarm, player must optimize movement
5. **"One more run"** - Quick deaths encourage retry, victory feels earned

**This is a test project for MAO, but it should be genuinely fun to play.**

---

**Let's build something awesome. Autonomous mode: ENGAGED.** 💀⚡
