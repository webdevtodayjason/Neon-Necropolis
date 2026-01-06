/**
 * Zombie class tests
 * Tests zombie movement, damage, attacking, and behavior
 */
import { Zombie, ZombieConfig } from '../src/game/Zombie';

describe('Zombie', () => {
  let zombie: Zombie;
  const basicConfig: ZombieConfig = {
    type: 'basic',
    health: 50,
    speed: 100,
    damage: 10,
    xpValue: 25,
    color: '#ff0000',
    radius: 15,
    attackCooldown: 1.0
  };

  beforeEach(() => {
    zombie = new Zombie(500, 500, basicConfig);
  });

  describe('Initialization', () => {
    test('should initialize at correct position', () => {
      expect(zombie.x).toBe(500);
      expect(zombie.y).toBe(500);
    });

    test('should initialize with correct config values', () => {
      expect(zombie.type).toBe('basic');
      expect(zombie.health).toBe(50);
      expect(zombie.maxHealth).toBe(50);
      expect(zombie.speed).toBe(100);
      expect(zombie.damage).toBe(10);
      expect(zombie.xpValue).toBe(25);
      expect(zombie.color).toBe('#ff0000');
      expect(zombie.radius).toBe(15);
      expect(zombie.attackCooldown).toBe(1.0);
    });

    test('should default attack cooldown to 1.0 if not specified', () => {
      const config = { ...basicConfig };
      delete config.attackCooldown;
      const newZombie = new Zombie(100, 100, config);
      expect(newZombie.attackCooldown).toBe(1.0);
    });

    test('should start alive', () => {
      expect(zombie.dead).toBe(false);
    });

    test('should start with zero attack timer', () => {
      expect(zombie.attackTimer).toBe(0);
    });

    test('should generate unique ID', () => {
      const zombie2 = new Zombie(100, 100, basicConfig);
      expect(zombie.id).not.toBe(zombie2.id);
      expect(zombie.id).toMatch(/^zombie_/);
    });

    test('should preserve special ability if provided', () => {
      const specialConfig = { ...basicConfig, specialAbility: 'explosive' };
      const specialZombie = new Zombie(100, 100, specialConfig);
      expect(specialZombie.specialAbility).toBe('explosive');
    });
  });

  describe('Movement', () => {
    test('should move towards target on right', () => {
      const initialX = zombie.x;
      zombie.moveTowards(600, 500, 0.1);
      expect(zombie.x).toBeGreaterThan(initialX);
      expect(zombie.y).toBeCloseTo(500, 1);
    });

    test('should move towards target on left', () => {
      const initialX = zombie.x;
      zombie.moveTowards(400, 500, 0.1);
      expect(zombie.x).toBeLessThan(initialX);
      expect(zombie.y).toBeCloseTo(500, 1);
    });

    test('should move towards target below', () => {
      const initialY = zombie.y;
      zombie.moveTowards(500, 600, 0.1);
      expect(zombie.y).toBeGreaterThan(initialY);
      expect(zombie.x).toBeCloseTo(500, 1);
    });

    test('should move towards target above', () => {
      const initialY = zombie.y;
      zombie.moveTowards(500, 400, 0.1);
      expect(zombie.y).toBeLessThan(initialY);
      expect(zombie.x).toBeCloseTo(500, 1);
    });

    test('should move diagonally towards target', () => {
      const initialX = zombie.x;
      const initialY = zombie.y;
      zombie.moveTowards(600, 600, 0.1);
      expect(zombie.x).toBeGreaterThan(initialX);
      expect(zombie.y).toBeGreaterThan(initialY);
    });

    test('should scale movement by deltaTime', () => {
      const zombie1 = new Zombie(500, 500, basicConfig);
      const zombie2 = new Zombie(500, 500, basicConfig);

      zombie1.moveTowards(600, 500, 0.1);
      zombie2.moveTowards(600, 500, 0.2);

      const distance1 = zombie1.x - 500;
      const distance2 = zombie2.x - 500;

      expect(distance2).toBeCloseTo(distance1 * 2, 1);
    });

    test('should scale movement by speed', () => {
      const slowZombie = new Zombie(500, 500, { ...basicConfig, speed: 50 });
      const fastZombie = new Zombie(500, 500, { ...basicConfig, speed: 200 });

      slowZombie.moveTowards(600, 500, 0.1);
      fastZombie.moveTowards(600, 500, 0.1);

      const slowDistance = slowZombie.x - 500;
      const fastDistance = fastZombie.x - 500;

      expect(fastDistance).toBeGreaterThan(slowDistance);
      expect(fastDistance).toBeCloseTo(slowDistance * 4, 1);
    });

    test('should normalize movement direction', () => {
      // Move diagonally should be same speed as horizontal/vertical
      const zombie1 = new Zombie(0, 0, basicConfig);
      const zombie2 = new Zombie(0, 0, basicConfig);

      zombie1.moveTowards(100, 0, 0.1); // Horizontal
      zombie2.moveTowards(100, 100, 0.1); // Diagonal

      const distance1 = Math.sqrt(zombie1.x ** 2 + zombie1.y ** 2);
      const distance2 = Math.sqrt(zombie2.x ** 2 + zombie2.y ** 2);

      expect(distance1).toBeCloseTo(distance2, 1);
    });

    test('should not move if already at target', () => {
      zombie.moveTowards(500, 500, 0.1);
      expect(zombie.x).toBeCloseTo(500, 5);
      expect(zombie.y).toBeCloseTo(500, 5);
    });

    test('should handle very small movements', () => {
      const initialX = zombie.x;
      zombie.moveTowards(501, 500, 0.001);
      expect(zombie.x).toBeGreaterThan(initialX);
    });
  });

  describe('Health and Damage', () => {
    test('should take damage correctly', () => {
      zombie.takeDamage(20);
      expect(zombie.health).toBe(30);
      expect(zombie.dead).toBe(false);
    });

    test('should die when health reaches zero', () => {
      zombie.takeDamage(50);
      expect(zombie.health).toBe(0);
      expect(zombie.dead).toBe(true);
    });

    test('should die when taking more damage than health', () => {
      zombie.takeDamage(100);
      expect(zombie.health).toBe(0);
      expect(zombie.dead).toBe(true);
    });

    test('should handle multiple damage instances', () => {
      zombie.takeDamage(10);
      zombie.takeDamage(15);
      zombie.takeDamage(5);
      expect(zombie.health).toBe(20);
      expect(zombie.dead).toBe(false);
    });

    test('should handle zero damage', () => {
      const initialHealth = zombie.health;
      zombie.takeDamage(0);
      expect(zombie.health).toBe(initialHealth);
      expect(zombie.dead).toBe(false);
    });

    test('should not have negative health', () => {
      zombie.takeDamage(1000);
      expect(zombie.health).toBe(0);
      expect(zombie.health).toBeGreaterThanOrEqual(0);
    });

    test('should stay dead after dying', () => {
      zombie.takeDamage(50);
      expect(zombie.dead).toBe(true);
      zombie.takeDamage(10); // Additional damage
      expect(zombie.dead).toBe(true);
    });
  });

  describe('Attack System', () => {
    test('should be able to attack initially', () => {
      expect(zombie.canAttack()).toBe(true);
    });

    test('should set attack timer after attacking', () => {
      zombie.attack();
      expect(zombie.attackTimer).toBe(zombie.attackCooldown);
    });

    test('should not be able to attack during cooldown', () => {
      zombie.attack();
      expect(zombie.canAttack()).toBe(false);
    });

    test('should reduce attack timer over time', () => {
      zombie.attack();
      const initialTimer = zombie.attackTimer;

      zombie.updateAttackTimer(0.3);
      expect(zombie.attackTimer).toBeLessThan(initialTimer);
      expect(zombie.attackTimer).toBeCloseTo(0.7, 2);
    });

    test('should be able to attack after cooldown expires', () => {
      zombie.attack();
      zombie.updateAttackTimer(1.1); // More than cooldown
      expect(zombie.canAttack()).toBe(true);
    });

    test('should not reduce timer below zero', () => {
      zombie.attackTimer = 0.1;
      zombie.updateAttackTimer(0.5);
      expect(zombie.attackTimer).toBeLessThanOrEqual(0);
    });

    test('should handle custom attack cooldowns', () => {
      const fastZombie = new Zombie(100, 100, { ...basicConfig, attackCooldown: 0.5 });
      fastZombie.attack();
      expect(fastZombie.attackTimer).toBe(0.5);

      const slowZombie = new Zombie(100, 100, { ...basicConfig, attackCooldown: 2.0 });
      slowZombie.attack();
      expect(slowZombie.attackTimer).toBe(2.0);
    });

    test('should allow multiple attacks over time', () => {
      zombie.attack();
      expect(zombie.canAttack()).toBe(false);

      zombie.updateAttackTimer(1.1);
      expect(zombie.canAttack()).toBe(true);

      zombie.attack();
      expect(zombie.canAttack()).toBe(false);
    });
  });

  describe('Zombie Types', () => {
    test('should support weak zombie configuration', () => {
      const weakConfig: ZombieConfig = {
        type: 'weak',
        health: 20,
        speed: 80,
        damage: 5,
        xpValue: 10,
        color: '#00ff00',
        radius: 12
      };

      const weakZombie = new Zombie(100, 100, weakConfig);
      expect(weakZombie.health).toBe(20);
      expect(weakZombie.speed).toBe(80);
    });

    test('should support tank zombie configuration', () => {
      const tankConfig: ZombieConfig = {
        type: 'tank',
        health: 200,
        speed: 50,
        damage: 25,
        xpValue: 100,
        color: '#ffff00',
        radius: 25
      };

      const tankZombie = new Zombie(100, 100, tankConfig);
      expect(tankZombie.health).toBe(200);
      expect(tankZombie.radius).toBe(25);
    });

    test('should support fast zombie configuration', () => {
      const fastConfig: ZombieConfig = {
        type: 'fast',
        health: 30,
        speed: 200,
        damage: 8,
        xpValue: 30,
        color: '#ff00ff',
        radius: 10,
        attackCooldown: 0.5
      };

      const fastZombie = new Zombie(100, 100, fastConfig);
      expect(fastZombie.speed).toBe(200);
      expect(fastZombie.attackCooldown).toBe(0.5);
    });
  });

  describe('Rendering', () => {
    test('should have render method', () => {
      expect(typeof zombie.render).toBe('function');
    });

    test('should render without errors', () => {
      const canvas = (global as any).createMockCanvas();
      const ctx = canvas.getContext('2d')!;

      expect(() => zombie.render(ctx)).not.toThrow();
    });

    test('should call canvas methods during render', () => {
      const canvas = (global as any).createMockCanvas();
      const ctx = canvas.getContext('2d')!;

      zombie.render(ctx);

      expect(ctx.save).toHaveBeenCalled();
      expect(ctx.restore).toHaveBeenCalled();
      expect(ctx.beginPath).toHaveBeenCalled();
      expect(ctx.arc).toHaveBeenCalled();
      expect(ctx.fill).toHaveBeenCalled();
      expect(ctx.fillRect).toHaveBeenCalled(); // Health bar
    });

    test('should render health bar', () => {
      const canvas = (global as any).createMockCanvas();
      const ctx = canvas.getContext('2d')!;

      zombie.takeDamage(25); // 50% health
      zombie.render(ctx);

      // Should draw health bar (background + foreground)
      expect(ctx.fillRect).toHaveBeenCalled();
    });
  });

  describe('Edge Cases', () => {
    test('should handle zero speed', () => {
      const staticZombie = new Zombie(100, 100, { ...basicConfig, speed: 0 });
      staticZombie.moveTowards(200, 200, 0.1);
      expect(staticZombie.x).toBe(100);
      expect(staticZombie.y).toBe(100);
    });

    test('should handle very high speed', () => {
      const speedyZombie = new Zombie(0, 0, { ...basicConfig, speed: 10000 });
      speedyZombie.moveTowards(1000, 0, 0.1);
      expect(speedyZombie.x).toBeGreaterThan(500);
    });

    test('should handle very small deltaTime', () => {
      const initialX = zombie.x;
      zombie.moveTowards(600, 500, 0.001);
      expect(zombie.x).toBeGreaterThan(initialX);
      expect(zombie.x - initialX).toBeLessThan(1);
    });

    test('should handle large deltaTime', () => {
      zombie.moveTowards(1000, 500, 10.0);
      // Should move significantly but not break
      expect(zombie.x).toBeGreaterThan(500);
    });

    test('should handle negative coordinates', () => {
      const negZombie = new Zombie(-100, -100, basicConfig);
      negZombie.moveTowards(0, 0, 0.1);
      expect(negZombie.x).toBeGreaterThan(-100);
      expect(negZombie.y).toBeGreaterThan(-100);
    });

    test('should handle very small health values', () => {
      const fragileZombie = new Zombie(100, 100, { ...basicConfig, health: 1 });
      fragileZombie.takeDamage(1);
      expect(fragileZombie.dead).toBe(true);
    });

    test('should handle massive health values', () => {
      const bossZombie = new Zombie(100, 100, { ...basicConfig, health: 10000 });
      bossZombie.takeDamage(100);
      expect(bossZombie.health).toBe(9900);
      expect(bossZombie.dead).toBe(false);
    });

    test('should handle zero attack cooldown (defaults to 1.0)', () => {
      const instantZombie = new Zombie(100, 100, { ...basicConfig, attackCooldown: 0 });
      // Due to `config.attackCooldown || 1.0` in constructor, 0 becomes 1.0
      expect(instantZombie.attackCooldown).toBe(1.0);

      instantZombie.attack();
      // Timer is set to attackCooldown which is 1.0
      expect(instantZombie.attackTimer).toBe(1.0);
      expect(instantZombie.canAttack()).toBe(false);
    });

    test('should handle fractional damage', () => {
      zombie.takeDamage(15.7);
      expect(zombie.health).toBeCloseTo(34.3, 2);
    });
  });

  describe('Combat Integration', () => {
    test('should simulate attack cycle', () => {
      // Initial state - can attack
      expect(zombie.canAttack()).toBe(true);

      // Attack
      zombie.attack();
      expect(zombie.canAttack()).toBe(false);

      // Wait for half cooldown
      zombie.updateAttackTimer(0.5);
      expect(zombie.canAttack()).toBe(false);

      // Wait for full cooldown
      zombie.updateAttackTimer(0.6);
      expect(zombie.canAttack()).toBe(true);
    });

    test('should simulate taking damage while moving', () => {
      zombie.moveTowards(600, 600, 0.1);
      zombie.takeDamage(10);

      expect(zombie.health).toBe(40);
      expect(zombie.x).toBeGreaterThan(500);
      expect(zombie.y).toBeGreaterThan(500);
    });

    test('should die during movement', () => {
      zombie.moveTowards(600, 600, 0.1);
      zombie.takeDamage(50);

      expect(zombie.dead).toBe(true);
      // Position should still be updated
      expect(zombie.x).toBeGreaterThan(500);
    });
  });
});
