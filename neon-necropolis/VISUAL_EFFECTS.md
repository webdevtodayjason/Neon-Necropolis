# NEON NECROPOLIS - Visual Effects System

Complete visual effects implementation for the cyberpunk auto-shooter game.

## 📁 File Structure

```
neon-necropolis/
├── src/
│   ├── effects/                    # NEW: Visual effect classes
│   │   ├── BloodEffect.ts          # Zombie death particles
│   │   ├── XPOrbEffect.ts          # XP collection system
│   │   ├── PlayerEffects.ts        # Player visual effects
│   │   ├── WeaponEffects.ts        # All 10 weapon effects
│   │   └── index.ts                # Module exports
│   ├── engine/
│   │   ├── ParticleSystem.ts       # EXISTS: Object pooling (2000 particles)
│   │   ├── ScreenEffects.ts        # NEW: Screen shake & effects
│   │   └── ...
│   ├── utils/
│   │   └── Colors.ts               # NEW: Cyberpunk color palette
│   └── rendering/
│       ├── Effects.ts               # EXISTS: Post-processing
│       └── Renderer.ts              # EXISTS: Layer rendering
├── styles.css                       # NEW: Cyberpunk CSS with glitch animations
└── index.html                       # UPDATED: Enhanced with neon styling
```

## 🎨 Color Palette (Colors.ts)

### Primary Neon Colors
- **Cyan**: `#00ffff` - Main UI, grid, player
- **Magenta**: `#ff00ff` - Zombies, blood effects
- **Yellow**: `#ffff00` - Warnings, level-ups

### Extended Palette
- **Electric Blue**: `#0080ff` - Special effects
- **Hot Pink**: `#ff0080` - Damage indicators
- **Acid Green**: `#00ff80` - Health, XP
- **Purple**: `#8800ff` - Energy effects
- **Orange**: `#ff8800` - Explosions

### Weapon Colors
Each of the 10 weapons has a unique color:
- Pistol: Cyan
- Shotgun: Orange
- SMG: Magenta
- Rifle: Electric Blue
- Sniper: Purple
- Rocket: Red
- Laser: Green
- Plasma: Cyan
- Flamethrower: Yellow
- Railgun: White

### Glow Intensities
- `subtle`: 5px
- `low`: 10px
- `medium`: 15px
- `high`: 20px
- `intense`: 30px
- `extreme`: 50px

## 🔫 Weapon Effects (WeaponEffects.ts)

All 10 weapons have unique visual effects:

### 1. PISTOL
- Cyan muzzle flash
- Simple particle trail
- Medium glow

### 2. SHOTGUN
- Orange spread blast
- 12 particles in wide cone
- Smoke puff effect
- High glow intensity

### 3. LASER
- Red beam with sparkles
- Particles along beam path
- Intense glow muzzle flash

### 4. ORBITAL
- Cyan rotating projectiles
- Circular trail particles
- Orbital motion effect

### 5. LIGHTNING
- Yellow electric arcs
- Jagged lightning bolts
- Chain effect between enemies
- Extreme glow

### 6. MISSILES
- Magenta explosive trail
- Rocket exhaust smoke
- Orange sparkles
- Large explosion on impact

### 7. FLAMETHROWER
- Yellow/orange fire particles
- Wide spread cone (π/3)
- Smoke effect
- Gravity: upward drift

### 8. TESLA
- Electric blue energy ball
- 20-particle burst
- Electric arc sparkles
- White lightning branches

### 9. ICE
- Light blue freezing particles
- Ice crystal sparkles
- Slight upward float
- Medium glow

### 10. POISON
- Green toxic cloud
- Large smoke particles
- Acid green sparkles
- Upward drift

### Shared Effects
- **Muzzle Flash**: Directional cone of particles
- **Projectile Trail**: Follows moving projectiles
- **Impact**: Burst on enemy hit
- **Explosion**: Large area effect

## 💀 Blood Effects (BloodEffect.ts)

### Methods

#### `splatter(x, y, intensity)`
Main death effect - 15+ magenta particles with sparkles
```typescript
bloodEffect.splatter(zombie.x, zombie.y, 1.5);
```

#### `spray(x, y, direction, count)`
Minor hit effect - directional blood spray
```typescript
bloodEffect.spray(x, y, angle, 5);
```

#### `mist(x, y, radius)`
Explosive death - large area blood cloud
```typescript
bloodEffect.mist(x, y, 50);
```

#### `trail(x, y, velocityX, velocityY)`
Following projectile - blood drops
```typescript
bloodEffect.trail(x, y, vx, vy);
```

#### `pool(x, y, size)`
Ground effect - stationary blood pool
```typescript
bloodEffect.pool(x, y, 20);
```

## ✨ XP Orbs (XPOrbEffect.ts)

### Features
- Cyan glowing orbs with pulse animation
- Magnetic attraction to player
- Automatic collection within 20px
- Trail particles while moving
- Maximum 200 orbs simultaneously

### Methods

#### `spawn(x, y, xpValue)`
Create XP orbs at location
```typescript
xpOrbEffect.spawn(zombie.x, zombie.y, 25);
```

#### `update(deltaTime, playerX, playerY, magnetRadius)`
Update orb positions and attraction
```typescript
xpOrbEffect.update(deltaTime, player.x, player.y, 150);
```

#### `render(ctx)`
Render all orbs with glow
```typescript
xpOrbEffect.render(ctx);
```

### Visual Properties
- Pulsing animation (sine wave)
- White bright core
- Cyan outer glow (extreme intensity)
- Outer ring at 1.5x size

## 🎮 Player Effects (PlayerEffects.ts)

### Movement Trail
Automatic trail when moving
```typescript
playerEffects.trail(player.x, player.y, velocityX, velocityY, deltaTime);
```

### Damage Flash
Red/magenta burst on hit
```typescript
playerEffects.damageFlash(player.x, player.y, 1.0);
```

### Level Up
Massive cyan/yellow explosion
```typescript
playerEffects.levelUp(player.x, player.y);
```
- 30 outer ring particles
- 20 inner burst particles
- 15 floating upward particles

### Heal Effect
Green floating sparkles
```typescript
playerEffects.heal(player.x, player.y);
```

### Dash Effect
Directional trail
```typescript
playerEffects.dash(player.x, player.y, direction);
```

### Shield Hit
Particles bounce off at angle
```typescript
playerEffects.shieldHit(x, y, impactAngle);
```

### Invincibility
Rotating yellow aura
```typescript
playerEffects.invincibility(player.x, player.y, radius);
```

### Respawn
Cyan/white explosion
```typescript
playerEffects.respawn(player.x, player.y);
```

## 📺 Screen Effects (ScreenEffects.ts)

### Screen Shake

#### Manual Control
```typescript
screenEffects.shake({ intensity: 10, duration: 400, frequency: 0.1 });
```

#### Presets
```typescript
screenEffects.shakeSmall();      // intensity: 3, duration: 200ms
screenEffects.shakeMedium();     // intensity: 6, duration: 300ms
screenEffects.shakeLarge();      // intensity: 10, duration: 400ms
screenEffects.shakeExplosion();  // intensity: 15, duration: 500ms
screenEffects.shakeDamage();     // intensity: 8, duration: 250ms
```

### Screen Flash

#### Manual Control
```typescript
screenEffects.flash('#ff0080', 0.5, 0.05);  // color, intensity, decay
```

#### Presets
```typescript
screenEffects.flashDamage();      // Hot pink, 0.4 intensity
screenEffects.flashHeal();        // Acid green, 0.3 intensity
screenEffects.flashLevelUp();     // Cyan, 0.6 intensity
screenEffects.flashExplosion();   // Yellow, 0.7 intensity
screenEffects.flashDeath();       // Red, 0.8 intensity
screenEffects.flashWhite();       // White, 0.9 intensity
```

### Freeze Frame
Dramatic pause effect
```typescript
screenEffects.freeze(150);        // 150ms pause
screenEffects.freezeHit();        // 50ms
screenEffects.freezeKill();       // 100ms
screenEffects.freezeCritical();   // 150ms
```

### Zoom Effect
```typescript
screenEffects.zoomTo(1.2, 0.1);   // target scale, speed
screenEffects.resetZoom();         // back to 1.0
```

### Chromatic Aberration
RGB split effect
```typescript
screenEffects.chromaticAberration(5);  // intensity
```

### Combo Effects
Predefined combinations:
```typescript
screenEffects.comboPlayerDamage();    // shake + flash + chromatic
screenEffects.comboPlayerDeath();     // explosion + zoom
screenEffects.comboLevelUp();         // shake + flash + freeze
screenEffects.comboBigExplosion();    // all effects combined
screenEffects.comboCriticalHit();     // flash + freeze + zoom
```

## 🎨 CSS Animations (styles.css)

### Neon Text Classes
```html
<h1 class="neon-text-cyan">NEON NECROPOLIS</h1>
<p class="neon-text-magenta">Game Over</p>
<span class="neon-text-yellow">Level Up!</span>
```

### Glitch Effect
```html
<div class="glitch" data-text="CORRUPTED">CORRUPTED</div>
```

### Neon Buttons
```html
<button class="neon-button">START GAME</button>
<button class="neon-button neon-button-magenta">OPTIONS</button>
<button class="neon-button neon-button-yellow">EXIT</button>
```

### Animations
- `pulse` - Breathing effect (2s)
- `flicker` - Neon flicker (0.15s)
- `glitch` - Cyberpunk glitch
- `fade-in` - Fade in (0.5s)
- `fade-out` - Fade out (0.5s)
- `slide-up` - Slide from bottom (0.5s)

### Background Effects
- Animated grid pattern
- CRT scanlines
- Radial gradient background

## 🎯 Integration Example

```typescript
import { ParticleSystem } from './engine/ParticleSystem';
import { ScreenEffects } from './engine/ScreenEffects';
import { BloodEffect, XPOrbEffect, PlayerEffects, WeaponEffects } from './effects';
import { Colors } from './utils/Colors';

// Initialize systems
const particles = new ParticleSystem(2000);
const screenEffects = new ScreenEffects();

// Initialize effects
const bloodEffect = new BloodEffect(particles);
const xpOrbEffect = new XPOrbEffect(particles);
const playerEffects = new PlayerEffects(particles);
const weaponEffects = new WeaponEffects(particles);

// Game loop
function update(deltaTime: number) {
  // Update effects
  particles.update(deltaTime);
  xpOrbEffect.update(deltaTime, player.x, player.y, 150);
  screenEffects.update(deltaTime);
}

function render(ctx: CanvasRenderingContext2D) {
  // Apply screen shake
  ctx.save();
  screenEffects.applyShake(ctx);

  // Render game...
  particles.render(ctx);
  xpOrbEffect.render(ctx);

  ctx.restore();

  // Render screen flash (after everything)
  screenEffects.renderFlash(ctx, canvas.width, canvas.height);
}

// Event handlers
function onZombieDeath(zombie: Zombie) {
  bloodEffect.splatter(zombie.x, zombie.y, 1.5);
  xpOrbEffect.spawn(zombie.x, zombie.y, zombie.xpValue);
  screenEffects.shakeSmall();
}

function onPlayerLevelUp(player: Player) {
  playerEffects.levelUp(player.x, player.y);
  screenEffects.comboLevelUp();
}

function onWeaponFire(weapon: string, x: number, y: number, angle: number) {
  switch(weapon) {
    case 'PISTOL':
      weaponEffects.pistol(x, y, angle);
      break;
    case 'SHOTGUN':
      weaponEffects.shotgun(x, y, angle);
      screenEffects.shakeSmall();
      break;
    case 'LASER':
      weaponEffects.laser(x, y, angle, 100);
      break;
    // ... etc
  }
}
```

## 🔧 Performance Notes

### Particle System
- Object pooling for 2000 particles
- No memory allocation during gameplay
- Circular buffer for efficient reuse

### Optimization Tips
1. Reuse particle instances (pooling)
2. Limit active particles per frame
3. Use `getPoolUtilization()` to monitor usage
4. Reduce particle count on lower-end devices

### Memory Usage
- Particle pool: ~1.5 MB
- XP orbs (200 max): ~50 KB
- Screen effects: Negligible

## 🎮 CSS Variables

Override colors in your styles:
```css
:root {
  --neon-cyan: #00ffff;
  --neon-magenta: #ff00ff;
  --glow-medium: 15px;
}
```

## 📊 Performance Monitoring

```typescript
// Check particle pool usage
const utilization = particles.getPoolUtilization();
console.log(`Pool: ${(utilization * 100).toFixed(1)}%`);

// Count active particles
const activeCount = particles.getActiveCount();
console.log(`Active particles: ${activeCount}/2000`);
```

## 🚀 Next Steps

To integrate into your game:

1. **Import effects in Game.ts**
   ```typescript
   import { BloodEffect, XPOrbEffect, PlayerEffects, WeaponEffects } from '../effects';
   ```

2. **Initialize in constructor**
   ```typescript
   this.bloodEffect = new BloodEffect(this.particles);
   this.xpOrbEffect = new XPOrbEffect(this.particles);
   // etc...
   ```

3. **Call effects on events**
   - Zombie death → `bloodEffect.splatter()` + `xpOrbEffect.spawn()`
   - Weapon fire → `weaponEffects.pistol()` etc.
   - Player damage → `playerEffects.damageFlash()` + `screenEffects.shakeDamage()`
   - Level up → `playerEffects.levelUp()` + `screenEffects.comboLevelUp()`

4. **Update in game loop**
   ```typescript
   this.particles.update(deltaTime);
   this.xpOrbEffect.update(deltaTime, player.x, player.y);
   this.screenEffects.update(deltaTime);
   ```

5. **Render in draw loop**
   ```typescript
   this.particles.render(ctx);
   this.xpOrbEffect.render(ctx);
   this.screenEffects.renderFlash(ctx, width, height);
   ```

---

**Built for NEON NECROPOLIS** 🎮⚡
A cyberpunk auto-shooter survival game with stunning neon visual effects.
