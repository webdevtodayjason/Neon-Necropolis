/**
 * Projectile and ProjectilePool tests
 * Tests projectile behavior, pooling system, and lifecycle
 */
import { Projectile, ProjectileConfig, ProjectilePool } from '../src/game/Projectile';

describe('Projectile', () => {
  let projectile: Projectile;
  const basicConfig: ProjectileConfig = {
    x: 100,
    y: 200,
    angle: 0, // Moving right
    speed: 500,
    damage: 10,
    color: '#ff0000',
    radius: 5,
    lifetime: 2.0,
    piercing: 0,
    weaponType: 'pistol'
  };

  beforeEach(() => {
    projectile = new Projectile(basicConfig);
  });

  describe('Initialization', () => {
    test('should initialize at correct position', () => {
      expect(projectile.x).toBe(100);
      expect(projectile.y).toBe(200);
    });

    test('should initialize with correct config values', () => {
      expect(projectile.speed).toBe(500);
      expect(projectile.damage).toBe(10);
      expect(projectile.color).toBe('#ff0000');
      expect(projectile.radius).toBe(5);
      expect(projectile.lifetime).toBe(2.0);
      expect(projectile.piercing).toBe(0);
      expect(projectile.weaponType).toBe('pistol');
    });

    test('should calculate velocity from angle', () => {
      expect(projectile.vx).toBeCloseTo(500, 1); // cos(0) = 1
      expect(projectile.vy).toBeCloseTo(0, 1); // sin(0) = 0
    });

    test('should calculate velocity for diagonal angle', () => {
      const diagonal = new Projectile({
        ...basicConfig,
        angle: Math.PI / 4 // 45 degrees
      });

      const expectedVelocity = 500 / Math.sqrt(2);
      expect(diagonal.vx).toBeCloseTo(expectedVelocity, 1);
      expect(diagonal.vy).toBeCloseTo(expectedVelocity, 1);
    });

    test('should calculate velocity for upward angle', () => {
      const upward = new Projectile({
        ...basicConfig,
        angle: -Math.PI / 2 // 90 degrees up
      });

      expect(upward.vx).toBeCloseTo(0, 1);
      expect(upward.vy).toBeCloseTo(-500, 1);
    });

    test('should start active', () => {
      expect(projectile.active).toBe(true);
    });

    test('should start with zero age', () => {
      expect(projectile.age).toBe(0);
    });

    test('should start with zero pierced count', () => {
      expect(projectile.piercedCount).toBe(0);
    });

    test('should generate unique ID', () => {
      const proj2 = new Projectile(basicConfig);
      expect(projectile.id).not.toBe(proj2.id);
      expect(projectile.id).toMatch(/^projectile_/);
    });

    test('should default lifetime to 3.0 if not specified', () => {
      const config = { ...basicConfig };
      delete config.lifetime;
      const proj = new Projectile(config);
      expect(proj.lifetime).toBe(3.0);
    });

    test('should default piercing to 0 if not specified', () => {
      const config = { ...basicConfig };
      delete config.piercing;
      const proj = new Projectile(config);
      expect(proj.piercing).toBe(0);
    });

    test('should default weaponType to default if not specified', () => {
      const config = { ...basicConfig };
      delete config.weaponType;
      const proj = new Projectile(config);
      expect(proj.weaponType).toBe('default');
    });
  });

  describe('Movement', () => {
    test('should move in the correct direction', () => {
      const initialX = projectile.x;
      projectile.update(0.1);
      expect(projectile.x).toBeGreaterThan(initialX);
      expect(projectile.x).toBeCloseTo(150, 1); // 100 + 500 * 0.1
    });

    test('should move based on velocity', () => {
      projectile.update(0.1);
      expect(projectile.x).toBeCloseTo(100 + projectile.vx * 0.1, 1);
      expect(projectile.y).toBeCloseTo(200 + projectile.vy * 0.1, 1);
    });

    test('should scale movement by deltaTime', () => {
      const proj1 = new Projectile(basicConfig);
      const proj2 = new Projectile(basicConfig);

      proj1.update(0.1);
      proj2.update(0.2);

      const distance1 = proj1.x - 100;
      const distance2 = proj2.x - 100;

      expect(distance2).toBeCloseTo(distance1 * 2, 1);
    });

    test('should maintain constant speed', () => {
      const positions: Array<{ x: number; y: number }> = [{ x: projectile.x, y: projectile.y }];

      for (let i = 0; i < 5; i++) {
        projectile.update(0.1);
        positions.push({ x: projectile.x, y: projectile.y });
      }

      // Check distances between consecutive positions
      for (let i = 1; i < positions.length; i++) {
        const dx = positions[i].x - positions[i - 1].x;
        const dy = positions[i].y - positions[i - 1].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        expect(distance).toBeCloseTo(50, 1); // speed * deltaTime = 500 * 0.1
      }
    });

    test('should move upward with negative y velocity', () => {
      const upward = new Projectile({
        ...basicConfig,
        angle: -Math.PI / 2
      });

      const initialY = upward.y;
      upward.update(0.1);
      expect(upward.y).toBeLessThan(initialY);
    });
  });

  describe('Lifetime', () => {
    test('should increment age on update', () => {
      projectile.update(0.1);
      expect(projectile.age).toBeCloseTo(0.1, 2);
    });

    test('should accumulate age over multiple updates', () => {
      projectile.update(0.1);
      projectile.update(0.15);
      projectile.update(0.2);
      expect(projectile.age).toBeCloseTo(0.45, 2);
    });

    test('should deactivate when lifetime expires', () => {
      projectile.update(2.1); // More than lifetime
      expect(projectile.active).toBe(false);
    });

    test('should remain active before lifetime expires', () => {
      projectile.update(1.9);
      expect(projectile.active).toBe(true);
    });

    test('should handle very short lifetime', () => {
      const shortLived = new Projectile({ ...basicConfig, lifetime: 0.1 });
      shortLived.update(0.11);
      expect(shortLived.active).toBe(false);
    });
  });

  describe('Piercing', () => {
    test('should not be able to pierce with zero piercing', () => {
      expect(projectile.canPierce()).toBe(false);
    });

    test('should be able to pierce with positive piercing', () => {
      const piercing = new Projectile({ ...basicConfig, piercing: 3 });
      expect(piercing.canPierce()).toBe(true);
    });

    test('should increment pierced count when piercing', () => {
      const piercing = new Projectile({ ...basicConfig, piercing: 3 });
      piercing.pierce();
      expect(piercing.piercedCount).toBe(1);
    });

    test('should deactivate after piercing limit reached', () => {
      const piercing = new Projectile({ ...basicConfig, piercing: 2 });
      piercing.pierce();
      expect(piercing.active).toBe(true);

      piercing.pierce();
      expect(piercing.active).toBe(false);
    });

    test('should handle multiple pierce hits', () => {
      const piercing = new Projectile({ ...basicConfig, piercing: 5 });

      for (let i = 0; i < 5; i++) {
        expect(piercing.canPierce()).toBe(true);
        piercing.pierce();
      }

      expect(piercing.canPierce()).toBe(false);
      expect(piercing.active).toBe(false);
    });

    test('should not be able to pierce after limit', () => {
      const piercing = new Projectile({ ...basicConfig, piercing: 1 });
      piercing.pierce();
      expect(piercing.canPierce()).toBe(false);
    });
  });

  describe('Deactivation', () => {
    test('should deactivate when called', () => {
      projectile.deactivate();
      expect(projectile.active).toBe(false);
    });

    test('should stay deactivated', () => {
      projectile.deactivate();
      projectile.update(0.1);
      expect(projectile.active).toBe(false);
    });
  });

  describe('Reset for Pooling', () => {
    test('should reset position', () => {
      projectile.update(1.0);
      projectile.reset({ ...basicConfig, x: 300, y: 400 });

      expect(projectile.x).toBe(300);
      expect(projectile.y).toBe(400);
    });

    test('should reset velocity', () => {
      projectile.reset({
        ...basicConfig,
        angle: Math.PI // Opposite direction
      });

      expect(projectile.vx).toBeCloseTo(-500, 1);
      expect(projectile.vy).toBeCloseTo(0, 1);
    });

    test('should reset age', () => {
      projectile.update(1.5);
      projectile.reset(basicConfig);
      expect(projectile.age).toBe(0);
    });

    test('should reset pierced count', () => {
      const piercing = new Projectile({ ...basicConfig, piercing: 3 });
      piercing.pierce();
      piercing.pierce();
      piercing.reset({ ...basicConfig, piercing: 3 });

      expect(piercing.piercedCount).toBe(0);
    });

    test('should reactivate', () => {
      projectile.deactivate();
      projectile.reset(basicConfig);
      expect(projectile.active).toBe(true);
    });

    test('should generate new ID on reset', () => {
      const oldId = projectile.id;
      projectile.reset(basicConfig);
      expect(projectile.id).not.toBe(oldId);
    });
  });

  describe('Rendering', () => {
    test('should have render method', () => {
      expect(typeof projectile.render).toBe('function');
    });

    test('should render without errors', () => {
      const canvas = (global as any).createMockCanvas();
      const ctx = canvas.getContext('2d')!;

      expect(() => projectile.render(ctx)).not.toThrow();
    });

    test('should call canvas methods during render', () => {
      const canvas = (global as any).createMockCanvas();
      const ctx = canvas.getContext('2d')!;

      projectile.render(ctx);

      expect(ctx.save).toHaveBeenCalled();
      expect(ctx.restore).toHaveBeenCalled();
      expect(ctx.beginPath).toHaveBeenCalled();
      expect(ctx.arc).toHaveBeenCalled();
      expect(ctx.fill).toHaveBeenCalled();
      expect(ctx.stroke).toHaveBeenCalled(); // Trail
    });
  });
});

describe('ProjectilePool', () => {
  let pool: ProjectilePool;
  const config: ProjectileConfig = {
    x: 100,
    y: 100,
    angle: 0,
    speed: 500,
    damage: 10,
    color: '#ff0000',
    radius: 5
  };

  beforeEach(() => {
    pool = new ProjectilePool();
  });

  describe('Basic Pooling', () => {
    test('should create new projectile when pool is empty', () => {
      const proj = pool.get(config);
      expect(proj).toBeDefined();
      expect(proj.active).toBe(true);
    });

    test('should add projectile to active list', () => {
      pool.get(config);
      expect(pool.getActive().length).toBe(1);
    });

    test('should reuse projectile from pool', () => {
      const proj1 = pool.get(config);
      proj1.deactivate();
      pool.update(0);

      const proj2 = pool.get(config);
      // Should reuse the same object
      expect(proj2).toBe(proj1);
    });

    test('should reset projectile when reusing', () => {
      const proj1 = pool.get(config);
      proj1.update(1.0);
      proj1.deactivate();
      pool.update(0);

      const proj2 = pool.get({ ...config, x: 500 });
      expect(proj2.x).toBe(500);
      expect(proj2.age).toBe(0);
      expect(proj2.active).toBe(true);
    });
  });

  describe('Active Projectiles', () => {
    test('should track multiple active projectiles', () => {
      pool.get(config);
      pool.get(config);
      pool.get(config);

      expect(pool.getActive().length).toBe(3);
    });

    test('should update all active projectiles', () => {
      const proj1 = pool.get(config);
      const proj2 = pool.get({ ...config, x: 200 });

      pool.update(0.1);

      expect(proj1.age).toBeCloseTo(0.1, 2);
      expect(proj2.age).toBeCloseTo(0.1, 2);
    });

    test('should move inactive projectiles to pool', () => {
      const proj = pool.get({ ...config, lifetime: 0.1 });
      expect(pool.getActive().length).toBe(1);

      pool.update(0.2); // Expires projectile
      expect(pool.getActive().length).toBe(0);
    });

    test('should handle mixed active and inactive projectiles', () => {
      const proj1 = pool.get({ ...config, lifetime: 0.1 });
      const proj2 = pool.get({ ...config, lifetime: 1.0 });
      const proj3 = pool.get({ ...config, lifetime: 0.1 });

      pool.update(0.15);

      expect(pool.getActive().length).toBe(1);
      expect(pool.getActive()[0]).toBe(proj2);
    });
  });

  describe('Update Behavior', () => {
    test('should handle empty active list', () => {
      expect(() => pool.update(0.1)).not.toThrow();
    });

    test('should properly remove projectiles in update', () => {
      pool.get({ ...config, lifetime: 0.1 });
      pool.get({ ...config, lifetime: 0.2 });
      pool.get({ ...config, lifetime: 0.3 });

      pool.update(0.15);
      expect(pool.getActive().length).toBe(2);

      pool.update(0.1);
      expect(pool.getActive().length).toBe(1);

      pool.update(0.1);
      expect(pool.getActive().length).toBe(0);
    });

    test('should not break when all projectiles deactivate', () => {
      pool.get({ ...config, lifetime: 0.1 });
      pool.get({ ...config, lifetime: 0.1 });

      pool.update(0.2);
      expect(pool.getActive().length).toBe(0);
    });
  });

  describe('Pool Reuse', () => {
    test('should build up pool over time', () => {
      // Create and deactivate many projectiles
      for (let i = 0; i < 10; i++) {
        pool.get({ ...config, lifetime: 0.1 });
      }

      pool.update(0.2);
      expect(pool.getActive().length).toBe(0);

      // Now get more - should reuse
      for (let i = 0; i < 5; i++) {
        pool.get(config);
      }

      expect(pool.getActive().length).toBe(5);
    });

    test('should maintain pool efficiency', () => {
      // First batch
      for (let i = 0; i < 100; i++) {
        pool.get({ ...config, lifetime: 0.05 });
      }
      pool.update(0.1);

      // Second batch - all should be reused
      for (let i = 0; i < 100; i++) {
        pool.get(config);
      }

      expect(pool.getActive().length).toBe(100);
    });
  });

  describe('Clear', () => {
    test('should clear all active projectiles', () => {
      pool.get(config);
      pool.get(config);
      pool.get(config);

      pool.clear();
      expect(pool.getActive().length).toBe(0);
    });

    test('should move active projectiles to pool', () => {
      pool.get(config);
      pool.get(config);

      pool.clear();

      // Should be able to reuse
      const proj = pool.get(config);
      expect(proj).toBeDefined();
    });

    test('should handle clearing empty pool', () => {
      expect(() => pool.clear()).not.toThrow();
    });

    test('should allow normal operation after clear', () => {
      pool.get(config);
      pool.clear();

      pool.get(config);
      expect(pool.getActive().length).toBe(1);
    });
  });

  describe('Performance', () => {
    test('should handle large number of projectiles', () => {
      for (let i = 0; i < 1000; i++) {
        pool.get(config);
      }

      expect(pool.getActive().length).toBe(1000);
    });

    test('should efficiently cycle projectiles', () => {
      // Simulate continuous spawning and expiring
      for (let frame = 0; frame < 100; frame++) {
        pool.get({ ...config, lifetime: 0.5 });
        pool.update(0.016); // ~60fps
      }

      // Should have stable number of active projectiles
      expect(pool.getActive().length).toBeGreaterThan(0);
      expect(pool.getActive().length).toBeLessThan(100);
    });
  });

  describe('Edge Cases', () => {
    test('should handle zero deltaTime', () => {
      const proj = pool.get(config);
      pool.update(0);
      expect(proj.age).toBe(0);
    });

    test('should handle negative positions', () => {
      const proj = pool.get({ ...config, x: -100, y: -100 });
      expect(proj.x).toBe(-100);
      expect(proj.y).toBe(-100);
    });

    test('should handle very large deltaTime', () => {
      pool.get({ ...config, lifetime: 1.0 });
      pool.update(10.0);
      expect(pool.getActive().length).toBe(0);
    });

    test('should handle rapid get/clear cycles', () => {
      for (let i = 0; i < 10; i++) {
        pool.get(config);
        pool.clear();
      }

      expect(pool.getActive().length).toBe(0);
    });
  });
});
