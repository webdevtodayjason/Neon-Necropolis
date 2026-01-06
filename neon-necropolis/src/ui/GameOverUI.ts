/**
 * Game over and victory screens
 */
export class GameOverUI {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d')!;
    }

    /**
     * Render game over screen
     */
    renderGameOver(stats: {
        level: number;
        zombiesKilled: number;
        damageDealt: number;
        survivalTime: number;
    }): void {
        this.ctx.save();

        // Background
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Title
        this.ctx.shadowColor = '#f00';
        this.ctx.shadowBlur = 30;
        this.ctx.fillStyle = '#f00';
        this.ctx.font = 'bold 72px monospace';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText('GAME OVER', this.canvas.width / 2, this.canvas.height / 2 - 150);

        // Stats
        this.ctx.shadowBlur = 0;
        this.ctx.fillStyle = '#fff';
        this.ctx.font = '24px monospace';

        const centerX = this.canvas.width / 2;
        let y = this.canvas.height / 2 - 50;

        this.ctx.fillText(`Level Reached: ${stats.level}`, centerX, y);
        y += 40;
        this.ctx.fillText(`Zombies Killed: ${stats.zombiesKilled}`, centerX, y);
        y += 40;
        this.ctx.fillText(`Damage Dealt: ${Math.floor(stats.damageDealt)}`, centerX, y);
        y += 40;

        const minutes = Math.floor(stats.survivalTime / 60);
        const seconds = Math.floor(stats.survivalTime % 60);
        this.ctx.fillText(`Survival Time: ${minutes}:${seconds.toString().padStart(2, '0')}`, centerX, y);

        // Instructions
        this.ctx.fillStyle = '#0ff';
        this.ctx.font = '20px monospace';
        this.ctx.fillText('Press SPACE to restart', this.canvas.width / 2, this.canvas.height - 80);

        this.ctx.restore();
    }

    /**
     * Render victory screen
     */
    renderVictory(stats: {
        level: number;
        zombiesKilled: number;
        damageDealt: number;
    }): void {
        this.ctx.save();

        // Background
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Title with pulsing effect
        const pulseScale = 1 + Math.sin(Date.now() / 200) * 0.05;
        this.ctx.shadowColor = '#0ff';
        this.ctx.shadowBlur = 40;
        this.ctx.fillStyle = '#0ff';
        this.ctx.font = `bold ${Math.floor(72 * pulseScale)}px monospace`;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText('VICTORY!', this.canvas.width / 2, this.canvas.height / 2 - 180);

        // Subtitle
        this.ctx.shadowBlur = 10;
        this.ctx.fillStyle = '#fff';
        this.ctx.font = '28px monospace';
        this.ctx.fillText('You survived 30 minutes!', this.canvas.width / 2, this.canvas.height / 2 - 100);

        // Stats
        this.ctx.shadowBlur = 0;
        this.ctx.fillStyle = '#fff';
        this.ctx.font = '24px monospace';

        const centerX = this.canvas.width / 2;
        let y = this.canvas.height / 2 - 20;

        this.ctx.fillText(`Final Level: ${stats.level}`, centerX, y);
        y += 40;
        this.ctx.fillText(`Total Kills: ${stats.zombiesKilled}`, centerX, y);
        y += 40;
        this.ctx.fillText(`Total Damage: ${Math.floor(stats.damageDealt)}`, centerX, y);

        // Congratulations
        this.ctx.fillStyle = '#0f0';
        this.ctx.font = 'bold 32px monospace';
        this.ctx.fillText('NEON NECROPOLIS CLEARED', this.canvas.width / 2, this.canvas.height / 2 + 100);

        // Instructions
        this.ctx.fillStyle = '#0ff';
        this.ctx.font = '20px monospace';
        this.ctx.fillText('Press SPACE to play again', this.canvas.width / 2, this.canvas.height - 80);

        this.ctx.restore();
    }

    /**
     * Draw title screen
     */
    renderTitle(): void {
        this.ctx.save();

        // Background
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.95)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Animated grid background
        this.drawGridBackground();

        // Title
        this.ctx.shadowColor = '#0ff';
        this.ctx.shadowBlur = 40;
        this.ctx.fillStyle = '#0ff';
        this.ctx.font = 'bold 84px monospace';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText('NEON', this.canvas.width / 2, this.canvas.height / 2 - 80);

        this.ctx.shadowColor = '#f0f';
        this.ctx.fillStyle = '#f0f';
        this.ctx.fillText('NECROPOLIS', this.canvas.width / 2, this.canvas.height / 2);

        // Subtitle
        this.ctx.shadowBlur = 10;
        this.ctx.fillStyle = '#fff';
        this.ctx.font = '24px monospace';
        this.ctx.fillText('Survive 30 Minutes in the Cyberpunk Wasteland', this.canvas.width / 2, this.canvas.height / 2 + 80);

        // Instructions
        this.ctx.shadowBlur = 0;
        this.ctx.fillStyle = '#0ff';
        this.ctx.font = '20px monospace';
        let y = this.canvas.height / 2 + 150;
        this.ctx.fillText('WASD or Arrow Keys - Move', this.canvas.width / 2, y);
        y += 35;
        this.ctx.fillText('Weapons Auto-Fire at Nearest Enemy', this.canvas.width / 2, y);
        y += 35;
        this.ctx.fillText('Collect XP to Level Up', this.canvas.width / 2, y);

        // Start prompt (blinking)
        if (Math.floor(Date.now() / 500) % 2 === 0) {
            this.ctx.shadowColor = '#0ff';
            this.ctx.shadowBlur = 20;
            this.ctx.fillStyle = '#0ff';
            this.ctx.font = 'bold 32px monospace';
            this.ctx.fillText('PRESS SPACE TO START', this.canvas.width / 2, this.canvas.height - 100);
        }

        this.ctx.restore();
    }

    /**
     * Draw animated grid background
     */
    private drawGridBackground(): void {
        const time = Date.now() / 1000;
        const gridSize = 50;

        this.ctx.save();
        this.ctx.strokeStyle = 'rgba(0, 255, 255, 0.1)';
        this.ctx.lineWidth = 1;

        // Vertical lines
        for (let x = 0; x < this.canvas.width; x += gridSize) {
            const offset = (time * 50) % gridSize;
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvas.height);
            this.ctx.stroke();
        }

        // Horizontal lines
        for (let y = 0; y < this.canvas.height; y += gridSize) {
            const offset = (time * 50) % gridSize;
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvas.width, y);
            this.ctx.stroke();
        }

        this.ctx.restore();
    }
}
