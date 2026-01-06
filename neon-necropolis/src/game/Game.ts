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

export type GameState = 'title' | 'playing' | 'levelup' | 'gameover' | 'victory';

export class Game {
    state: GameState = 'title';

    // Game entities
    player: Player;
    zombies: Zombie[] = [];
    weapons: Weapon[] = [];
    projectilePool: ProjectilePool;

    // Game systems
    spawner: Spawner;
    physics: Physics;
    synergySystem: SynergySystem;

    // Game time
    gameTime: number = 0;
    readonly GAME_DURATION = 30 * 60; // 30 minutes in seconds

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

        // Update player movement
        this.player.move(input.x, input.y, deltaTime, this.WORLD_WIDTH, this.WORLD_HEIGHT);

        // Update spawner
        this.spawner.update(deltaTime, this.gameTime, this.zombies);

        // Update weapons and fire
        this.updateWeapons(deltaTime);

        // Update projectiles
        this.projectilePool.update(deltaTime);

        // Update zombies
        this.updateZombies(deltaTime);

        // Check collisions
        this.checkCollisions();

        // Check for game over
        if (!this.player.isAlive()) {
            this.state = 'gameover';
        }
    }

    /**
     * Update all weapons
     */
    private updateWeapons(deltaTime: number): void {
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
                }
            }
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

            // Remove dead zombies
            if (zombie.dead) {
                this.zombiesKilled++;
                this.zombies.splice(i, 1);
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
                        const leveledUp = this.player.addXP(zombie.xpValue);
                        if (leveledUp) {
                            this.triggerLevelUp();
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
        this.weapons = [new Weapon(getWeaponStats('PISTOL'))];
        this.projectilePool.clear();
        this.spawner = new Spawner(this.WORLD_WIDTH, this.WORLD_HEIGHT);
        this.gameTime = 0;
        this.zombiesKilled = 0;
        this.damageDealt = 0;
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
