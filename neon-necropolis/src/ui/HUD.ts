/**
 * Heads-Up Display for game stats
 */
import { Player } from '../game/Player';

export class HUD {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d')!;
    }

    /**
     * Render the HUD
     */
    render(player: Player, gameTime: number, wave: number, zombieCount: number): void {
        this.ctx.save();

        // Draw health bar
        this.drawHealthBar(player);

        // Draw XP bar
        this.drawXPBar(player);

        // Draw level
        this.drawLevel(player);

        // Draw timer
        this.drawTimer(gameTime);

        // Draw wave info
        this.drawWaveInfo(wave, zombieCount);

        // Draw stats
        this.drawStats(player, zombieCount);

        this.ctx.restore();
    }

    /**
     * Draw health bar
     */
    private drawHealthBar(player: Player): void {
        const x = 20;
        const y = 20;
        const width = 300;
        const height = 30;

        // Background
        this.ctx.fillStyle = '#333';
        this.ctx.fillRect(x, y, width, height);

        // Health fill
        const healthPercent = player.health / player.maxHealth;
        const fillWidth = width * healthPercent;

        const gradient = this.ctx.createLinearGradient(x, y, x + width, y);
        if (healthPercent > 0.5) {
            gradient.addColorStop(0, '#0f0');
            gradient.addColorStop(1, '#0a0');
        } else if (healthPercent > 0.25) {
            gradient.addColorStop(0, '#ff0');
            gradient.addColorStop(1, '#aa0');
        } else {
            gradient.addColorStop(0, '#f00');
            gradient.addColorStop(1, '#a00');
        }

        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(x, y, fillWidth, height);

        // Border
        this.ctx.strokeStyle = '#0ff';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(x, y, width, height);

        // Text
        this.ctx.fillStyle = '#fff';
        this.ctx.font = 'bold 16px monospace';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(`HP: ${Math.ceil(player.health)} / ${player.maxHealth}`, x + width / 2, y + height / 2);
    }

    /**
     * Draw XP bar
     */
    private drawXPBar(player: Player): void {
        const x = 20;
        const y = 60;
        const width = 300;
        const height = 20;

        // Background
        this.ctx.fillStyle = '#333';
        this.ctx.fillRect(x, y, width, height);

        // XP fill
        const xpPercent = player.getXPProgress();
        const fillWidth = width * xpPercent;

        const gradient = this.ctx.createLinearGradient(x, y, x + width, y);
        gradient.addColorStop(0, '#0ff');
        gradient.addColorStop(1, '#08f');

        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(x, y, fillWidth, height);

        // Border
        this.ctx.strokeStyle = '#0ff';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(x, y, width, height);

        // Text
        this.ctx.fillStyle = '#fff';
        this.ctx.font = '12px monospace';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(`XP: ${Math.floor(player.xp)} / ${player.xpToNextLevel}`, x + width / 2, y + height / 2);
    }

    /**
     * Draw level display
     */
    private drawLevel(player: Player): void {
        const x = 20;
        const y = 90;

        this.ctx.fillStyle = '#0ff';
        this.ctx.font = 'bold 20px monospace';
        this.ctx.textAlign = 'left';
        this.ctx.textBaseline = 'top';
        this.ctx.fillText(`LEVEL ${player.level}`, x, y);
    }

    /**
     * Draw timer
     */
    private drawTimer(gameTime: number): void {
        const totalTime = 30 * 60; // 30 minutes in seconds
        const remainingTime = Math.max(0, totalTime - gameTime);
        const minutes = Math.floor(remainingTime / 60);
        const seconds = Math.floor(remainingTime % 60);

        const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        const x = this.canvas.width / 2;
        const y = 20;

        // Background
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(x - 80, y - 5, 160, 40);

        // Border
        this.ctx.strokeStyle = remainingTime < 60 ? '#f00' : '#0ff';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(x - 80, y - 5, 160, 40);

        // Text
        this.ctx.fillStyle = remainingTime < 60 ? '#f00' : '#fff';
        this.ctx.font = 'bold 24px monospace';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'top';
        this.ctx.fillText(timeString, x, y);
    }

    /**
     * Draw wave info
     */
    private drawWaveInfo(wave: number, zombieCount: number): void {
        const x = this.canvas.width - 20;
        const y = 20;

        this.ctx.fillStyle = '#0ff';
        this.ctx.font = 'bold 18px monospace';
        this.ctx.textAlign = 'right';
        this.ctx.textBaseline = 'top';
        this.ctx.fillText(`WAVE ${wave}`, x, y);

        this.ctx.fillStyle = '#fff';
        this.ctx.font = '14px monospace';
        this.ctx.fillText(`Zombies: ${zombieCount}`, x, y + 25);
    }

    /**
     * Draw additional stats
     */
    private drawStats(player: Player, zombieCount: number): void {
        const x = this.canvas.width - 20;
        const y = 80;

        this.ctx.fillStyle = '#fff';
        this.ctx.font = '12px monospace';
        this.ctx.textAlign = 'right';
        this.ctx.textBaseline = 'top';

        this.ctx.fillText(`Position: (${Math.floor(player.x)}, ${Math.floor(player.y)})`, x, y);
    }

    /**
     * Draw title screen
     */
    drawTitleScreen(): void {
        this.ctx.save();

        // Background
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Title
        this.ctx.shadowColor = '#0ff';
        this.ctx.shadowBlur = 20;
        this.ctx.fillStyle = '#0ff';
        this.ctx.font = 'bold 60px monospace';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText('NEON NECROPOLIS', this.canvas.width / 2, this.canvas.height / 2 - 50);

        // Subtitle
        this.ctx.shadowBlur = 10;
        this.ctx.fillStyle = '#fff';
        this.ctx.font = '20px monospace';
        this.ctx.fillText('Survive 30 Minutes', this.canvas.width / 2, this.canvas.height / 2 + 20);

        // Instructions
        this.ctx.shadowBlur = 0;
        this.ctx.font = '16px monospace';
        this.ctx.fillText('WASD or Arrow Keys to Move', this.canvas.width / 2, this.canvas.height / 2 + 80);
        this.ctx.fillText('Auto-Fire Weapons', this.canvas.width / 2, this.canvas.height / 2 + 110);
        this.ctx.fillText('Press SPACE to Start', this.canvas.width / 2, this.canvas.height / 2 + 150);

        this.ctx.restore();
    }
}
