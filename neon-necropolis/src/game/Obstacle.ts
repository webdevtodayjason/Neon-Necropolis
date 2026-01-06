/**
 * Obstacle entities for map obstacles that block movement
 */

export interface ObstacleConfig {
    type: 'rock' | 'barrel' | 'car_wreck' | 'crate' | 'barrier';
    x: number;
    y: number;
    radius?: number;
}

export class Obstacle {
    x: number;
    y: number;
    radius: number;
    type: string;
    id: string;

    // Size multipliers for different obstacle types
    private static readonly SIZES: Record<string, number> = {
        'rock': 40,
        'barrel': 25,
        'car_wreck': 60,
        'crate': 30,
        'barrier': 50,
    };

    constructor(config: ObstacleConfig) {
        this.x = config.x;
        this.y = config.y;
        this.type = config.type;
        this.radius = config.radius || Obstacle.SIZES[config.type] || 30;
        this.id = `obstacle_${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * Render the obstacle
     */
    render(ctx: CanvasRenderingContext2D): void {
        ctx.save();
        // Use simple shape rendering - sprites don't work well for obstacles
        this.renderFallback(ctx);
        ctx.restore();
    }

    /**
     * Fallback rendering when sprites not available
     */
    private renderFallback(ctx: CanvasRenderingContext2D): void {
        const colors: Record<string, { fill: string; stroke: string }> = {
            'rock': { fill: '#555', stroke: '#333' },
            'barrel': { fill: '#8B4513', stroke: '#654321' },
            'car_wreck': { fill: '#4a4a4a', stroke: '#2a2a2a' },
            'crate': { fill: '#8B7355', stroke: '#5C4033' },
            'barrier': { fill: '#666', stroke: '#444' },
        };

        const color = colors[this.type] || colors['rock'];

        // Draw shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.beginPath();
        ctx.ellipse(this.x + 5, this.y + 5, this.radius, this.radius * 0.6, 0, 0, Math.PI * 2);
        ctx.fill();

        // Draw obstacle
        ctx.fillStyle = color.fill;
        ctx.strokeStyle = color.stroke;
        ctx.lineWidth = 3;

        if (this.type === 'barrel') {
            // Draw barrel as circle
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            // Barrel rings
            ctx.strokeStyle = '#333';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius * 0.7, 0, Math.PI * 2);
            ctx.stroke();
        } else if (this.type === 'crate' || this.type === 'barrier') {
            // Draw as rectangle
            const w = this.radius * 2;
            const h = this.type === 'barrier' ? this.radius * 0.8 : this.radius * 2;
            ctx.fillRect(this.x - w / 2, this.y - h / 2, w, h);
            ctx.strokeRect(this.x - w / 2, this.y - h / 2, w, h);
        } else {
            // Draw as irregular polygon (rock/car wreck)
            ctx.beginPath();
            const points = this.type === 'rock' ? 7 : 5;
            for (let i = 0; i < points; i++) {
                const angle = (i / points) * Math.PI * 2;
                const r = this.radius * (0.8 + Math.random() * 0.4);
                const px = this.x + Math.cos(angle) * r;
                const py = this.y + Math.sin(angle) * r;
                if (i === 0) ctx.moveTo(px, py);
                else ctx.lineTo(px, py);
            }
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
        }
    }
}

/**
 * Generate obstacles for a map
 */
export function generateObstacles(
    worldWidth: number,
    worldHeight: number,
    count: number = 30,
    playerX: number,
    playerY: number,
    clearRadius: number = 200
): Obstacle[] {
    const obstacles: Obstacle[] = [];
    const obstacleTypes: Array<'rock' | 'barrel' | 'car_wreck' | 'crate' | 'barrier'> = [
        'rock', 'rock', 'rock', // More rocks
        'barrel', 'barrel',
        'car_wreck',
        'crate', 'crate',
        'barrier',
    ];

    const margin = 100; // Keep obstacles away from edges

    for (let i = 0; i < count; i++) {
        let x: number, y: number;
        let validPosition = false;
        let attempts = 0;

        // Try to find valid position
        while (!validPosition && attempts < 50) {
            x = margin + Math.random() * (worldWidth - margin * 2);
            y = margin + Math.random() * (worldHeight - margin * 2);

            // Check distance from player spawn
            const distToPlayer = Math.sqrt((x - playerX) ** 2 + (y - playerY) ** 2);
            if (distToPlayer < clearRadius) {
                attempts++;
                continue;
            }

            // Check distance from other obstacles
            let tooClose = false;
            for (const obs of obstacles) {
                const dist = Math.sqrt((x - obs.x) ** 2 + (y - obs.y) ** 2);
                if (dist < obs.radius + 60) {
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
            const type = obstacleTypes[Math.floor(Math.random() * obstacleTypes.length)];
            obstacles.push(new Obstacle({ type, x: x!, y: y! }));
        }
    }

    return obstacles;
}
