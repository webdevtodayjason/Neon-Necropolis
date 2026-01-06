# 🎮 NEON NECROPOLIS - Visual Effects Quick Reference

## 🚀 Quick Start

```typescript
import { ParticleSystem } from './engine/ParticleSystem';
import { ScreenEffects } from './engine/ScreenEffects';
import { BloodEffect, XPOrbEffect, PlayerEffects, WeaponEffects } from './effects';
import { Colors } from './utils/Colors';

// Initialize
const particles = new ParticleSystem(2000);
const screenEffects = new ScreenEffects();
const bloodEffect = new BloodEffect(particles);
const xpOrbEffect = new XPOrbEffect(particles);
const playerEffects = new PlayerEffects(particles);
const weaponEffects = new WeaponEffects(particles);

// Update (every frame)
particles.update(deltaTime);
xpOrbEffect.update(deltaTime, player.x, player.y, 150);
screenEffects.update(deltaTime);

// Render (every frame)
ctx.save();
screenEffects.applyShake(ctx);
particles.render(ctx);
xpOrbEffect.render(ctx);
ctx.restore();
screenEffects.renderFlash(ctx, width, height);
```

---

## 💥 Common Effects

### Zombie Death
```typescript
bloodEffect.splatter(zombie.x, zombie.y, 1.5);
xpOrbEffect.spawn(zombie.x, zombie.y, 25);
screenEffects.shakeSmall();
```

### Player Damage
```typescript
playerEffects.damageFlash(player.x, player.y);
screenEffects.shakeDamage();
screenEffects.flashDamage();
```

### Level Up
```typescript
playerEffects.levelUp(player.x, player.y);
screenEffects.comboLevelUp();
```

### Weapon Fire
```typescript
weaponEffects.pistol(x, y, angle);
weaponEffects.shotgun(x, y, angle);
weaponEffects.laser(x, y, angle, 100);
weaponEffects.lightning(x, y, targetX, targetY);
weaponEffects.missiles(x, y, angle);
weaponEffects.flamethrower(x, y, angle);
weaponEffects.tesla(x, y, angle);
weaponEffects.ice(x, y, angle);
weaponEffects.poison(x, y, angle);
weaponEffects.orbital(x, y, angle);
```

### Big Explosion
```typescript
bloodEffect.mist(x, y, 50);
weaponEffects.explosion(x, y, Colors.orange, 2.0);
screenEffects.comboBigExplosion();
```

---

## 🎨 Colors Quick Reference

```typescript
import { Colors } from './utils/Colors';

// Primary
Colors.cyan      // #00ffff
Colors.magenta   // #ff00ff
Colors.yellow    // #ffff00

// Extended
Colors.electricBlue  // #0080ff
Colors.hotPink       // #ff0080
Colors.acidGreen     // #00ff80
Colors.purple        // #8800ff
Colors.orange        // #ff8800

// Weapons
Colors.weapon.pistol       // #00ffff
Colors.weapon.shotgun      // #ff8800
Colors.weapon.laser        // #ff0000
Colors.weapon.lightning    // #ffff00
Colors.weapon.missiles     // #ff00ff
Colors.weapon.flamethrower // #ffff00
Colors.weapon.tesla        // #0080ff
Colors.weapon.ice          // #00ccff
Colors.weapon.poison       // #00ff00
Colors.weapon.orbital      // #00ffff

// Effects
Colors.effects.blood     // #ff00ff
Colors.effects.xp        // #00ffff
Colors.effects.damage    // #ff0080
Colors.effects.heal      // #00ff80
Colors.effects.levelUp   // #ffff00

// Glow
Colors.glow.subtle   // 5
Colors.glow.low      // 10
Colors.glow.medium   // 15
Colors.glow.high     // 20
Colors.glow.intense  // 30
Colors.glow.extreme  // 50

// Helpers
Colors.withAlpha('#00ffff', 0.5)           // rgba(0,255,255,0.5)
Colors.randomNeon()                        // Random neon color
Colors.lerp('#00ffff', '#ff00ff', 0.5)    // Interpolate
Colors.getHealthColor(0.5)                 // Health gradient
```

---

## 📺 Screen Effects

### Screen Shake
```typescript
screenEffects.shakeSmall();      // Light shake (3px, 200ms)
screenEffects.shakeMedium();     // Medium shake (6px, 300ms)
screenEffects.shakeLarge();      // Large shake (10px, 400ms)
screenEffects.shakeExplosion();  // Explosion (15px, 500ms)
screenEffects.shakeDamage();     // Damage (8px, 250ms)

// Custom
screenEffects.shake({ intensity: 10, duration: 400, frequency: 0.1 });
```

### Screen Flash
```typescript
screenEffects.flashDamage();      // Hot pink
screenEffects.flashHeal();        // Acid green
screenEffects.flashLevelUp();     // Cyan
screenEffects.flashExplosion();   // Yellow
screenEffects.flashDeath();       // Red
screenEffects.flashWhite();       // White

// Custom
screenEffects.flash('#00ffff', 0.5, 0.05);  // color, intensity, decay
```

### Other Effects
```typescript
screenEffects.freeze(150);               // Pause for 150ms
screenEffects.zoomTo(1.2, 0.1);         // Zoom to 1.2x
screenEffects.chromaticAberration(5);   // RGB split

// Combos
screenEffects.comboPlayerDamage();      // shake + flash + chromatic
screenEffects.comboPlayerDeath();       // explosion + zoom
screenEffects.comboLevelUp();           // shake + flash + freeze
screenEffects.comboBigExplosion();      // all effects
screenEffects.comboCriticalHit();       // flash + freeze + zoom
```

---

## 💉 Blood Effects

```typescript
bloodEffect.splatter(x, y, 1.5);        // Main death effect
bloodEffect.spray(x, y, angle, 5);      // Directional spray
bloodEffect.mist(x, y, 50);             // Area cloud
bloodEffect.trail(x, y, vx, vy);        // Following projectile
bloodEffect.pool(x, y, 20);             // Ground pool
```

---

## 💎 XP Orbs

```typescript
xpOrbEffect.spawn(x, y, 25);            // Create orb worth 25 XP
xpOrbEffect.update(dt, px, py, 150);    // Update with magnetic pull
xpOrbEffect.render(ctx);                 // Draw orbs
xpOrbEffect.getOrbs();                   // Get all orbs
xpOrbEffect.clear();                     // Remove all orbs
```

---

## 🏃 Player Effects

```typescript
playerEffects.trail(x, y, vx, vy, dt);  // Movement trail
playerEffects.damageFlash(x, y);        // Hit effect
playerEffects.heal(x, y);               // Heal effect
playerEffects.levelUp(x, y);            // Level up burst
playerEffects.dash(x, y, angle);        // Dash trail
playerEffects.shieldHit(x, y, angle);   // Shield impact
playerEffects.invincibility(x, y, 30);  // Invincibility aura
playerEffects.respawn(x, y);            // Respawn effect
```

---

## 🎯 Weapon Effects

```typescript
// Simple weapons
weaponEffects.pistol(x, y, angle);
weaponEffects.shotgun(x, y, angle);

// Beam weapons
weaponEffects.laser(x, y, angle, length);

// Chain weapons
weaponEffects.lightning(x, y, targetX, targetY);

// Projectile weapons
weaponEffects.missiles(x, y, angle);
weaponEffects.flamethrower(x, y, angle);
weaponEffects.tesla(x, y, angle);
weaponEffects.ice(x, y, angle);
weaponEffects.poison(x, y, angle);
weaponEffects.orbital(x, y, angle);

// Generic effects
weaponEffects.projectileTrail(x, y, vx, vy, color);
weaponEffects.explosion(x, y, color, intensity);
weaponEffects.impact(x, y, color, size);
```

---

## 🎨 CSS Classes

```html
<!-- Text -->
<h1 class="neon-text-cyan">TITLE</h1>
<p class="neon-text-magenta">Subtitle</p>
<span class="neon-text-yellow">Warning</span>

<!-- Glitch -->
<div class="glitch" data-text="GLITCH">GLITCH</div>

<!-- Buttons -->
<button class="neon-button">Default (Cyan)</button>
<button class="neon-button neon-button-magenta">Magenta</button>
<button class="neon-button neon-button-yellow">Yellow</button>

<!-- Animations -->
<div class="pulse">Pulsing</div>
<div class="flicker">Flickering</div>
<div class="fade-in">Fading in</div>
<div class="slide-up">Sliding up</div>

<!-- Borders -->
<div class="neon-border">Cyan border</div>
<div class="neon-border-magenta">Magenta border</div>

<!-- Utility -->
<div class="hidden">Hidden</div>
<div class="no-select">No selection</div>
```

---

## 📊 Performance Monitoring

```typescript
// Check particle usage
const active = particles.getActiveCount();
const utilization = particles.getPoolUtilization();
console.log(`Particles: ${active}/2000 (${(utilization * 100).toFixed(1)}%)`);

// Check XP orbs
const orbCount = xpOrbEffect.getCount();
console.log(`XP Orbs: ${orbCount}/200`);
```

---

## 🔧 Configuration

```typescript
// Adjust particle pool size
const particles = new ParticleSystem(1000); // Half size for mobile

// Customize colors
Colors.weapon.pistol = '#ff00ff';

// Disable effects
screenEffects.clear();

// CSS variables
<style>
:root {
  --neon-cyan: #00ffff;
  --glow-medium: 15px;
}
</style>
```

---

## 💡 Common Patterns

### Enemy Hit
```typescript
bloodEffect.spray(enemy.x, enemy.y, hitAngle, 5);
weaponEffects.impact(enemy.x, enemy.y, weaponColor, 1.0);
```

### Boss Death
```typescript
bloodEffect.mist(boss.x, boss.y, 100);
weaponEffects.explosion(boss.x, boss.y, Colors.magenta, 3.0);
screenEffects.comboBigExplosion();
```

### Critical Hit
```typescript
weaponEffects.impact(enemy.x, enemy.y, Colors.yellow, 2.0);
screenEffects.comboCriticalHit();
```

### Player Movement
```typescript
if (player.isMoving) {
  playerEffects.trail(player.x, player.y, vx, vy, deltaTime);
}
```

---

## 🎮 Full Example

```typescript
class Game {
  particles: ParticleSystem;
  screenEffects: ScreenEffects;
  bloodEffect: BloodEffect;
  xpOrbEffect: XPOrbEffect;
  playerEffects: PlayerEffects;
  weaponEffects: WeaponEffects;

  constructor() {
    this.particles = new ParticleSystem(2000);
    this.screenEffects = new ScreenEffects();
    this.bloodEffect = new BloodEffect(this.particles);
    this.xpOrbEffect = new XPOrbEffect(this.particles);
    this.playerEffects = new PlayerEffects(this.particles);
    this.weaponEffects = new WeaponEffects(this.particles);
  }

  update(deltaTime: number) {
    this.particles.update(deltaTime);
    this.xpOrbEffect.update(deltaTime, this.player.x, this.player.y, 150);
    this.screenEffects.update(deltaTime);
  }

  render(ctx: CanvasRenderingContext2D) {
    ctx.save();
    this.screenEffects.applyShake(ctx);

    // Render game...
    this.particles.render(ctx);
    this.xpOrbEffect.render(ctx);

    ctx.restore();
    this.screenEffects.renderFlash(ctx, this.width, this.height);
  }

  onZombieDeath(zombie: Zombie) {
    this.bloodEffect.splatter(zombie.x, zombie.y, 1.5);
    this.xpOrbEffect.spawn(zombie.x, zombie.y, zombie.xpValue);
    this.screenEffects.shakeSmall();
  }

  onWeaponFire(weapon: string, x: number, y: number, angle: number) {
    switch(weapon) {
      case 'PISTOL': this.weaponEffects.pistol(x, y, angle); break;
      case 'SHOTGUN': this.weaponEffects.shotgun(x, y, angle); break;
      case 'LASER': this.weaponEffects.laser(x, y, angle); break;
      // etc...
    }
  }

  onPlayerLevelUp() {
    this.playerEffects.levelUp(this.player.x, this.player.y);
    this.screenEffects.comboLevelUp();
  }
}
```

---

## 📁 File Locations

```
src/
├── utils/Colors.ts                  # Color palette
├── engine/
│   ├── ParticleSystem.ts            # Particle engine
│   └── ScreenEffects.ts             # Screen effects
└── effects/
    ├── BloodEffect.ts               # Blood particles
    ├── XPOrbEffect.ts               # XP system
    ├── PlayerEffects.ts             # Player effects
    ├── WeaponEffects.ts             # Weapon effects
    └── index.ts                     # Exports
```

---

**For detailed documentation, see `VISUAL_EFFECTS.md`**
**For complete overview, see `EFFECTS_SUMMARY.md`**
