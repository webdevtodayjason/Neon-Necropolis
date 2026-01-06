/**
 * Player entity with movement, health, and XP system
 */
export class Player {
    x: number;
    y: number;
    radius: number = 20;
    speed: number = 200; // pixels per second

    maxHealth: number = 100;
    health: number = 100;

    xp: number = 0;
    level: number = 1;
    xpToNextLevel: number = 1000;

    id: string = 'player';

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    /**
     * Move the player based on input
     */
    move(dx: number, dy: number, deltaTime: number, worldWidth: number, worldHeight: number): void {
        this.x += dx * this.speed * deltaTime;
        this.y += dy * this.speed * deltaTime;

        // Keep player in bounds
        this.x = Math.max(this.radius, Math.min(worldWidth - this.radius, this.x));
        this.y = Math.max(this.radius, Math.min(worldHeight - this.radius, this.y));
    }

    /**
     * Add XP and check for level up
     */
    addXP(amount: number): boolean {
        this.xp += amount;
        if (this.xp >= this.xpToNextLevel) {
            this.levelUp();
            return true;
        }
        return false;
    }

    /**
     * Level up the player
     */
    private levelUp(): void {
        this.level++;
        this.xp -= this.xpToNextLevel;
        // Each level requires 1000 XP
        this.xpToNextLevel = 1000;
    }

    /**
     * Take damage
     */
    takeDamage(amount: number): void {
        this.health = Math.max(0, this.health - amount);
    }

    /**
     * Heal the player
     */
    heal(amount: number): void {
        this.health = Math.min(this.maxHealth, this.health + amount);
    }

    /**
     * Check if player is alive
     */
    isAlive(): boolean {
        return this.health > 0;
    }

    /**
     * Get XP progress as percentage
     */
    getXPProgress(): number {
        return this.xp / this.xpToNextLevel;
    }

    /**
     * Render the player
     */
    render(ctx: CanvasRenderingContext2D): void {
        // Draw player body (cyan circle with glow)
        ctx.save();

        // Outer glow
        ctx.shadowColor = '#0ff';
        ctx.shadowBlur = 20;
        ctx.fillStyle = '#0ff';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();

        // Inner circle
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#0aa';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius * 0.6, 0, Math.PI * 2);
        ctx.fill();

        // Direction indicator
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x + this.radius * 0.8, this.y);
        ctx.stroke();

        ctx.restore();
    }
}
