/**
 * Base weapon class with auto-fire
 */
import { Projectile, ProjectileConfig, ProjectilePool } from './Projectile';

export interface WeaponStats {
    name: string;
    damage: number;
    fireRate: number; // shots per second
    projectileSpeed: number;
    projectileCount: number;
    piercing: number;
    spread: number; // angle spread in radians
    color: string;
    projectileRadius: number;
    range?: number;
    special?: string;
}

export class Weapon {
    name: string;
    damage: number;
    fireRate: number;
    projectileSpeed: number;
    projectileCount: number;
    piercing: number;
    spread: number;
    color: string;
    projectileRadius: number;
    range: number;
    special?: string;

    level: number = 1;
    cooldown: number = 0;

    constructor(stats: WeaponStats) {
        this.name = stats.name;
        this.damage = stats.damage;
        this.fireRate = stats.fireRate;
        this.projectileSpeed = stats.projectileSpeed;
        this.projectileCount = stats.projectileCount;
        this.piercing = stats.piercing;
        this.spread = stats.spread;
        this.color = stats.color;
        this.projectileRadius = stats.projectileRadius;
        this.range = stats.range || 1000;
        this.special = stats.special;
    }

    /**
     * Update weapon cooldown
     */
    update(deltaTime: number): void {
        if (this.cooldown > 0) {
            this.cooldown -= deltaTime;
        }
    }

    /**
     * Check if weapon can fire
     */
    canFire(): boolean {
        return this.cooldown <= 0;
    }

    /**
     * Fire the weapon
     */
    fire(
        x: number,
        y: number,
        targetX: number,
        targetY: number,
        projectilePool: ProjectilePool
    ): Projectile[] {
        if (!this.canFire()) return [];

        const projectiles: Projectile[] = [];
        const baseAngle = Math.atan2(targetY - y, targetX - x);

        for (let i = 0; i < this.projectileCount; i++) {
            let angle = baseAngle;

            // Apply spread
            if (this.projectileCount > 1) {
                const spreadOffset = ((i / (this.projectileCount - 1)) - 0.5) * this.spread;
                angle += spreadOffset;
            } else if (this.spread > 0) {
                angle += (Math.random() - 0.5) * this.spread;
            }

            const config: ProjectileConfig = {
                x,
                y,
                angle,
                speed: this.projectileSpeed,
                damage: this.damage,
                color: this.color,
                radius: this.projectileRadius,
                lifetime: this.range / this.projectileSpeed,
                piercing: this.piercing,
                weaponType: this.name
            };

            projectiles.push(projectilePool.get(config));
        }

        this.cooldown = 1 / this.fireRate;
        return projectiles;
    }

    /**
     * Upgrade weapon
     */
    upgrade(type: 'damage' | 'fireRate' | 'projectiles'): void {
        this.level++;

        switch (type) {
            case 'damage':
                this.damage *= 1.2;
                break;
            case 'fireRate':
                this.fireRate *= 1.15;
                break;
            case 'projectiles':
                this.projectileCount += 1;
                break;
        }
    }

    /**
     * Get weapon info string
     */
    getInfo(): string {
        return `${this.name} Lv.${this.level} | DMG: ${this.damage.toFixed(0)} | Rate: ${this.fireRate.toFixed(1)}/s | Count: ${this.projectileCount}`;
    }
}
