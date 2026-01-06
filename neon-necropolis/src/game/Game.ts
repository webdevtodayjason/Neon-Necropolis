/**
 * Main game state manager
 */
import { Player } from './Player';
import { Zombie } from './Zombie';
import { Weapon } from './Weapon';
import { getWeaponStats } from './WeaponTypes';
import { Spawner } from './Spawner';
import { ProjectilePool } from './Projectile';
import { Physics } from '../engine/Physics';
import { SynergySystem } from './Synergy';
import { getAssetManager } from '../assets/AssetManager';
import { Obstacle, generateObstacles } from './Obstacle';
import { getProceduralSFX } from '../audio/ProceduralSFX';
import { Chest, generateRandomLoot } from './Chest';

export type GameState = 'title' | 'playing' | 'levelup' | 'gameover' | 'victory';

export class Game {
    state: GameState = 'title';

    // Game entities
    player: Player;
    zombies: Zombie[] = [];
    weapons: Weapon[] = [];
    projectilePool: ProjectilePool;
    obstacles: Obstacle[] = [];
    chests: Chest[] = [];

    // Game systems
    spawner: Spawner;
    physics: Physics;
    synergySystem: SynergySystem;

    // Game time
    gameTime: number = 0;
    readonly GAME_DURATION = 30 * 60; // 30 minutes in seconds

    // Chest spawning
    private chestSpawnTimer: number = 0;
    private readonly CHEST_SPAWN_INTERVAL = 15; // Spawn chest every 15 seconds

    // Lives system
    lives: number = 3;
    readonly MAX_LIVES = 3;
    private respawnTimer: number = 0;
    private isRespawning: boolean = false;

    // World dimensions
    readonly WORLD_WIDTH: number;
    readonly WORLD_HEIGHT: number;

    // Level up options
    levelUpOptions: string[] = [];

    // Stats
    zombiesKilled: number = 0;
    damageDealt: number = 0;

    constructor(worldWidth: number, worldHeight: number) {
        this.WORLD_WIDTH = worldWidth;
        this.WORLD_HEIGHT = worldHeight;

        // Initialize player at center
        this.player = new Player(worldWidth / 2, worldHeight / 2);

        // Initialize systems
        this.projectilePool = new ProjectilePool();
        this.spawner = new Spawner(worldWidth, worldHeight);
        this.physics = new Physics(100);
        this.synergySystem = new SynergySystem();

        // Generate map obstacles
        this.obstacles = generateObstacles(
            worldWidth,
            worldHeight,
            12, // Number of obstacles - keep it sparse
            worldWidth / 2, // Player spawn X
            worldHeight / 2, // Player spawn Y
            200 // Clear radius around player spawn
        );

        // Give player starting weapon
        const pistol = new Weapon(getWeaponStats('PISTOL'));
        this.weapons.push(pistol);
    }

    /**
     * Start the game
     */
    start(): void {
        this.state = 'playing';
        this.gameTime = 0;
        this.zombiesKilled = 0;
        this.damageDealt = 0;
    }

    /**
     * Update game state
     */
    update(deltaTime: number, input: { x: number; y: number }): void {
        if (this.state === 'playing') {
            this.updatePlaying(deltaTime, input);
        }
    }

    /**
     * Update game during playing state
     */
    private updatePlaying(deltaTime: number, input: { x: number; y: number }): void {
        // Update game time
        this.gameTime += deltaTime;

        // Check for victory
        if (this.gameTime >= this.GAME_DURATION) {
            this.state = 'victory';
            return;
        }

        // Handle respawning
        if (this.isRespawning) {
            this.respawnTimer -= deltaTime;
            if (this.respawnTimer <= 0) {
                this.completeRespawn();
            }
            return; // Don't update game while respawning
        }

        // Update player movement with obstacle collision
        this.player.move(input.x, input.y, deltaTime, this.WORLD_WIDTH, this.WORLD_HEIGHT);
        this.handlePlayerObstacleCollisions();

        // Update spawner
        this.spawner.update(deltaTime, this.gameTime, this.zombies);

        // Update weapons and fire
        this.updateWeapons(deltaTime);

        // Update projectiles
        this.projectilePool.update(deltaTime);

        // Update zombies
        this.updateZombies(deltaTime);

        // Update chests
        this.updateChests(deltaTime);

        // Check collisions
        this.checkCollisions();

        // Check for player death
        if (!this.player.isAlive()) {
            this.handlePlayerDeath();
        }
    }

    /**
     * Update chest spawning and collection
     */
    private updateChests(deltaTime: number): void {
        const sfx = getProceduralSFX();

        // Spawn new chests periodically
        this.chestSpawnTimer += deltaTime;
        if (this.chestSpawnTimer >= this.CHEST_SPAWN_INTERVAL) {
            this.chestSpawnTimer = 0;
            this.spawnChest();
        }

        // Update existing chests
        for (const chest of this.chests) {
            chest.update(deltaTime);
        }

        // Check for chest collection
        for (let i = this.chests.length - 1; i >= 0; i--) {
            const chest = this.chests[i];
            if (chest.collected) continue;

            const dx = this.player.x - chest.x;
            const dy = this.player.y - chest.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < this.player.radius + chest.radius) {
                this.collectChest(chest);
                sfx.playXPPickup(0.4);
            }
        }

        // Remove collected chests
        this.chests = this.chests.filter(c => !c.collected);
    }

    /**
     * Spawn a new chest at random location
     */
    private spawnChest(): void {
        const margin = 80;
        let x: number, y: number;
        let validPosition = false;
        let attempts = 0;

        while (!validPosition && attempts < 30) {
            x = margin + Math.random() * (this.WORLD_WIDTH - margin * 2);
            y = margin + Math.random() * (this.WORLD_HEIGHT - margin * 2);

            // Check distance from player (not too close, not too far)
            const distToPlayer = Math.sqrt((x - this.player.x) ** 2 + (y - this.player.y) ** 2);
            if (distToPlayer < 150 || distToPlayer > 500) {
                attempts++;
                continue;
            }

            // Check distance from obstacles
            let tooClose = false;
            for (const obs of this.obstacles) {
                const dist = Math.sqrt((x - obs.x) ** 2 + (y - obs.y) ** 2);
                if (dist < obs.radius + 40) {
                    tooClose = true;
                    break;
                }
            }

            if (!tooClose) {
                validPosition = true;
            }
            attempts++;
        }

        if (validPosition) {
            const loot = generateRandomLoot(this.gameTime);
            this.chests.push(new Chest(x!, y!, loot));
        }
    }

    /**
     * Collect a chest and apply its loot
     */
    private collectChest(chest: Chest): void {
        const loot = chest.open();
        chest.collect();

        switch (loot.type) {
            case 'weapon':
                this.addWeaponFromChest(loot.value as string);
                break;
            case 'health':
                this.player.heal(loot.value as number);
                break;
            case 'coins':
                this.player.addXP(loot.value as number);
                if (this.player.level > this.player.level - 1) {
                    // Check if leveled up from XP
                }
                break;
        }
    }

    /**
     * Add or upgrade weapon from chest
     */
    private addWeaponFromChest(weaponName: string): void {
        const existingWeapon = this.weapons.find(w => w.name === weaponName);

        if (existingWeapon) {
            // Upgrade existing weapon with random upgrade type
            const upgradeTypes: Array<'damage' | 'fireRate' | 'projectiles'> = ['damage', 'fireRate', 'projectiles'];
            const randomUpgrade = upgradeTypes[Math.floor(Math.random() * upgradeTypes.length)];
            existingWeapon.upgrade(randomUpgrade);
        } else {
            // Add new weapon
            const weaponKey = weaponName.toUpperCase().replace(' ', '_');
            const stats = getWeaponStats(weaponKey);
            if (stats) {
                this.weapons.push(new Weapon(stats));
            }
        }
    }

    /**
     * Handle player death - respawn or game over
     */
    private handlePlayerDeath(): void {
        this.lives--;

        if (this.lives <= 0) {
            this.state = 'gameover';
        } else {
            // Start respawn
            this.isRespawning = true;
            this.respawnTimer = 2; // 2 second respawn time
            // Clear nearby zombies
            this.zombies = this.zombies.filter(z => {
                const dist = Math.sqrt((z.x - this.player.x) ** 2 + (z.y - this.player.y) ** 2);
                return dist > 200;
            });
        }
    }

    /**
     * Complete player respawn
     */
    private completeRespawn(): void {
        this.isRespawning = false;
        this.player.respawn(this.WORLD_WIDTH / 2, this.WORLD_HEIGHT / 2);
    }

    /**
     * Update all weapons
     */
    private updateWeapons(deltaTime: number): void {
        const sfx = getProceduralSFX();

        for (const weapon of this.weapons) {
            weapon.update(deltaTime);

            // Auto-fire at nearest zombie
            if (weapon.canFire() && this.zombies.length > 0) {
                const nearestZombie = this.findNearestZombie();
                if (nearestZombie) {
                    weapon.fire(
                        this.player.x,
                        this.player.y,
                        nearestZombie.x,
                        nearestZombie.y,
                        this.projectilePool
                    );

                    // Play weapon sound effect using procedural audio
                    this.playWeaponSound(weapon.name);
                }
            }
        }
    }

    /**
     * Play procedural weapon sound based on weapon type
     */
    private playWeaponSound(weaponName: string): void {
        const sfx = getProceduralSFX();
        switch (weaponName) {
            case 'Pistol':
                sfx.playPistol(0.25);
                break;
            case 'Shotgun':
                sfx.playShotgun(0.3);
                break;
            case 'Laser':
                sfx.playLaser(0.25);
                break;
            case 'Lightning':
            case 'Tesla':
                sfx.playLightning(0.3);
                break;
            case 'Missiles':
                sfx.playMissile(0.25);
                break;
            case 'Flamethrower':
                sfx.playFlamethrower(0.2);
                break;
            case 'Ice':
                sfx.playIce(0.25);
                break;
            case 'Poison':
                sfx.playPoison(0.2);
                break;
            default:
                sfx.playPistol(0.2);
        }
    }

    /**
     * Find nearest zombie to player
     */
    private findNearestZombie(): Zombie | null {
        if (this.zombies.length === 0) return null;

        let nearest = this.zombies[0];
        let minDist = Physics.distance(this.player.x, this.player.y, nearest.x, nearest.y);

        for (let i = 1; i < this.zombies.length; i++) {
            const dist = Physics.distance(this.player.x, this.player.y, this.zombies[i].x, this.zombies[i].y);
            if (dist < minDist) {
                minDist = dist;
                nearest = this.zombies[i];
            }
        }

        return nearest;
    }

    /**
     * Update all zombies
     */
    private updateZombies(deltaTime: number): void {
        for (let i = this.zombies.length - 1; i >= 0; i--) {
            const zombie = this.zombies[i];

            // Move towards player
            zombie.moveTowards(this.player.x, this.player.y, deltaTime);
            zombie.updateAttackTimer(deltaTime);

            // Handle zombie-obstacle collisions
            this.handleZombieObstacleCollisions(zombie);

            // Remove dead zombies
            if (zombie.dead) {
                this.zombiesKilled++;
                this.zombies.splice(i, 1);
            }
        }
    }

    /**
     * Handle player collision with obstacles
     */
    private handlePlayerObstacleCollisions(): void {
        for (const obstacle of this.obstacles) {
            const dx = this.player.x - obstacle.x;
            const dy = this.player.y - obstacle.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const minDist = this.player.radius + obstacle.radius;

            if (dist < minDist && dist > 0) {
                // Push player out of obstacle
                const overlap = minDist - dist;
                const nx = dx / dist;
                const ny = dy / dist;
                this.player.x += nx * overlap;
                this.player.y += ny * overlap;
            }
        }
    }

    /**
     * Handle zombie collision with obstacles
     */
    private handleZombieObstacleCollisions(zombie: Zombie): void {
        for (const obstacle of this.obstacles) {
            const dx = zombie.x - obstacle.x;
            const dy = zombie.y - obstacle.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const minDist = zombie.radius + obstacle.radius;

            if (dist < minDist && dist > 0) {
                // Push zombie out of obstacle
                const overlap = minDist - dist;
                const nx = dx / dist;
                const ny = dy / dist;
                zombie.x += nx * overlap;
                zombie.y += ny * overlap;
            }
        }
    }

    /**
     * Check all collisions
     */
    private checkCollisions(): void {
        // Build spatial hash
        this.physics.clear();

        // Insert all entities
        this.physics.insert(this.player);
        for (const zombie of this.zombies) {
            this.physics.insert(zombie);
        }
        for (const projectile of this.projectilePool.getActive()) {
            this.physics.insert(projectile);
        }

        const sfx = getProceduralSFX();

        // Check projectile-zombie collisions
        for (const projectile of this.projectilePool.getActive()) {
            const candidates = this.physics.query(projectile);
            const collisions = this.physics.getCollisions(projectile, candidates);

            for (const entity of collisions) {
                const zombie = this.zombies.find(z => z.id === entity.id);
                if (zombie) {
                    // Apply damage
                    zombie.takeDamage(projectile.damage);
                    this.damageDealt += projectile.damage;

                    // Add XP if zombie died
                    if (zombie.dead) {
                        // Play death sound using procedural audio
                        sfx.playZombieDeath(0.35);
                        sfx.playXPPickup(0.25);

                        const leveledUp = this.player.addXP(zombie.xpValue);
                        if (leveledUp) {
                            this.triggerLevelUp();
                            sfx.playLevelUp(0.5);
                        }
                    }

                    // Handle piercing
                    if (projectile.canPierce()) {
                        projectile.pierce();
                    } else {
                        projectile.deactivate();
                        break;
                    }
                }
            }
        }

        // Check player-zombie collisions
        const playerCandidates = this.physics.query(this.player);
        const playerCollisions = this.physics.getCollisions(this.player, playerCandidates);

        for (const entity of playerCollisions) {
            const zombie = this.zombies.find(z => z.id === entity.id);
            if (zombie && zombie.canAttack()) {
                this.player.takeDamage(zombie.damage);
                zombie.attack();
                // Play player hurt sound using procedural audio
                sfx.playPlayerHurt(0.4);
            }
        }
    }

    /**
     * Trigger level up screen
     */
    private triggerLevelUp(): void {
        this.state = 'levelup';
        this.generateLevelUpOptions();
    }

    /**
     * Generate level up weapon options
     */
    private generateLevelUpOptions(): void {
        this.levelUpOptions = [];
        const currentWeaponNames = this.weapons.map(w => w.name);

        // Available weapon types
        const allWeapons = ['PISTOL', 'SHOTGUN', 'LASER', 'ORBITAL', 'LIGHTNING',
                           'MISSILES', 'FLAMETHROWER', 'TESLA', 'ICE', 'POISON'];

        // Available weapons (not owned yet)
        const available = allWeapons.filter(w => !currentWeaponNames.includes(getWeaponStats(w).name));

        // Pick 3 random options
        if (available.length > 0) {
            // Shuffle and take up to 3
            const shuffled = available.sort(() => Math.random() - 0.5);
            this.levelUpOptions = shuffled.slice(0, Math.min(3, shuffled.length));
        }

        // If we have fewer than 3 options, add upgrade options for existing weapons
        while (this.levelUpOptions.length < 3 && currentWeaponNames.length > 0) {
            const randomWeapon = currentWeaponNames[Math.floor(Math.random() * currentWeaponNames.length)];
            this.levelUpOptions.push(`UPGRADE_${randomWeapon}`);
        }
    }

    /**
     * Select a level up option
     */
    selectLevelUpOption(index: number): void {
        if (index < 0 || index >= this.levelUpOptions.length) return;

        const option = this.levelUpOptions[index];

        if (option.startsWith('UPGRADE_')) {
            // Upgrade existing weapon
            const weaponName = option.replace('UPGRADE_', '');
            const weapon = this.weapons.find(w => w.name === weaponName);
            if (weapon) {
                weapon.upgrade('damage');
            }
        } else {
            // Add new weapon
            const newWeapon = new Weapon(getWeaponStats(option));
            this.weapons.push(newWeapon);
        }

        // Update synergies
        this.synergySystem.update(this.weapons);

        // Resume game
        this.state = 'playing';
    }

    /**
     * Reset game
     */
    reset(): void {
        this.player = new Player(this.WORLD_WIDTH / 2, this.WORLD_HEIGHT / 2);
        this.zombies = [];
        this.chests = [];
        this.weapons = [new Weapon(getWeaponStats('PISTOL'))];
        this.projectilePool.clear();
        this.spawner = new Spawner(this.WORLD_WIDTH, this.WORLD_HEIGHT);
        this.obstacles = generateObstacles(
            this.WORLD_WIDTH,
            this.WORLD_HEIGHT,
            12,
            this.WORLD_WIDTH / 2,
            this.WORLD_HEIGHT / 2,
            200
        );
        this.gameTime = 0;
        this.zombiesKilled = 0;
        this.damageDealt = 0;
        this.lives = this.MAX_LIVES;
        this.chestSpawnTimer = 0;
        this.isRespawning = false;
        this.state = 'title';
    }

    /**
     * Get current wave number
     */
    getWave(): number {
        return this.spawner.getWave();
    }

    /**
     * Get remaining time
     */
    getRemainingTime(): number {
        return Math.max(0, this.GAME_DURATION - this.gameTime);
    }
}
