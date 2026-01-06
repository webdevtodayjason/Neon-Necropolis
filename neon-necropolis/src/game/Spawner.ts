/**
 * Wave-based enemy spawner
 */
import { Zombie } from './Zombie';
import { getZombieConfig, getRandomZombieType } from './ZombieTypes';

export class Spawner {
    private wave: number = 1;
    private spawnTimer: number = 0;
    private spawnInterval: number = 2.0; // seconds between spawns
    private zombiesPerWave: number = 10;
    private zombiesSpawnedThisWave: number = 0;

    private worldWidth: number;
    private worldHeight: number;
    private spawnDistance: number = 50; // spawn just outside screen

    constructor(worldWidth: number, worldHeight: number) {
        this.worldWidth = worldWidth;
        this.worldHeight = worldHeight;
    }

    /**
     * Update spawner and spawn zombies
     */
    update(deltaTime: number, gameTime: number, zombies: Zombie[]): void {
        // Update wave based on game time
        this.updateWave(gameTime);

        // Update spawn timer
        this.spawnTimer -= deltaTime;

        if (this.spawnTimer <= 0 && this.zombiesSpawnedThisWave < this.zombiesPerWave) {
            this.spawnZombie(zombies);
            this.spawnTimer = this.spawnInterval;
        }

        // Start new wave when all zombies from this wave are spawned and some time has passed
        if (this.zombiesSpawnedThisWave >= this.zombiesPerWave && zombies.length === 0) {
            this.nextWave();
        }
    }

    /**
     * Update wave number based on game time
     */
    private updateWave(gameTime: number): void {
        // Wave increases every 2 minutes (120 seconds)
        const newWave = Math.floor(gameTime / 120) + 1;
        if (newWave > this.wave) {
            this.wave = newWave;
            this.zombiesSpawnedThisWave = 0;
            this.calculateWaveStats();
        }
    }

    /**
     * Calculate wave statistics
     */
    private calculateWaveStats(): void {
        // Increase zombies per wave
        this.zombiesPerWave = 10 + (this.wave - 1) * 5;

        // Decrease spawn interval (faster spawning)
        this.spawnInterval = Math.max(0.5, 2.0 - (this.wave - 1) * 0.1);
    }

    /**
     * Move to next wave
     */
    private nextWave(): void {
        this.wave++;
        this.zombiesSpawnedThisWave = 0;
        this.calculateWaveStats();
    }

    /**
     * Spawn a single zombie
     */
    private spawnZombie(zombies: Zombie[]): void {
        const position = this.getSpawnPosition();
        const type = getRandomZombieType(this.wave);
        const config = getZombieConfig(type);

        // Scale health and damage based on wave
        const scaleFactor = 1 + (this.wave - 1) * 0.15;
        config.health = Math.floor(config.health * scaleFactor);
        config.damage = Math.floor(config.damage * scaleFactor);

        const zombie = new Zombie(position.x, position.y, config);
        zombies.push(zombie);
        this.zombiesSpawnedThisWave++;
    }

    /**
     * Get random spawn position outside screen
     */
    private getSpawnPosition(): { x: number; y: number } {
        const side = Math.floor(Math.random() * 4);
        let x = 0, y = 0;

        switch (side) {
            case 0: // Top
                x = Math.random() * this.worldWidth;
                y = -this.spawnDistance;
                break;
            case 1: // Right
                x = this.worldWidth + this.spawnDistance;
                y = Math.random() * this.worldHeight;
                break;
            case 2: // Bottom
                x = Math.random() * this.worldWidth;
                y = this.worldHeight + this.spawnDistance;
                break;
            case 3: // Left
                x = -this.spawnDistance;
                y = Math.random() * this.worldHeight;
                break;
        }

        return { x, y };
    }

    /**
     * Get current wave number
     */
    getWave(): number {
        return this.wave;
    }

    /**
     * Get zombies spawned this wave
     */
    getZombiesSpawned(): number {
        return this.zombiesSpawnedThisWave;
    }

    /**
     * Get total zombies for this wave
     */
    getTotalZombies(): number {
        return this.zombiesPerWave;
    }

    /**
     * Force spawn wave (for testing)
     */
    forceNextWave(): void {
        this.nextWave();
    }
}
