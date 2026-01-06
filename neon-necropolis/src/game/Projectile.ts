/**
 * Projectile entity with pooling support
 */
export interface ProjectileConfig {
    x: number;
    y: number;
    angle: number;
    speed: number;
    damage: number;
    color: string;
    radius: number;
    lifetime?: number;
    piercing?: number;
    weaponType?: string;
}

export class Projectile {
    x: number;
    y: number;
    vx: number;
    vy: number;
    speed: number;
    damage: number;
    color: string;
    radius: number;
    lifetime: number;
    age: number = 0;
    piercing: number;
    piercedCount: number = 0;
    weaponType: string;

    active: boolean = true;
    id: string;

    constructor(config: ProjectileConfig) {
        this.x = config.x;
        this.y = config.y;
        this.speed = config.speed;
        this.damage = config.damage;
        this.color = config.color;
        this.radius = config.radius;
        this.lifetime = config.lifetime || 3.0;
        this.piercing = config.piercing || 0;
        this.weaponType = config.weaponType || 'default';

        // Calculate velocity from angle
        this.vx = Math.cos(config.angle) * this.speed;
        this.vy = Math.sin(config.angle) * this.speed;

        this.id = `projectile_${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * Update projectile position
     */
    update(deltaTime: number): void {
        this.x += this.vx * deltaTime;
        this.y += this.vy * deltaTime;
        this.age += deltaTime;

        if (this.age >= this.lifetime) {
            this.active = false;
        }
    }

    /**
     * Check if projectile can pierce
     */
    canPierce(): boolean {
        return this.piercedCount < this.piercing;
    }

    /**
     * Register a pierce hit
     */
    pierce(): void {
        this.piercedCount++;
        if (this.piercedCount >= this.piercing) {
            this.active = false;
        }
    }

    /**
     * Deactivate projectile
     */
    deactivate(): void {
        this.active = false;
    }

    /**
     * Reset projectile for pooling
     */
    reset(config: ProjectileConfig): void {
        this.x = config.x;
        this.y = config.y;
        this.speed = config.speed;
        this.damage = config.damage;
        this.color = config.color;
        this.radius = config.radius;
        this.lifetime = config.lifetime || 3.0;
        this.piercing = config.piercing || 0;
        this.weaponType = config.weaponType || 'default';

        this.vx = Math.cos(config.angle) * this.speed;
        this.vy = Math.sin(config.angle) * this.speed;

        this.age = 0;
        this.piercedCount = 0;
        this.active = true;
        this.id = `projectile_${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * Render the projectile
     */
    render(ctx: CanvasRenderingContext2D): void {
        ctx.save();

        // Draw projectile with glow
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 10;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();

        // Draw trail based on velocity
        const angle = Math.atan2(this.vy, this.vx);
        ctx.shadowBlur = 5;
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.radius;
        ctx.globalAlpha = 0.5;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x - Math.cos(angle) * this.radius * 3, this.y - Math.sin(angle) * this.radius * 3);
        ctx.stroke();

        ctx.restore();
    }
}

/**
 * Projectile pool for object reuse
 */
export class ProjectilePool {
    private pool: Projectile[] = [];
    private active: Projectile[] = [];

    /**
     * Get a projectile from pool or create new one
     */
    get(config: ProjectileConfig): Projectile {
        let projectile: Projectile;

        if (this.pool.length > 0) {
            projectile = this.pool.pop()!;
            projectile.reset(config);
        } else {
            projectile = new Projectile(config);
        }

        this.active.push(projectile);
        return projectile;
    }

    /**
     * Update all active projectiles
     */
    update(deltaTime: number): void {
        for (let i = this.active.length - 1; i >= 0; i--) {
            const projectile = this.active[i];
            projectile.update(deltaTime);

            if (!projectile.active) {
                this.active.splice(i, 1);
                this.pool.push(projectile);
            }
        }
    }

    /**
     * Get all active projectiles
     */
    getActive(): Projectile[] {
        return this.active;
    }

    /**
     * Clear all projectiles
     */
    clear(): void {
        this.pool.push(...this.active);
        this.active = [];
    }
}
