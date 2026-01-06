/**
 * NEON NECROPOLIS - Main Entry Point
 * A cyberpunk auto-shooter survival game
 */
import { Engine } from './engine/Engine';
import { Input } from './engine/Input';
import { Camera } from './engine/Camera';
import { Game } from './game/Game';
import { HUD } from './ui/HUD';
import { LevelUpUI } from './ui/LevelUpUI';
import { GameOverUI } from './ui/GameOverUI';

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

    // Draw grid background
    drawGrid();

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
 * Draw grid background
 */
function drawGrid(): void {
    const gridSize = 50;
    const startX = Math.floor(camera.x / gridSize) * gridSize;
    const startY = Math.floor(camera.y / gridSize) * gridSize;
    const endX = camera.x + camera.width;
    const endY = camera.y + camera.height;

    ctx.strokeStyle = 'rgba(0, 255, 255, 0.1)';
    ctx.lineWidth = 1;

    // Vertical lines
    for (let x = startX; x <= endX; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, camera.y);
        ctx.lineTo(x, camera.y + camera.height);
        ctx.stroke();
    }

    // Horizontal lines
    for (let y = startY; y <= endY; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(camera.x, y);
        ctx.lineTo(camera.x + camera.width, y);
        ctx.stroke();
    }
}

/**
 * Render HUD
 */
function renderHUD(): void {
    hud.render(
        game.player,
        game.gameTime,
        game.getWave(),
        game.zombies.length
    );
}

// Start the game
console.log('🎮 NEON NECROPOLIS - Starting...');
console.log('Controls: WASD or Arrow Keys to move');
console.log('Weapons auto-fire at nearest enemy');
console.log('Survive 30 minutes to win!');

engine.start();

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
