/**
 * Player class tests
 * Tests player movement, health management, XP system, and leveling
 */
import { Player } from '../src/game/Player';

describe('Player', () => {
  let player: Player;
  const worldWidth = 1600;
  const worldHeight = 1200;

  beforeEach(() => {
    player = new Player(worldWidth / 2, worldHeight / 2);
  });

  describe('Initialization', () => {
    test('should initialize at correct position', () => {
      expect(player.x).toBe(worldWidth / 2);
      expect(player.y).toBe(worldHeight / 2);
    });

    test('should initialize with correct stats', () => {
      expect(player.radius).toBe(20);
      expect(player.speed).toBe(200);
      expect(player.maxHealth).toBe(100);
      expect(player.health).toBe(100);
      expect(player.xp).toBe(0);
      expect(player.level).toBe(1);
      expect(player.xpToNextLevel).toBe(1000);
    });

    test('should have player id', () => {
      expect(player.id).toBe('player');
    });
  });

  describe('Movement', () => {
    test('should move right when dx is positive', () => {
      const initialX = player.x;
      player.move(1, 0, 0.1, worldWidth, worldHeight);
      expect(player.x).toBeGreaterThan(initialX);
      expect(player.y).toBe(worldHeight / 2);
    });

    test('should move left when dx is negative', () => {
      const initialX = player.x;
      player.move(-1, 0, 0.1, worldWidth, worldHeight);
      expect(player.x).toBeLessThan(initialX);
      expect(player.y).toBe(worldHeight / 2);
    });

    test('should move down when dy is positive', () => {
      const initialY = player.y;
      player.move(0, 1, 0.1, worldWidth, worldHeight);
      expect(player.y).toBeGreaterThan(initialY);
      expect(player.x).toBe(worldWidth / 2);
    });

    test('should move up when dy is negative', () => {
      const initialY = player.y;
      player.move(0, -1, 0.1, worldWidth, worldHeight);
      expect(player.y).toBeLessThan(initialY);
      expect(player.x).toBe(worldWidth / 2);
    });

    test('should move diagonally', () => {
      const initialX = player.x;
      const initialY = player.y;
      player.move(1, 1, 0.1, worldWidth, worldHeight);
      expect(player.x).toBeGreaterThan(initialX);
      expect(player.y).toBeGreaterThan(initialY);
    });

    test('should scale movement by delta time', () => {
      const initialX = player.x;
      player.move(1, 0, 0.05, worldWidth, worldHeight);
      const moved05 = player.x - initialX;

      player.x = initialX; // Reset
      player.move(1, 0, 0.1, worldWidth, worldHeight);
      const moved1 = player.x - initialX;

      expect(moved1).toBeCloseTo(moved05 * 2, 1);
    });

    test('should respect left boundary', () => {
      player.x = 50;
      player.move(-1, 0, 1.0, worldWidth, worldHeight); // Large deltaTime to force out of bounds
      expect(player.x).toBeGreaterThanOrEqual(player.radius);
    });

    test('should respect right boundary', () => {
      player.x = worldWidth - 50;
      player.move(1, 0, 1.0, worldWidth, worldHeight);
      expect(player.x).toBeLessThanOrEqual(worldWidth - player.radius);
    });

    test('should respect top boundary', () => {
      player.y = 50;
      player.move(0, -1, 1.0, worldWidth, worldHeight);
      expect(player.y).toBeGreaterThanOrEqual(player.radius);
    });

    test('should respect bottom boundary', () => {
      player.y = worldHeight - 50;
      player.move(0, 1, 1.0, worldWidth, worldHeight);
      expect(player.y).toBeLessThanOrEqual(worldHeight - player.radius);
    });

    test('should not move when both dx and dy are zero', () => {
      const initialX = player.x;
      const initialY = player.y;
      player.move(0, 0, 0.1, worldWidth, worldHeight);
      expect(player.x).toBe(initialX);
      expect(player.y).toBe(initialY);
    });
  });

  describe('Health System', () => {
    test('should take damage correctly', () => {
      player.takeDamage(30);
      expect(player.health).toBe(70);
    });

    test('should not go below zero health', () => {
      player.takeDamage(150);
      expect(player.health).toBe(0);
    });

    test('should handle multiple damage instances', () => {
      player.takeDamage(20);
      player.takeDamage(15);
      player.takeDamage(10);
      expect(player.health).toBe(55);
    });

    test('should heal correctly', () => {
      player.takeDamage(50);
      player.heal(20);
      expect(player.health).toBe(70);
    });

    test('should not heal above max health', () => {
      player.takeDamage(10);
      player.heal(50);
      expect(player.health).toBe(player.maxHealth);
    });

    test('should report alive when health > 0', () => {
      player.health = 50;
      expect(player.isAlive()).toBe(true);
    });

    test('should report dead when health = 0', () => {
      player.health = 0;
      expect(player.isAlive()).toBe(false);
    });

    test('should report dead after fatal damage', () => {
      player.takeDamage(150);
      expect(player.isAlive()).toBe(false);
    });
  });

  describe('XP and Leveling System', () => {
    test('should add XP correctly', () => {
      const leveledUp = player.addXP(500);
      expect(player.xp).toBe(500);
      expect(leveledUp).toBe(false);
    });

    test('should level up when reaching XP threshold', () => {
      const leveledUp = player.addXP(1000);
      expect(leveledUp).toBe(true);
      expect(player.level).toBe(2);
      expect(player.xp).toBe(0); // XP resets after leveling
    });

    test('should carry over excess XP after leveling', () => {
      const leveledUp = player.addXP(1200);
      expect(leveledUp).toBe(true);
      expect(player.level).toBe(2);
      expect(player.xp).toBe(200);
    });

    test('should handle multiple level ups', () => {
      player.addXP(500);
      expect(player.level).toBe(1);

      player.addXP(500);
      expect(player.level).toBe(2);

      player.addXP(1000);
      expect(player.level).toBe(3);
    });

    test('should maintain 1000 XP requirement per level', () => {
      player.addXP(1000); // Level 2
      expect(player.xpToNextLevel).toBe(1000);

      player.addXP(1000); // Level 3
      expect(player.xpToNextLevel).toBe(1000);
    });

    test('should calculate XP progress correctly', () => {
      player.addXP(500);
      expect(player.getXPProgress()).toBe(0.5);

      player.addXP(250);
      expect(player.getXPProgress()).toBe(0.75);
    });

    test('should handle XP progress at 0 XP', () => {
      expect(player.getXPProgress()).toBe(0);
    });

    test('should handle XP progress at full XP', () => {
      player.addXP(999);
      expect(player.getXPProgress()).toBeCloseTo(0.999, 3);
    });

    test('should not return negative XP progress', () => {
      expect(player.getXPProgress()).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Rendering', () => {
    test('should have render method', () => {
      expect(typeof player.render).toBe('function');
    });

    test('should render without errors', () => {
      const canvas = (global as any).createMockCanvas();
      const ctx = canvas.getContext('2d')!;

      expect(() => player.render(ctx)).not.toThrow();
    });

    test('should call canvas methods during render', () => {
      const canvas = (global as any).createMockCanvas();
      const ctx = canvas.getContext('2d')!;

      player.render(ctx);

      expect(ctx.save).toHaveBeenCalled();
      expect(ctx.restore).toHaveBeenCalled();
      expect(ctx.beginPath).toHaveBeenCalled();
      expect(ctx.arc).toHaveBeenCalled();
      expect(ctx.fill).toHaveBeenCalled();
    });
  });

  describe('Edge Cases', () => {
    test('should handle very small delta time', () => {
      const initialX = player.x;
      player.move(1, 0, 0.001, worldWidth, worldHeight);
      expect(player.x).toBeGreaterThan(initialX);
      expect(player.x - initialX).toBeLessThan(1);
    });

    test('should handle large delta time', () => {
      const initialX = player.x;
      player.move(1, 0, 5.0, worldWidth, worldHeight);
      expect(player.x).toBeGreaterThan(initialX);
      // Should still be clamped within world bounds
      expect(player.x).toBeLessThanOrEqual(worldWidth - player.radius);
    });

    test('should handle zero damage', () => {
      const initialHealth = player.health;
      player.takeDamage(0);
      expect(player.health).toBe(initialHealth);
    });

    test('should handle zero healing', () => {
      player.takeDamage(50);
      const currentHealth = player.health;
      player.heal(0);
      expect(player.health).toBe(currentHealth);
    });

    test('should handle massive XP gain', () => {
      const leveledUp = player.addXP(10000);
      expect(leveledUp).toBe(true);
      expect(player.level).toBeGreaterThan(1);
    });
  });
});
