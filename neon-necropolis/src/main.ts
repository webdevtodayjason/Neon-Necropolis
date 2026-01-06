/**
 * NEON NECROPOLIS - Main Entry Point
 * A post-apocalyptic auto-shooter survival game
 */
import { Engine } from './engine/Engine';
import { Input } from './engine/Input';
import { Camera } from './engine/Camera';
import { Game } from './game/Game';
import { HUD } from './ui/HUD';
import { LevelUpUI } from './ui/LevelUpUI';
import { GameOverUI } from './ui/GameOverUI';
import { getAssetManager } from './assets/AssetManager';

// Game constants
const CANVAS_WIDTH = 1280;
const CANVAS_HEIGHT = 720;
const WORLD_WIDTH = 1280;
const WORLD_HEIGHT = 720;

// Initialize canvas
const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
if (!canvas) {
    throw new Error('Canvas element not found!');
}

canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

const ctx = canvas.getContext('2d')!;
if (!ctx) {
    throw new Error('Could not get 2D context!');
}

// Initialize systems
const input = new Input();
const camera = new Camera({
    x: 0,
    y: 0,
    width: CANVAS_WIDTH,
    height: CANVAS_HEIGHT,
    followSpeed: 0.1,
    followDeadzone: 50
});

// Initialize game
const game = new Game(WORLD_WIDTH, WORLD_HEIGHT);

// Initialize UI
const hud = new HUD(canvas);
const levelUpUI = new LevelUpUI(canvas);
const gameOverUI = new GameOverUI(canvas);

// Game engine
const engine = new Engine(
    (deltaTime: number) => update(deltaTime),
    () => render()
);

/**
 * Update game state
 */
function update(deltaTime: number): void {
    // Handle title screen
    if (game.state === 'title') {
        if (input.isKeyPressed('Space')) {
            game.start();
        }
        return;
    }

    // Handle game over
    if (game.state === 'gameover' || game.state === 'victory') {
        if (input.isKeyPressed('Space')) {
            game.reset();
        }
        return;
    }

    // Handle level up
    if (game.state === 'levelup') {
        // Level up is handled by UI callbacks
        return;
    }

    // Update playing game
    if (game.state === 'playing') {
        const movement = input.getMovementInput();
        game.update(deltaTime, movement);

        // Update camera to follow player
        camera.follow(game.player.x, game.player.y);
        camera.update(deltaTime * 1000);

        // Screen shake on player damage
        if (game.player.health < 50) {
            // Light shake when low health
            if (Math.random() < 0.01) {
                camera.shakeSmall();
            }
        }
    }

    // Update input state
    input.update();
}

/**
 * Render game
 */
function render(): void {
    // Clear canvas
    ctx.fillStyle = '#0a0a1a';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Render title screen
    if (game.state === 'title') {
        gameOverUI.renderTitle();
        return;
    }

    // Render game over
    if (game.state === 'gameover') {
        renderGameWorld();
        gameOverUI.renderGameOver({
            level: game.player.level,
            zombiesKilled: game.zombiesKilled,
            damageDealt: game.damageDealt,
            survivalTime: game.gameTime
        });
        return;
    }

    // Render victory
    if (game.state === 'victory') {
        renderGameWorld();
        gameOverUI.renderVictory({
            level: game.player.level,
            zombiesKilled: game.zombiesKilled,
            damageDealt: game.damageDealt
        });
        return;
    }

    // Render level up
    if (game.state === 'levelup') {
        renderGameWorld();
        levelUpUI.render(game.levelUpOptions, (index: number) => {
            game.selectLevelUpOption(index);
        });
        return;
    }

    // Render playing game
    if (game.state === 'playing') {
        renderGameWorld();
        renderHUD();
    }
}

/**
 * Render the game world
 */
function renderGameWorld(): void {
    ctx.save();

    // Apply camera transform
    camera.applyTransform(ctx);

    // Draw terrain background
    drawTerrain();

    // Draw world boundaries
    drawBoundaries();

    // Draw obstacles (environment layer - behind entities)
    for (const obstacle of game.obstacles) {
        obstacle.render(ctx);
    }

    // Draw chests
    for (const chest of game.chests) {
        chest.render(ctx);
    }

    // Draw zombies
    for (const zombie of game.zombies) {
        zombie.render(ctx);
    }

    // Draw projectiles
    for (const projectile of game.projectilePool.getActive()) {
        projectile.render(ctx);
    }

    // Draw player
    game.player.render(ctx);

    // Reset camera transform
    camera.resetTransform(ctx);

    ctx.restore();
}

/**
 * Draw terrain background with wasteland feel
 */
function drawTerrain(): void {
    // Base ground color - dusty brown/tan
    ctx.fillStyle = '#2a2018';
    ctx.fillRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);

    // Draw scattered terrain details (dirt patches, cracks)
    ctx.fillStyle = '#352a1f';

    // Use seeded random for consistent terrain
    const seed = 12345;
    for (let i = 0; i < 80; i++) {
        const pseudoRand = (n: number) => {
            const x = Math.sin(seed + n * 9999) * 10000;
            return x - Math.floor(x);
        };

        const x = pseudoRand(i) * WORLD_WIDTH;
        const y = pseudoRand(i + 100) * WORLD_HEIGHT;
        const size = 20 + pseudoRand(i + 200) * 60;

        ctx.beginPath();
        ctx.ellipse(x, y, size, size * 0.6, pseudoRand(i + 300) * Math.PI, 0, Math.PI * 2);
        ctx.fill();
    }

    // Draw some darker patches (shadows/burnt areas)
    ctx.fillStyle = '#1a1510';
    for (let i = 0; i < 30; i++) {
        const pseudoRand = (n: number) => {
            const x = Math.sin(seed + n * 7777) * 10000;
            return x - Math.floor(x);
        };

        const x = pseudoRand(i + 500) * WORLD_WIDTH;
        const y = pseudoRand(i + 600) * WORLD_HEIGHT;
        const size = 30 + pseudoRand(i + 700) * 80;

        ctx.beginPath();
        ctx.ellipse(x, y, size, size * 0.5, pseudoRand(i + 800) * Math.PI, 0, Math.PI * 2);
        ctx.fill();
    }

    // Draw some lighter sand patches
    ctx.fillStyle = '#3d3225';
    for (let i = 0; i < 40; i++) {
        const pseudoRand = (n: number) => {
            const x = Math.sin(seed + n * 5555) * 10000;
            return x - Math.floor(x);
        };

        const x = pseudoRand(i + 900) * WORLD_WIDTH;
        const y = pseudoRand(i + 1000) * WORLD_HEIGHT;
        const size = 15 + pseudoRand(i + 1100) * 40;

        ctx.beginPath();
        ctx.ellipse(x, y, size, size * 0.7, 0, 0, Math.PI * 2);
        ctx.fill();
    }
}

/**
 * Draw world boundaries
 */
function drawBoundaries(): void {
    const borderWidth = 8;

    // Danger zone gradient near edges
    const gradient = ctx.createLinearGradient(0, 0, 40, 0);
    gradient.addColorStop(0, 'rgba(255, 0, 0, 0.3)');
    gradient.addColorStop(1, 'rgba(255, 0, 0, 0)');

    // Left edge warning
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 40, WORLD_HEIGHT);

    // Right edge warning
    ctx.save();
    ctx.translate(WORLD_WIDTH, 0);
    ctx.scale(-1, 1);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 40, WORLD_HEIGHT);
    ctx.restore();

    // Top edge warning
    const gradientV = ctx.createLinearGradient(0, 0, 0, 40);
    gradientV.addColorStop(0, 'rgba(255, 0, 0, 0.3)');
    gradientV.addColorStop(1, 'rgba(255, 0, 0, 0)');
    ctx.fillStyle = gradientV;
    ctx.fillRect(0, 0, WORLD_WIDTH, 40);

    // Bottom edge warning
    ctx.save();
    ctx.translate(0, WORLD_HEIGHT);
    ctx.scale(1, -1);
    ctx.fillStyle = gradientV;
    ctx.fillRect(0, 0, WORLD_WIDTH, 40);
    ctx.restore();

    // Solid border
    ctx.strokeStyle = '#ff4444';
    ctx.lineWidth = borderWidth;
    ctx.strokeRect(borderWidth/2, borderWidth/2, WORLD_WIDTH - borderWidth, WORLD_HEIGHT - borderWidth);

    // Corner markers
    const cornerSize = 30;
    ctx.fillStyle = '#ff4444';

    // Top-left
    ctx.fillRect(0, 0, cornerSize, borderWidth);
    ctx.fillRect(0, 0, borderWidth, cornerSize);

    // Top-right
    ctx.fillRect(WORLD_WIDTH - cornerSize, 0, cornerSize, borderWidth);
    ctx.fillRect(WORLD_WIDTH - borderWidth, 0, borderWidth, cornerSize);

    // Bottom-left
    ctx.fillRect(0, WORLD_HEIGHT - borderWidth, cornerSize, borderWidth);
    ctx.fillRect(0, WORLD_HEIGHT - cornerSize, borderWidth, cornerSize);

    // Bottom-right
    ctx.fillRect(WORLD_WIDTH - cornerSize, WORLD_HEIGHT - borderWidth, cornerSize, borderWidth);
    ctx.fillRect(WORLD_WIDTH - borderWidth, WORLD_HEIGHT - cornerSize, borderWidth, cornerSize);
}

/**
 * Render HUD
 */
function renderHUD(): void {
    hud.render(
        game.player,
        game.gameTime,
        game.getWave(),
        game.zombies.length,
        game.lives
    );
}

// Initialize and start the game
async function initGame() {
    console.log('🎮 NEON NECROPOLIS - Loading assets...');

    const assetManager = getAssetManager();

    // Set up loading progress display
    assetManager.setProgressCallback((progress) => {
        const percent = Math.floor(progress * 100);
        ctx.fillStyle = '#0a0a1a';
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        ctx.fillStyle = '#0ff';
        ctx.font = '24px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`Loading... ${percent}%`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);

        // Progress bar
        const barWidth = 400;
        const barHeight = 20;
        const barX = (CANVAS_WIDTH - barWidth) / 2;
        const barY = CANVAS_HEIGHT / 2 + 30;
        ctx.strokeStyle = '#0ff';
        ctx.strokeRect(barX, barY, barWidth, barHeight);
        ctx.fillRect(barX, barY, barWidth * progress, barHeight);
    });

    // Load all assets
    await assetManager.loadAll();

    console.log('✅ Assets loaded!');
    console.log('Controls: WASD or Arrow Keys to move');
    console.log('Weapons auto-fire at nearest enemy');
    console.log('Survive 30 minutes to win!');

    engine.start();
}

initGame();

// Handle window resize
window.addEventListener('resize', () => {
    // Keep canvas at fixed size for now
    // Could add responsive scaling here
});

// Prevent context menu on canvas
canvas.addEventListener('contextmenu', (e) => {
    e.preventDefault();
});

// Export for debugging
(window as any).game = game;
(window as any).engine = engine;
(window as any).camera = camera;

console.log('✅ Game initialized and running!');
