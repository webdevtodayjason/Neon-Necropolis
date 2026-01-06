/**
 * Player entity with movement, health, and XP system
 */
import { getAssetManager } from '../assets/AssetManager';

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

    // Animation state
    private animFrame: number = 0;
    private animTimer: number = 0;
    private isMoving: boolean = false;
    private facingAngle: number = 0;

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

        // Track movement state and facing direction
        this.isMoving = dx !== 0 || dy !== 0;
        if (this.isMoving) {
            this.facingAngle = Math.atan2(dy, dx);
            // Update animation
            this.animTimer += deltaTime;
            if (this.animTimer > 0.15) {
                this.animFrame = (this.animFrame + 1) % 2;
                this.animTimer = 0;
            }
        }

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
     * Respawn the player at given position
     */
    respawn(x: number, y: number): void {
        this.x = x;
        this.y = y;
        this.health = this.maxHealth;
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
        const assetManager = getAssetManager();
        ctx.save();

        // Determine sprite to use
        let spriteKey = 'player_idle';
        if (this.isMoving) {
            spriteKey = this.animFrame === 0 ? 'player_walk_1' : 'player_walk_2';
        }

        // Get sprite
        const sprite = assetManager.getSprite(spriteKey);
        const spriteSize = this.radius * 2.5;

        if (sprite?.loaded) {
            // Create circular clipping path to hide square background
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius * 1.3, 0, Math.PI * 2);
            ctx.clip();

            // Draw sprite within clip
            ctx.translate(this.x, this.y);
            if (this.facingAngle) {
                ctx.rotate(this.facingAngle);
            }
            const scale = spriteSize / sprite.width;
            const w = sprite.width * scale;
            const h = sprite.height * scale;
            ctx.drawImage(sprite.image, -w / 2, -h / 2, w, h);
        } else {
            // Fallback to basic rendering if sprite not loaded
            // Outer glow
            ctx.shadowColor = '#f80';
            ctx.shadowBlur = 20;
            ctx.fillStyle = '#f80';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fill();

            // Inner circle
            ctx.shadowBlur = 0;
            ctx.fillStyle = '#a50';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius * 0.6, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.restore();

        // Health indicator ring (low health = red glow) - outside clip
        if (this.health < 30) {
            ctx.save();
            ctx.strokeStyle = `rgba(255, 0, 0, ${0.5 + Math.sin(Date.now() / 100) * 0.3})`;
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius + 5, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();
        }
    }
}
