# Game Mechanics Implementation Specification

**Document Type**: Technical Specification
**System**: Core Game Mechanics
**Priority**: P0 (Critical - Foundation)

---

## Overview

This specification defines the core game mechanics for Neon Necropolis, including player control, weapon systems, enemy behavior, and progression systems.

---

## 1. Player System

### 1.1 Player Entity

**File**: `src/game/Player.ts`

```typescript
interface Player {
  position: Vector2;
  velocity: Vector2;
  speed: number;              // Base: 200 pixels/second
  maxSpeed: number;           // Base: 300 pixels/second
  health: number;             // Base: 100
  maxHealth: number;          // Base: 100
  level: number;              // Starts at 1
  experience: number;         // Current XP
  experienceToNextLevel: number;  // 1000 * level
  weapons: Weapon[];          // Active weapons
  isDead: boolean;
  invulnerableTime: number;   // 2 seconds after hit
}
```

### 1.2 Movement System

**Implementation Requirements:**

1. **Input Handling**:
   - Listen for `keydown`/`keyup` events
   - Track WASD and Arrow keys simultaneously
   - Support diagonal movement (normalized vector)

2. **Movement Calculation**:
   ```typescript
   // Pseudo-code
   update(deltaTime: number) {
     const input = getInputVector(); // Returns normalized (-1 to 1) on X and Y
     this.velocity = input.multiply(this.speed);
     this.position.add(this.velocity.multiply(deltaTime));

     // Clamp to world bounds
     this.position.x = clamp(this.position.x, 0, worldWidth);
     this.position.y = clamp(this.position.y, 0, worldHeight);
   }
   ```

3. **Visual Feedback**:
   - Trail effect when moving (particles fade behind player)
   - Player sprite rotates toward nearest enemy (visual only)
   - Pulsing glow effect on player outline

### 1.3 Health & Damage

**Damage System:**
- Player takes damage on collision with zombie
- Invulnerability window: 2 seconds after hit
- Flash effect during invulnerability (blink on/off every 0.1s)
- Screen chromatic aberration effect on damage
- Camera shake (intensity based on damage)

**Death Handling:**
```typescript
takeDamage(amount: number) {
  if (this.invulnerableTime > 0) return;

  this.health -= amount;
  this.invulnerableTime = 2.0;

  // Effects
  triggerScreenShake(5);
  triggerChromaticAberration(0.5);
  playSound('player_hurt');

  if (this.health <= 0) {
    this.die();
  }
}

die() {
  this.isDead = true;
  playSound('player_death');
  triggerDeathEffect();
  showGameOverScreen();
}
```

---

## 2. Weapon System

### 2.1 Weapon Base Class

**File**: `src/game/Weapon.ts`

```typescript
abstract class Weapon {
  name: string;
  damage: number;
  fireRate: number;           // Shots per second
  range: number;              // Max distance in pixels
  pierce: number;             // Enemies hit per projectile
  areaOfEffect: number;       // Explosion radius (0 if none)
  level: number;              // Upgrade level (1-5)

  timeSinceLastFire: number;

  abstract fire(player: Player, enemies: Zombie[]): void;

  update(deltaTime: number) {
    this.timeSinceLastFire += deltaTime;
  }

  canFire(): boolean {
    return this.timeSinceLastFire >= (1 / this.fireRate);
  }

  resetFireTimer() {
    this.timeSinceLastFire = 0;
  }
}
```

### 2.2 Auto-Fire System

**Implementation**:

```typescript
// In Game.ts update loop
updateWeapons(deltaTime: number) {
  for (const weapon of player.weapons) {
    weapon.update(deltaTime);

    if (weapon.canFire() && enemies.length > 0) {
      weapon.fire(player, enemies);
      weapon.resetFireTimer();
    }
  }
}
```

### 2.3 Targeting System

**Nearest Enemy Algorithm**:
```typescript
findNearestEnemy(player: Player, enemies: Zombie[]): Zombie | null {
  let nearest: Zombie | null = null;
  let minDistance = Infinity;

  for (const enemy of enemies) {
    const distance = player.position.distanceTo(enemy.position);
    if (distance < minDistance) {
      minDistance = distance;
      nearest = enemy;
    }
  }

  return nearest;
}
```

### 2.4 Weapon Implementations

#### Pistol (Starting Weapon)
```typescript
class Pistol extends Weapon {
  constructor() {
    super({
      name: 'Pistol',
      damage: 10,
      fireRate: 3,        // 3 shots/second
      range: 400,
      pierce: 0,
      areaOfEffect: 0
    });
  }

  fire(player: Player, enemies: Zombie[]) {
    const target = findNearestEnemy(player, enemies);
    if (!target) return;

    const direction = target.position.subtract(player.position).normalize();

    createProjectile({
      position: player.position,
      velocity: direction.multiply(600),  // Bullet speed
      damage: this.damage,
      pierce: this.pierce,
      range: this.range,
      owner: 'player',
      type: 'bullet'
    });

    playSound('pistol_fire');
    createMuzzleFlash(player.position, direction);
  }
}
```

#### Shotgun
```typescript
class Shotgun extends Weapon {
  pelletCount: number = 5;
  spread: number = 0.3;  // Radians

  fire(player: Player, enemies: Zombie[]) {
    const target = findNearestEnemy(player, enemies);
    if (!target) return;

    const baseDirection = target.position.subtract(player.position).normalize();

    // Fire multiple pellets in a cone
    for (let i = 0; i < this.pelletCount; i++) {
      const angle = -this.spread/2 + (this.spread / this.pelletCount) * i;
      const direction = baseDirection.rotate(angle);

      createProjectile({
        position: player.position,
        velocity: direction.multiply(500),
        damage: this.damage,
        pierce: this.pierce,
        range: this.range,
        owner: 'player',
        type: 'pellet'
      });
    }

    playSound('shotgun_fire');
    triggerScreenShake(2);
  }
}
```

#### Laser Beam
```typescript
class LaserBeam extends Weapon {
  beamDuration: number = 0.1;  // Instant hit, visual lasts 0.1s

  fire(player: Player, enemies: Zombie[]) {
    const target = findNearestEnemy(player, enemies);
    if (!target) return;

    const direction = target.position.subtract(player.position).normalize();

    // Raycast to find all enemies in line
    const hit = raycastEnemies(player.position, direction, this.range, this.pierce);

    for (const enemy of hit) {
      enemy.takeDamage(this.damage);
    }

    // Visual effect
    createLaserBeam({
      start: player.position,
      end: player.position.add(direction.multiply(this.range)),
      duration: this.beamDuration,
      color: '#00ffff'
    });

    playSound('laser_fire');
  }
}
```

**See `src/game/WeaponTypes.ts` for all 10 weapon implementations.**

---

## 3. Enemy System

### 3.1 Zombie Base Class

**File**: `src/game/Zombie.ts`

```typescript
abstract class Zombie {
  position: Vector2;
  velocity: Vector2;
  health: number;
  maxHealth: number;
  speed: number;
  damage: number;
  xpValue: number;

  type: ZombieType;
  isDead: boolean;

  abstract update(deltaTime: number, playerPosition: Vector2): void;
  abstract onDeath(): void;

  takeDamage(amount: number) {
    this.health -= amount;

    // Visual feedback
    flash(this, 0.1);  // White flash for 0.1s
    createDamageNumber(this.position, amount);

    if (this.health <= 0) {
      this.die();
    }
  }

  die() {
    this.isDead = true;
    this.onDeath();
    spawnXPOrb(this.position, this.xpValue);
    createDeathEffect(this.position, this.type);
    playSound(`zombie_death_${this.type}`);
  }
}
```

### 3.2 Zombie Types

#### Shambler (Basic)
```typescript
class Shambler extends Zombie {
  constructor(position: Vector2) {
    super({
      type: 'shambler',
      health: 20,
      speed: 80,
      damage: 10,
      xpValue: 10
    });
  }

  update(deltaTime: number, playerPosition: Vector2) {
    // Simple pathfinding - move toward player
    const direction = playerPosition.subtract(this.position).normalize();
    this.velocity = direction.multiply(this.speed);
    this.position.add(this.velocity.multiply(deltaTime));
  }
}
```

#### Runner (Fast)
```typescript
class Runner extends Zombie {
  constructor(position: Vector2) {
    super({
      type: 'runner',
      health: 10,       // Low HP
      speed: 200,       // Fast
      damage: 5,
      xpValue: 15
    });
  }

  update(deltaTime: number, playerPosition: Vector2) {
    const direction = playerPosition.subtract(this.position).normalize();
    this.velocity = direction.multiply(this.speed);
    this.position.add(this.velocity.multiply(deltaTime));
  }
}
```

#### Tank (High HP)
```typescript
class Tank extends Zombie {
  constructor(position: Vector2) {
    super({
      type: 'tank',
      health: 100,      // 5x normal
      speed: 50,        // Slow
      damage: 20,       // High damage
      xpValue: 50
    });
  }
}
```

#### Exploder
```typescript
class Exploder extends Zombie {
  explodeRadius: number = 100;
  explodeDamage: number = 30;
  beepInterval: number = 0.5;
  timeSinceBeep: number = 0;

  update(deltaTime: number, playerPosition: Vector2) {
    // Move toward player faster as it gets closer
    const distanceToPlayer = this.position.distanceTo(playerPosition);
    const speedMultiplier = 1 + (1 - Math.min(distanceToPlayer / 300, 1));

    const direction = playerPosition.subtract(this.position).normalize();
    this.velocity = direction.multiply(this.speed * speedMultiplier);
    this.position.add(this.velocity.multiply(deltaTime));

    // Beep faster as it approaches
    this.timeSinceBeep += deltaTime;
    const beepRate = Math.max(0.1, this.beepInterval * (distanceToPlayer / 300));

    if (this.timeSinceBeep >= beepRate) {
      playSound('exploder_beep');
      flash(this, 0.05);  // Red flash
      this.timeSinceBeep = 0;
    }
  }

  onDeath() {
    // Explode on death
    createExplosion(this.position, this.explodeRadius);
    damageInRadius(this.position, this.explodeRadius, this.explodeDamage, 'player');
    triggerScreenShake(10);
    playSound('explosion');
  }
}
```

**See `src/game/ZombieTypes.ts` for all zombie implementations.**

---

## 4. Spawn System

### 4.1 Wave-Based Spawning

**File**: `src/game/Spawner.ts`

```typescript
class Spawner {
  waveNumber: number = 1;
  spawnRate: number = 1.0;     // Enemies per second
  timeSinceLastSpawn: number = 0;
  gameTime: number = 0;         // Total elapsed time

  update(deltaTime: number) {
    this.gameTime += deltaTime;
    this.waveNumber = Math.floor(this.gameTime / 60) + 1;  // New wave every minute

    // Increase spawn rate over time
    this.spawnRate = 1.0 + (this.waveNumber * 0.1);

    this.timeSinceLastSpawn += deltaTime;

    if (this.timeSinceLastSpawn >= 1 / this.spawnRate) {
      this.spawnEnemy();
      this.timeSinceLastSpawn = 0;
    }
  }

  spawnEnemy() {
    const type = this.chooseZombieType();
    const position = this.chooseSpawnPosition();

    const zombie = createZombie(type, position);
    enemies.push(zombie);
  }

  chooseZombieType(): ZombieType {
    // Probability changes based on wave number
    if (this.waveNumber <= 5) {
      return 'shambler';  // 100% shamblers
    } else if (this.waveNumber <= 10) {
      return random() < 0.7 ? 'shambler' : 'runner';  // 70/30
    } else if (this.waveNumber <= 15) {
      return weighted(['shambler', 'runner', 'tank'], [0.5, 0.3, 0.2]);
    }
    // ... continue for all waves
  }

  chooseSpawnPosition(): Vector2 {
    // Spawn just outside screen bounds
    const side = random(0, 4);  // 0=top, 1=right, 2=bottom, 3=left

    switch(side) {
      case 0: return new Vector2(random(0, worldWidth), -50);
      case 1: return new Vector2(worldWidth + 50, random(0, worldHeight));
      case 2: return new Vector2(random(0, worldWidth), worldHeight + 50);
      case 3: return new Vector2(-50, random(0, worldHeight));
    }
  }
}
```

---

## 5. Progression System

### 5.1 XP & Leveling

**XP Orb System:**
```typescript
class XPOrb {
  position: Vector2;
  value: number;
  magnetRadius: number = 100;  // Player attracts orbs within this range

  update(deltaTime: number, playerPosition: Vector2) {
    const distance = this.position.distanceTo(playerPosition);

    if (distance < this.magnetRadius) {
      // Fly toward player
      const direction = playerPosition.subtract(this.position).normalize();
      const speed = 300;
      this.position.add(direction.multiply(speed * deltaTime));

      // Collect if close enough
      if (distance < 20) {
        player.gainExperience(this.value);
        playSound('xp_pickup');
        this.destroy();
      }
    }
  }
}
```

**Level Up System:**
```typescript
class Player {
  gainExperience(amount: number) {
    this.experience += amount;

    while (this.experience >= this.experienceToNextLevel) {
      this.levelUp();
    }
  }

  levelUp() {
    this.level++;
    this.experience -= this.experienceToNextLevel;
    this.experienceToNextLevel = 1000 * this.level;

    // Trigger level-up UI
    pauseGame();
    showLevelUpScreen();
    playSound('level_up');
    createLevelUpEffect(this.position);
  }
}
```

### 5.2 Level-Up Choices

**UI Flow:**
1. Game pauses
2. Show 3 random choices:
   - New weapon (if not all unlocked)
   - Weapon upgrade (+damage, +fire rate, etc.)
   - Stat upgrade (+max HP, +speed)
3. Player clicks choice
4. Apply upgrade
5. Resume game

**Choice Generation:**
```typescript
generateLevelUpChoices(): LevelUpChoice[] {
  const choices: LevelUpChoice[] = [];

  // Always offer 1 new weapon if available
  const unlockedWeapons = this.getUnlockedWeapons();
  if (unlockedWeapons.length < TOTAL_WEAPONS) {
    const newWeapon = randomFromArray(this.getAvailableWeapons());
    choices.push({
      type: 'weapon',
      weapon: newWeapon,
      description: `Unlock ${newWeapon.name}`
    });
  }

  // Offer 2 upgrades
  for (let i = 0; i < 2; i++) {
    const upgradeType = randomFromArray(['damage', 'fireRate', 'pierce', 'aoe', 'health']);
    choices.push({
      type: 'upgrade',
      upgradeType,
      description: getUpgradeDescription(upgradeType)
    });
  }

  return choices;
}
```

---

## 6. Collision Detection

### 6.1 Collision System

**Broad Phase (Spatial Hashing)**:
```typescript
class SpatialHash {
  cellSize: number = 100;
  grid: Map<string, Entity[]> = new Map();

  insert(entity: Entity) {
    const cells = this.getCells(entity.position, entity.radius);
    for (const cell of cells) {
      if (!this.grid.has(cell)) this.grid.set(cell, []);
      this.grid.get(cell).push(entity);
    }
  }

  queryRadius(position: Vector2, radius: number): Entity[] {
    const cells = this.getCells(position, radius);
    const entities = new Set<Entity>();

    for (const cell of cells) {
      if (this.grid.has(cell)) {
        for (const entity of this.grid.get(cell)) {
          entities.add(entity);
        }
      }
    }

    return Array.from(entities);
  }
}
```

**Narrow Phase (Circle Collision)**:
```typescript
function checkCollision(a: Entity, b: Entity): boolean {
  const distance = a.position.distanceTo(b.position);
  return distance < (a.radius + b.radius);
}
```

### 6.2 Collision Handling

**Per Frame:**
```typescript
updateCollisions() {
  // Player vs Zombies
  for (const zombie of enemies) {
    if (checkCollision(player, zombie)) {
      player.takeDamage(zombie.damage);
    }
  }

  // Projectiles vs Zombies
  for (const projectile of projectiles) {
    const nearbyEnemies = spatialHash.queryRadius(projectile.position, 100);

    for (const enemy of nearbyEnemies) {
      if (checkCollision(projectile, enemy)) {
        enemy.takeDamage(projectile.damage);
        projectile.hitCount++;

        if (projectile.hitCount >= projectile.pierce) {
          projectile.destroy();
          break;
        }
      }
    }
  }
}
```

---

## 7. Win/Lose Conditions

### 7.1 Victory
```typescript
checkVictory() {
  if (this.gameTime >= 1800) {  // 30 minutes
    this.victory = true;
    pauseGame();
    showVictoryScreen();
    playSound('victory');
  }
}
```

### 7.2 Game Over
```typescript
onPlayerDeath() {
  pauseGame();
  showGameOverScreen({
    survivalTime: this.gameTime,
    zombiesKilled: this.killCount,
    levelReached: player.level,
    highScore: this.calculateScore()
  });
  playSound('game_over');
}
```

---

## 8. Persistence

### 8.1 High Score System

```typescript
class ScoreManager {
  saveScore(score: number, stats: GameStats) {
    const highScores = this.loadHighScores();

    highScores.push({
      score,
      date: Date.now(),
      stats
    });

    highScores.sort((a, b) => b.score - a.score);
    highScores.splice(10);  // Keep top 10

    localStorage.setItem('neon-necropolis-scores', JSON.stringify(highScores));
  }

  loadHighScores(): ScoreEntry[] {
    const data = localStorage.getItem('neon-necropolis-scores');
    return data ? JSON.parse(data) : [];
  }
}
```

---

## Implementation Checklist

### Phase 1: Core Mechanics
- [ ] Player movement with WASD/arrows
- [ ] Player health system
- [ ] Basic collision detection
- [ ] Pistol weapon implementation
- [ ] Shambler zombie spawning
- [ ] Game loop running at 60 FPS

### Phase 2: Combat
- [ ] Auto-fire system targeting nearest enemy
- [ ] Projectile system with pooling
- [ ] Damage numbers display
- [ ] XP orb spawning and collection
- [ ] Death effects for zombies

### Phase 3: Progression
- [ ] Level-up system
- [ ] Level-up UI with choices
- [ ] Weapon unlocking
- [ ] Upgrade system

### Phase 4: Enemy Variety
- [ ] All 8 zombie types implemented
- [ ] Wave-based spawning
- [ ] Difficulty scaling
- [ ] Special behaviors (Exploder beeping, etc.)

### Phase 5: Polish
- [ ] Win/lose screens
- [ ] High score persistence
- [ ] Tutorial/instructions
- [ ] Pause menu

---

**This specification provides the technical foundation for all core game systems. Visual effects and audio are covered in separate specs.**
