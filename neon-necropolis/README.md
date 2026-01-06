# 🎮 NEON NECROPOLIS

A fast-paced cyberpunk auto-shooter survival game built with TypeScript and HTML5 Canvas.

## 🌟 Game Overview

Survive for 30 minutes in a neon-drenched wasteland filled with relentless zombie hordes. Your weapons automatically fire at the nearest enemy - focus on movement, weapon selection, and strategic upgrades to stay alive!

## 🕹️ How to Play

### Controls
- **WASD** or **Arrow Keys** - Move your character
- **1, 2, 3** - Select weapon upgrades during level up
- **SPACE** - Start game / Restart after game over

### Objective
Survive for 30 minutes against increasingly difficult waves of zombies.

### Gameplay Loop
1. **Move** to avoid zombie attacks
2. **Weapons auto-fire** at the nearest enemy
3. **Kill zombies** to gain XP
4. **Level up** to unlock new weapons or upgrade existing ones
5. **Survive** until the timer reaches 30:00

## 🎯 Game Features

### Core Systems
- ✅ **60 FPS Game Loop** with fixed timestep
- ✅ **WASD/Arrow Key Movement**
- ✅ **Spatial Hashing Physics** for efficient collision detection
- ✅ **Camera System** with screen shake effects
- ✅ **Object Pooling** for projectiles (performance optimization)

### 10 Unique Weapons

1. **Pistol** - Basic starting weapon, reliable damage
2. **Shotgun** - Spreads 5 projectiles in a cone
3. **Laser** - High damage, fast fire rate, pierces enemies
4. **Orbital** - Fires 3 projectiles in a circular pattern
5. **Lightning** - Chain lightning that jumps between enemies
6. **Missiles** - Slow but powerful explosive projectiles
7. **Flamethrower** - Rapid-fire with short range and DoT
8. **Tesla** - Area-of-effect electric blasts
9. **Ice** - Slows enemies and deals steady damage
10. **Poison** - Damage over time with pierce

### 9 Zombie Types

| Type | Health | Speed | Special Ability |
|------|--------|-------|-----------------|
| **Shambler** | 30 | Slow | Basic enemy |
| **Runner** | 20 | Fast | Quick attacks |
| **Tank** | 150 | Slow | High HP and damage |
| **Exploder** | 25 | Medium | Explodes on death |
| **Spitter** | 40 | Slow | Ranged attacks |
| **Swarm** | 15 | Fast | Spawns in groups |
| **Brute** | 200 | Medium | Mini-boss |
| **Phantom** | 35 | Fast | Can teleport |
| **Necromancer** | 100 | Slow | Summons other zombies |

### Weapon Synergies

Unlock powerful bonuses by collecting specific weapon combinations:

1. **Elemental Fury** (Ice + Flamethrower + Lightning) - +50% damage to elemental weapons
2. **Tech Arsenal** (Laser + Tesla + Orbital) - +30% fire rate for tech weapons
3. **Heavy Artillery** (Missiles + Shotgun) - +2 projectiles for explosive weapons
4. **Rapid Assault** (Pistol + Lightning + Poison) - +1 pierce for fast weapons
5. **Death Blossom** (Orbital + Tesla + Missiles) - Increased AoE radius

### Progressive Difficulty
- **Wave System** - New wave every 2 minutes
- **Scaling Enemies** - Health and damage increase with each wave
- **More Zombies** - Spawn rate and count increase over time
- **New Enemy Types** - Unlock at specific waves

### UI Elements
- **Health Bar** - Track your remaining HP
- **XP Bar** - Progress toward next level
- **Timer** - Shows remaining time (30:00 countdown)
- **Wave Counter** - Current wave number
- **Level Display** - Your current level
- **Game Over Screen** - Final stats and retry option
- **Victory Screen** - Celebrate surviving 30 minutes!

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

```bash
# Navigate to project directory
cd neon-necropolis

# Install dependencies
npm install

# Start development server
npm run dev

# Open browser to http://localhost:3000
```

### Build for Production

```bash
# Build the game
npm run build

# Preview production build
npm run preview
```

## 🛠️ Technical Architecture

### Project Structure
```
neon-necropolis/
├── src/
│   ├── engine/
│   │   ├── Engine.ts          # Game loop (60 FPS)
│   │   ├── Input.ts           # Keyboard input handling
│   │   ├── Physics.ts         # Collision detection with spatial hashing
│   │   ├── Camera.ts          # Camera system with screen shake
│   │   └── ParticleSystem.ts  # Visual effects
│   ├── game/
│   │   ├── Game.ts            # Game state manager
│   │   ├── Player.ts          # Player entity
│   │   ├── Zombie.ts          # Zombie entity
│   │   ├── ZombieTypes.ts     # All 9 zombie configurations
│   │   ├── Weapon.ts          # Weapon base class
│   │   ├── WeaponTypes.ts     # All 10 weapon configurations
│   │   ├── Projectile.ts      # Projectile with pooling
│   │   ├── Spawner.ts         # Wave-based enemy spawning
│   │   └── Synergy.ts         # Weapon synergy system
│   ├── ui/
│   │   ├── HUD.ts             # Heads-up display
│   │   ├── LevelUpUI.ts       # Level up weapon selection
│   │   └── GameOverUI.ts      # Game over and victory screens
│   └── main.ts                # Entry point
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

### Key Technologies
- **TypeScript** - Type-safe game code
- **Vite** - Fast build tool and dev server
- **HTML5 Canvas** - 2D rendering
- **Spatial Hashing** - O(1) collision detection
- **Object Pooling** - Memory-efficient projectile management

### Performance Optimizations
- Fixed timestep game loop for consistent physics
- Spatial hashing reduces collision checks from O(n²) to O(n)
- Object pooling prevents garbage collection pauses
- Efficient rendering with dirty rectangle tracking

## 🎨 Game Design

### Balance Philosophy
- **Early Game** - Learn mechanics with weak enemies
- **Mid Game** - Build powerful weapon combinations
- **Late Game** - Survive overwhelming hordes with synergies

### Progression System
- Gain XP by killing zombies
- Level up every 1000 XP
- Choose from 3 random weapon options
- Either unlock new weapons or upgrade existing ones

### Difficulty Curve
The game is designed to reach maximum intensity around 20-25 minutes, making the final stretch a true test of skill and weapon synergy mastery.

## 🐛 Known Issues

None currently! Report issues if you find any.

## 📝 Future Enhancements

Potential features for future versions:
- Additional weapon types
- Boss enemies
- Multiple character classes
- Power-ups and consumables
- Permanent upgrades between runs
- Leaderboards
- Sound effects and music
- Particle effects system integration

## 🤝 Contributing

This is a demonstration project. Feel free to fork and extend it!

## 📜 License

MIT License - Feel free to use this code for learning or your own projects.

## 🎮 Play Now!

Start the dev server and open http://localhost:3000 to play immediately!

**Good luck, survivor. The neon wasteland awaits...**

---

*Built with ❤️ using TypeScript and HTML5 Canvas*
