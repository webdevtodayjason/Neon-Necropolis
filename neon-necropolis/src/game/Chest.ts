/**
 * Chest entity that spawns loot (weapons, health, coins)
 */

export type ChestLoot = {
    type: 'weapon' | 'health' | 'coins';
    value: string | number; // weapon name or amount
};

export class Chest {
    x: number;
    y: number;
    radius: number = 20;
    id: string;
    opened: boolean = false;
    collected: boolean = false;
    loot: ChestLoot;

    // Animation
    private bobOffset: number = 0;
    private glowIntensity: number = 0;

    constructor(x: number, y: number, loot: ChestLoot) {
        this.x = x;
        this.y = y;
        this.loot = loot;
        this.id = `chest_${Math.random().toString(36).substr(2, 9)}`;
    }

    update(deltaTime: number): void {
        // Bobbing animation
        this.bobOffset = Math.sin(Date.now() / 300) * 3;
        this.glowIntensity = 0.5 + Math.sin(Date.now() / 500) * 0.3;
    }

    render(ctx: CanvasRenderingContext2D): void {
        if (this.collected) return;

        ctx.save();

        const drawY = this.y + this.bobOffset;

        // Glow effect
        ctx.shadowColor = this.getLootColor();
        ctx.shadowBlur = 15 * this.glowIntensity;

        // Chest body
        const width = 30;
        const height = 22;

        // Base/bottom
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(this.x - width/2, drawY - height/2 + 5, width, height - 5);

        // Lid
        ctx.fillStyle = this.opened ? '#654321' : '#A0522D';
        if (this.opened) {
            // Lid open (tilted back)
            ctx.save();
            ctx.translate(this.x - width/2, drawY - height/2);
            ctx.rotate(-0.5);
            ctx.fillRect(0, -8, width, 8);
            ctx.restore();
        } else {
            ctx.fillRect(this.x - width/2, drawY - height/2, width, 10);
        }

        // Metal bands
        ctx.fillStyle = '#FFD700';
        ctx.fillRect(this.x - width/2, drawY - height/2 + 10, width, 3);
        ctx.fillRect(this.x - 3, drawY - height/2, 6, height);

        // Lock/clasp
        if (!this.opened) {
            ctx.fillStyle = '#FFD700';
            ctx.beginPath();
            ctx.arc(this.x, drawY - height/2 + 10, 5, 0, Math.PI * 2);
            ctx.fill();
        }

        // Loot indicator (colored particle above chest)
        ctx.shadowBlur = 20;
        ctx.fillStyle = this.getLootColor();
        ctx.globalAlpha = this.glowIntensity;
        ctx.beginPath();
        ctx.arc(this.x, drawY - height/2 - 10 + this.bobOffset, 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }

    private getLootColor(): string {
        switch (this.loot.type) {
            case 'weapon': return '#ff00ff'; // Magenta for weapons
            case 'health': return '#00ff00'; // Green for health
            case 'coins': return '#ffff00'; // Yellow for coins
            default: return '#ffffff';
        }
    }

    open(): ChestLoot {
        this.opened = true;
        return this.loot;
    }

    collect(): void {
        this.collected = true;
    }
}

/**
 * Generate random loot for a chest
 */
export function generateRandomLoot(gameTime: number): ChestLoot {
    const roll = Math.random();

    // Weapon list that gets better over time
    const earlyWeapons = ['Shotgun', 'Laser'];
    const midWeapons = ['Lightning', 'Missiles', 'Ice'];
    const lateWeapons = ['Flamethrower', 'Tesla', 'Poison'];

    let weaponPool = earlyWeapons;
    if (gameTime > 300) { // After 5 minutes
        weaponPool = [...earlyWeapons, ...midWeapons];
    }
    if (gameTime > 600) { // After 10 minutes
        weaponPool = [...earlyWeapons, ...midWeapons, ...lateWeapons];
    }

    if (roll < 0.5) {
        // 50% chance for weapon
        return {
            type: 'weapon',
            value: weaponPool[Math.floor(Math.random() * weaponPool.length)]
        };
    } else if (roll < 0.75) {
        // 25% chance for health
        return {
            type: 'health',
            value: 25 + Math.floor(Math.random() * 25) // 25-50 health
        };
    } else {
        // 25% chance for coins (bonus XP)
        return {
            type: 'coins',
            value: 50 + Math.floor(Math.random() * 100) // 50-150 XP
        };
    }
}
