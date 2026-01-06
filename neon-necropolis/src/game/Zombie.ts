/**
 * Base zombie entity class
 */
export interface ZombieConfig {
    type: string;
    health: number;
    speed: number;
    damage: number;
    xpValue: number;
    color: string;
    radius: number;
    attackCooldown?: number;
    specialAbility?: string;
}

export class Zombie {
    x: number;
    y: number;
    health: number;
    maxHealth: number;
    speed: number;
    damage: number;
    xpValue: number;
    color: string;
    radius: number;
    type: string;
    id: string;

    attackCooldown: number;
    attackTimer: number = 0;
    specialAbility?: string;

    dead: boolean = false;

    constructor(x: number, y: number, config: ZombieConfig) {
        this.x = x;
        this.y = y;
        this.health = config.health;
        this.maxHealth = config.health;
        this.speed = config.speed;
        this.damage = config.damage;
        this.xpValue = config.xpValue;
        this.color = config.color;
        this.radius = config.radius;
        this.type = config.type;
        this.attackCooldown = config.attackCooldown || 1.0;
        this.specialAbility = config.specialAbility;
        this.id = `zombie_${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * Move towards target
     */
    moveTowards(targetX: number, targetY: number, deltaTime: number): void {
        const dx = targetX - this.x;
        const dy = targetY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 0) {
            this.x += (dx / distance) * this.speed * deltaTime;
            this.y += (dy / distance) * this.speed * deltaTime;
        }
    }

    /**
     * Take damage
     */
    takeDamage(amount: number): void {
        this.health -= amount;
        if (this.health <= 0) {
            this.health = 0;
            this.dead = true;
        }
    }

    /**
     * Update attack timer
     */
    updateAttackTimer(deltaTime: number): void {
        if (this.attackTimer > 0) {
            this.attackTimer -= deltaTime;
        }
    }

    /**
     * Check if zombie can attack
     */
    canAttack(): boolean {
        return this.attackTimer <= 0;
    }

    /**
     * Perform attack
     */
    attack(): void {
        this.attackTimer = this.attackCooldown;
    }

    /**
     * Render the zombie
     */
    render(ctx: CanvasRenderingContext2D): void {
        ctx.save();

        // Draw zombie body with glow
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 10;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();

        // Draw health bar
        const barWidth = this.radius * 2;
        const barHeight = 4;
        const barY = this.y - this.radius - 10;

        ctx.shadowBlur = 0;
        ctx.fillStyle = '#333';
        ctx.fillRect(this.x - barWidth / 2, barY, barWidth, barHeight);

        const healthPercent = this.health / this.maxHealth;
        ctx.fillStyle = healthPercent > 0.5 ? '#0f0' : healthPercent > 0.25 ? '#ff0' : '#f00';
        ctx.fillRect(this.x - barWidth / 2, barY, barWidth * healthPercent, barHeight);

        ctx.restore();
    }
}
