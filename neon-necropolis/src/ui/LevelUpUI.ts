/**
 * Level up weapon selection UI
 */
import { getWeaponStats } from '../game/WeaponTypes';

export class LevelUpUI {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private selectedIndex: number = 0;
    private keyListener: ((e: KeyboardEvent) => void) | null = null;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d')!;
    }

    /**
     * Render level up screen
     */
    render(options: string[], onSelect: (index: number) => void): void {
        if (options.length === 0) {
            onSelect(0);
            return;
        }

        this.ctx.save();

        // Semi-transparent background
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Title
        this.ctx.shadowColor = '#0ff';
        this.ctx.shadowBlur = 20;
        this.ctx.fillStyle = '#0ff';
        this.ctx.font = 'bold 48px monospace';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'top';
        this.ctx.fillText('LEVEL UP!', this.canvas.width / 2, 50);

        // Subtitle
        this.ctx.shadowBlur = 0;
        this.ctx.fillStyle = '#fff';
        this.ctx.font = '20px monospace';
        this.ctx.fillText('Choose your upgrade:', this.canvas.width / 2, 120);

        // Draw weapon cards
        this.drawWeaponCards(options);

        // Instructions
        this.ctx.font = '16px monospace';
        this.ctx.fillStyle = '#aaa';
        this.ctx.fillText('Use 1, 2, 3 keys or click to select', this.canvas.width / 2, this.canvas.height - 40);

        this.ctx.restore();

        // Set up input handling
        this.setupInput(options, onSelect);
    }

    /**
     * Draw weapon selection cards
     */
    private drawWeaponCards(options: string[]): void {
        const cardWidth = 280;
        const cardHeight = 340;
        const spacing = 30;
        const startX = (this.canvas.width - (cardWidth * options.length + spacing * (options.length - 1))) / 2;
        const startY = 180;

        for (let i = 0; i < options.length; i++) {
            const x = startX + i * (cardWidth + spacing);
            const y = startY;

            this.drawWeaponCard(options[i], x, y, cardWidth, cardHeight, i === this.selectedIndex);
        }
    }

    /**
     * Draw a single weapon card
     */
    private drawWeaponCard(
        weaponType: string,
        x: number,
        y: number,
        width: number,
        height: number,
        selected: boolean
    ): void {
        this.ctx.save();

        // Card background
        this.ctx.fillStyle = selected ? 'rgba(0, 255, 255, 0.2)' : 'rgba(50, 50, 50, 0.8)';
        this.ctx.fillRect(x, y, width, height);

        // Card border
        this.ctx.strokeStyle = selected ? '#0ff' : '#666';
        this.ctx.lineWidth = selected ? 4 : 2;
        if (selected) {
            this.ctx.shadowColor = '#0ff';
            this.ctx.shadowBlur = 20;
        }
        this.ctx.strokeRect(x, y, width, height);
        this.ctx.shadowBlur = 0;

        // Get weapon info
        let weaponName = '';
        let description = '';
        let stats: string[] = [];
        let isUpgrade = false;

        if (weaponType.startsWith('UPGRADE_')) {
            isUpgrade = true;
            weaponName = weaponType.replace('UPGRADE_', '');
            description = 'Upgrade existing weapon';
            stats = ['+20% Damage', '+15% Fire Rate', 'or +1 Projectile'];
        } else {
            const weaponStats = getWeaponStats(weaponType);
            weaponName = weaponStats.name;
            description = 'New Weapon';
            stats = [
                `Damage: ${weaponStats.damage}`,
                `Fire Rate: ${weaponStats.fireRate}/s`,
                `Projectiles: ${weaponStats.projectileCount}`,
                weaponStats.piercing > 0 ? `Pierce: ${weaponStats.piercing}` : '',
                weaponStats.special ? `Special: ${weaponStats.special}` : ''
            ].filter(s => s !== '');
        }

        // Weapon name
        this.ctx.fillStyle = isUpgrade ? '#ff0' : '#0ff';
        this.ctx.font = 'bold 24px monospace';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'top';
        this.ctx.fillText(weaponName, x + width / 2, y + 20);

        // Description
        this.ctx.fillStyle = '#aaa';
        this.ctx.font = '14px monospace';
        this.ctx.fillText(description, x + width / 2, y + 55);

        // Stats
        this.ctx.fillStyle = '#fff';
        this.ctx.font = '16px monospace';
        this.ctx.textAlign = 'left';
        let statY = y + 100;
        for (const stat of stats) {
            this.ctx.fillText(stat, x + 20, statY);
            statY += 30;
        }

        // Selection number
        const cardIndex = Math.floor((x - ((this.canvas.width - (280 * 3 + 30 * 2)) / 2)) / (280 + 30));
        this.ctx.fillStyle = '#0ff';
        this.ctx.font = 'bold 32px monospace';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(`[${cardIndex + 1}]`, x + width / 2, y + height - 50);

        this.ctx.restore();
    }

    /**
     * Set up input handling for level up selection
     */
    private setupInput(options: string[], onSelect: (index: number) => void): void {
        // Remove old listener
        if (this.keyListener) {
            window.removeEventListener('keydown', this.keyListener);
        }

        // Add new listener
        this.keyListener = (e: KeyboardEvent) => {
            if (e.code === 'Digit1' || e.code === 'Numpad1') {
                if (options.length >= 1) {
                    this.cleanup();
                    onSelect(0);
                }
            } else if (e.code === 'Digit2' || e.code === 'Numpad2') {
                if (options.length >= 2) {
                    this.cleanup();
                    onSelect(1);
                }
            } else if (e.code === 'Digit3' || e.code === 'Numpad3') {
                if (options.length >= 3) {
                    this.cleanup();
                    onSelect(2);
                }
            }
        };

        window.addEventListener('keydown', this.keyListener);
    }

    /**
     * Clean up event listeners
     */
    cleanup(): void {
        if (this.keyListener) {
            window.removeEventListener('keydown', this.keyListener);
            this.keyListener = null;
        }
    }
}
