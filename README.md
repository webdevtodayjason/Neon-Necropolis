# 💀⚡ NEON NECROPOLIS

**A cyberpunk auto-shooter arcade game built to test MAO's autonomous development capabilities**

[![Game Type](https://img.shields.io/badge/Type-Auto--Shooter-cyan)]()
[![Platform](https://img.shields.io/badge/Platform-Web%20Browser-magenta)]()
[![Status](https://img.shields.io/badge/Status-In%20Development-yellow)]()
[![Built By](https://img.shields.io/badge/Built%20By-MAO%20Agents-purple)]()

---

## 🎮 What Is This?

**Neon Necropolis** is a top-down auto-shooter where you control a cyberpunk survivor in a zombie apocalypse. Your weapons fire automatically—you just need to dodge, position, and build devastating weapon combos.

**Inspired by**: Vampire Survivors + Geometry Wars + Cyberpunk aesthetic

### Core Gameplay
- **Move only**: WASD/Arrow keys for movement
- **Auto-fire**: All weapons fire at nearest enemies automatically
- **Level up**: Gain XP → Choose weapons → Discover synergies
- **Survive**: 30 minutes of escalating chaos
- **Visual spectacle**: Neon particles, screen shake, chromatic aberration

---

## ✨ Features

### 🔫 10 Unique Weapons
- Pistol (starter), Shotgun, Laser, Lightning, Missiles, Flamethrower, Tesla Coil, Ice Shards, Poison Cloud, Railgun
- All fire simultaneously once unlocked
- Upgrade damage, fire rate, pierce, area

### ⚡ Weapon Synergies
- **Ice + Fire** → Steam explosions
- **Lightning + Water** → Chain shocks
- **Poison + Explosion** → Toxic clouds
- And more to discover!

### 🧟 8 Zombie Types
- Shambler, Runner, Tank, Exploder, Spitter, Swarm, Brute, Phantom, Necromancer
- Each with unique behavior and challenge
- Wave-based difficulty scaling

### 🎨 Cyberpunk Visuals
- Neon color palette (cyan, magenta, electric blue)
- Particle systems for blood, explosions, trails
- Dynamic lighting and glow effects
- CRT scanline shader
- Chromatic aberration on damage
- Screen shake and camera effects

### 🔊 Synthwave Audio
- Layered electronic soundtrack
- Unique sound effects per weapon
- Zombie moans and death screams
- Intensity builds with enemy count
- Alert systems (low HP heartbeat, boss warnings)

---

## 🚀 Quick Start

### Play the Game
```bash
# Open in browser
open index.html

# Or serve locally
npx http-server -p 8080
```

### Development Setup
```bash
# Install dependencies
npm install

# Run development server with hot reload
npm run dev

# Build for production
npm run build

# Run tests
npm test
```

---

## 🏗️ Project Structure

```
neon-necropolis/
├── START-HERE.md           # Product Requirements (for MAO autonomous build)
├── README.md               # This file
├── specs/                  # Detailed implementation specifications
│   ├── game-mechanics.md
│   ├── weapon-system.md
│   ├── visual-effects.md
│   └── audio-system.md
├── ai_docs/                # AI-readable game design documentation
│   ├── README.md          # Doc URLs for scraping
│   ├── auto-shooter-mechanics.md
│   ├── synergy-systems.md
│   └── particle-effects-guide.md
├── src/
│   ├── game/              # Core game logic
│   ├── engine/            # Game engine systems
│   ├── ui/                # UI components
│   ├── audio/             # Audio management
│   └── assets/            # Sprites, sounds, music
├── tests/                 # Test suite
├── .claude/               # MAO agent configuration
│   ├── agents/            # Custom agent templates
│   └── commands/          # Slash commands
├── index.html
├── styles.css
├── package.json
└── tsconfig.json
```

---

## 🎯 MAO Autonomous Build

This project is designed to test **MAO's (Multi-Agent Orchestrator)** autonomous development workflow.

### Using Autonomous Mode

```bash
# From MAO orchestrator
/autonomous_mode START-HERE.md

# Or manually command agents
Create 4 agents: game-logic, visual-effects, audio, test-builder
Command all in parallel with phase-specific instructions
Monitor → Review → Apply → Test → Iterate → PR
```

### Build Phases
1. **Core Mechanics**: Movement, shooting, collision, health
2. **Progression**: XP, leveling, weapon selection
3. **Polish**: Particles, effects, sounds, music
4. **Enemies**: All zombie types, AI, spawning
5. **Synergies**: Combo system, discovery UI
6. **Visual Flair**: Neon aesthetic, shaders, lighting

### Testing MAO's Capabilities
This project tests:
- ✅ **Parallel agent execution** (4+ agents building simultaneously)
- ✅ **Visual polish** (particle systems, effects, shaders)
- ✅ **Audio integration** (sound effects, music layers)
- ✅ **Game balance** (difficulty scaling, progression)
- ✅ **Browser performance** (60 FPS with 100+ entities)
- ✅ **E2B sandboxes** (isolated development environments)
- ✅ **Autonomous QA** (patch review, testing, iteration)

---

## 🎮 Controls

| Key | Action |
|-----|--------|
| **W / ↑** | Move up |
| **A / ←** | Move left |
| **S / ↓** | Move down |
| **D / →** | Move right |
| **Mouse** | Aim (visual only) |
| **ESC** | Pause menu |
| **F11** | Toggle fullscreen |

**Note**: Weapons fire automatically. No shooting button needed!

---

## 🧪 Testing

### Run All Tests
```bash
npm test
```

### Test Categories
- **Unit Tests**: Individual components (weapons, zombies, synergies)
- **Integration Tests**: Game systems working together
- **Performance Tests**: FPS benchmarks, memory leak checks
- **Browser Tests**: Cross-browser compatibility

### Manual Testing Checklist
- [ ] Player moves in all directions smoothly
- [ ] All 10 weapons fire correctly
- [ ] All 8 zombie types spawn and behave
- [ ] Synergies trigger with correct combos
- [ ] Visual effects render without lag
- [ ] Sound plays without crackling
- [ ] Can survive and win 30-minute run
- [ ] High scores persist across sessions

---

## 📊 Technical Specifications

### Performance Targets
- **60 FPS** with 100 enemies on screen
- **30 FPS minimum** with 500+ enemies (late game)
- Memory usage < 500MB
- Load time < 3 seconds

### Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Technologies
- **Rendering**: HTML5 Canvas API
- **Language**: TypeScript (compiles to ES2020)
- **Audio**: Web Audio API
- **Storage**: LocalStorage for persistence
- **Build**: Vite (bundler)
- **Testing**: Vitest + Playwright

---

## 🎨 Art Style Guide

### Color Palette
```css
--background-dark: #0a0015;
--background-mid: #1a0033;
--neon-cyan: #00ffff;
--neon-magenta: #ff00ff;
--neon-blue: #0080ff;
--neon-green: #00ff80;
--neon-pink: #ff0080;
```

### Visual Principles
- **High contrast**: Dark backgrounds, bright neons
- **Glow everything**: Additive blending on all light sources
- **Particle chaos**: Explosions should fill screen with particles
- **Screen effects**: Shake, chromatic aberration, scanlines
- **Silhouettes**: Player and zombies are glowing shapes

---

## 🔊 Audio Design

### Music
- **Genre**: Synthwave / Cyberpunk Electronic
- **Structure**: Layered intensity (adds layers as enemies increase)
- **BPM**: 128-140 (energetic)
- **Key**: C minor (dark, moody)

### Sound Effect Categories
1. **Weapons**: Sharp, sci-fi, unique per weapon
2. **Enemies**: Guttural, distorted, zombie moans
3. **UI**: Glitch sounds, power-up chimes
4. **Ambient**: Heartbeat (low HP), sirens (bosses)

---

## 📈 Progression System

### Per-Run Leveling
- Start at Level 1
- Gain XP from zombie kills (10 XP per basic zombie)
- Level up every 1000 XP
- Max level: 30 (one per minute of gameplay)
- Each level: Choose 1 weapon OR 1 upgrade

### Meta Progression
- High scores tracked in LocalStorage
- Achievement system (display only)
- Stats: Total kills, best time, favorite weapon

---

## 🐛 Known Issues & Roadmap

### Current Status
- [x] Project structure created
- [x] Documentation complete
- [ ] Core game loop
- [ ] Player movement
- [ ] Basic zombie AI
- [ ] Weapon system
- [ ] (See START-HERE.md for full roadmap)

### Future Enhancements
- [ ] Mobile touch controls
- [ ] Online leaderboards
- [ ] Daily challenges
- [ ] Custom game modes
- [ ] Character skins
- [ ] More weapon types

---

## 🤝 Contributing

This is a **MAO test project**, but contributions welcome!

### Development Workflow
1. Fork the repository
2. Create feature branch (`git checkout -b feature/new-weapon`)
3. Make changes and test
4. Run test suite (`npm test`)
5. Commit with descriptive message
6. Push and create Pull Request

### Code Style
- TypeScript strict mode enabled
- ESLint + Prettier configured
- 2-space indentation
- Comments for complex logic

---

## 📝 License

MIT License - Do whatever you want with this code!

---

## 🙏 Credits

### Inspiration
- **Vampire Survivors** - Auto-shooter mechanics
- **Geometry Wars** - Neon aesthetic and screen effects
- **Crimsonland** - Wave-based survival gameplay

### Built With MAO
This entire project was built using **MAO (Multi-Agent Orchestrator)** autonomous development:
- Orchestrator Agent coordinated the build
- Specialized agents handled: game logic, visual effects, audio, testing
- Autonomous QA reviewed and applied all patches
- Human involvement: Requirements + PR review only

### Tools & Libraries
- TypeScript
- Vite
- Vitest
- Playwright
- Web Audio API
- Canvas API

---

## 🎮 Let's Play!

**Survive the neon apocalypse. Discover devastating synergies. Become unstoppable.**

**Your weapons fire themselves. You just need to stay alive.** 💀⚡

---

*Built to test autonomous AI development. Designed to be genuinely fun.*

**Star ⭐ this repo if MAO did a good job!**
