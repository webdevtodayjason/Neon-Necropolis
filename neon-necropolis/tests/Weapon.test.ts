/**
 * Weapon class tests
 * Tests weapon firing, cooldowns, upgrades, and projectile generation
 */
import { Weapon, WeaponStats } from '../src/game/Weapon';
import { ProjectilePool } from '../src/game/Projectile';

describe('Weapon', () => {
  let weapon: Weapon;
  let projectilePool: ProjectilePool;
  const basicWeaponStats: WeaponStats = {
    name: 'Test Gun',
    damage: 10,
    fireRate: 2, // 2 shots per second
    projectileSpeed: 500,
    projectileCount: 1,
    piercing: 0,
    spread: 0,
    color: '#ff0000',
    projectileRadius: 5,
    range: 1000
  };

  beforeEach(() => {
    weapon = new Weapon(basicWeaponStats);
    projectilePool = new ProjectilePool();
  });

  describe('Initialization', () => {
    test('should initialize with correct stats', () => {
      expect(weapon.name).toBe('Test Gun');
      expect(weapon.damage).toBe(10);
      expect(weapon.fireRate).toBe(2);
      expect(weapon.projectileSpeed).toBe(500);
      expect(weapon.projectileCount).toBe(1);
      expect(weapon.piercing).toBe(0);
      expect(weapon.spread).toBe(0);
      expect(weapon.color).toBe('#ff0000');
      expect(weapon.projectileRadius).toBe(5);
      expect(weapon.range).toBe(1000);
    });

    test('should default range to 1000 if not specified', () => {
      const stats = { ...basicWeaponStats };
      delete stats.range;
      const newWeapon = new Weapon(stats);
      expect(newWeapon.range).toBe(1000);
    });

    test('should start at level 1', () => {
      expect(weapon.level).toBe(1);
    });

    test('should start with zero cooldown', () => {
      expect(weapon.cooldown).toBe(0);
    });

    test('should preserve special property', () => {
      const specialStats = { ...basicWeaponStats, special: 'explosive' };
      const specialWeapon = new Weapon(specialStats);
      expect(specialWeapon.special).toBe('explosive');
    });
  });

  describe('Cooldown System', () => {
    test('should be able to fire initially', () => {
      expect(weapon.canFire()).toBe(true);
    });

    test('should set cooldown after firing', () => {
      weapon.fire(100, 100, 200, 200, projectilePool);
      expect(weapon.cooldown).toBeGreaterThan(0);
      expect(weapon.cooldown).toBeCloseTo(0.5, 2); // 1 / fireRate = 1/2 = 0.5
    });

    test('should not be able to fire during cooldown', () => {
      weapon.fire(100, 100, 200, 200, projectilePool);
      expect(weapon.canFire()).toBe(false);
    });

    test('should reduce cooldown over time', () => {
      weapon.fire(100, 100, 200, 200, projectilePool);
      const initialCooldown = weapon.cooldown;

      weapon.update(0.1);
      expect(weapon.cooldown).toBeLessThan(initialCooldown);
    });

    test('should be able to fire after cooldown expires', () => {
      weapon.fire(100, 100, 200, 200, projectilePool);
      weapon.update(0.6); // More than cooldown duration
      expect(weapon.canFire()).toBe(true);
    });

    test('should not reduce cooldown below zero', () => {
      weapon.cooldown = 0.1;
      weapon.update(1.0);
      expect(weapon.cooldown).toBeLessThanOrEqual(0);
    });

    test('should handle fast fire rate correctly', () => {
      const fastWeapon = new Weapon({ ...basicWeaponStats, fireRate: 10 });
      fastWeapon.fire(100, 100, 200, 200, projectilePool);
      expect(fastWeapon.cooldown).toBeCloseTo(0.1, 2);
    });

    test('should handle slow fire rate correctly', () => {
      const slowWeapon = new Weapon({ ...basicWeaponStats, fireRate: 0.5 });
      slowWeapon.fire(100, 100, 200, 200, projectilePool);
      expect(slowWeapon.cooldown).toBeCloseTo(2.0, 2);
    });
  });

  describe('Firing', () => {
    test('should create projectile when firing', () => {
      const projectiles = weapon.fire(100, 100, 200, 200, projectilePool);
      expect(projectiles.length).toBe(1);
    });

    test('should not create projectile when on cooldown', () => {
      weapon.fire(100, 100, 200, 200, projectilePool);
      const projectiles = weapon.fire(100, 100, 200, 200, projectilePool);
      expect(projectiles.length).toBe(0);
    });

    test('should fire projectile towards target', () => {
      const projectiles = weapon.fire(100, 100, 200, 100, projectilePool);
      const projectile = projectiles[0];

      expect(projectile.x).toBe(100);
      expect(projectile.y).toBe(100);
      expect(projectile.vx).toBeGreaterThan(0); // Moving right
      expect(Math.abs(projectile.vy)).toBeLessThan(1); // Minimal vertical movement
    });

    test('should create projectile with correct damage', () => {
      const projectiles = weapon.fire(100, 100, 200, 200, projectilePool);
      expect(projectiles[0].damage).toBe(weapon.damage);
    });

    test('should create projectile with correct speed', () => {
      const projectiles = weapon.fire(100, 100, 200, 200, projectilePool);
      const speed = Math.sqrt(projectiles[0].vx ** 2 + projectiles[0].vy ** 2);
      expect(speed).toBeCloseTo(weapon.projectileSpeed, 0);
    });

    test('should create projectile with correct color', () => {
      const projectiles = weapon.fire(100, 100, 200, 200, projectilePool);
      expect(projectiles[0].color).toBe(weapon.color);
    });

    test('should create projectile with correct piercing', () => {
      const piercingWeapon = new Weapon({ ...basicWeaponStats, piercing: 3 });
      const projectiles = piercingWeapon.fire(100, 100, 200, 200, projectilePool);
      expect(projectiles[0].piercing).toBe(3);
    });

    test('should calculate projectile lifetime from range and speed', () => {
      const projectiles = weapon.fire(100, 100, 200, 200, projectilePool);
      const expectedLifetime = weapon.range / weapon.projectileSpeed;
      expect(projectiles[0].lifetime).toBeCloseTo(expectedLifetime, 2);
    });
  });

  describe('Multi-Projectile Weapons', () => {
    let multiWeapon: Weapon;

    beforeEach(() => {
      multiWeapon = new Weapon({
        ...basicWeaponStats,
        projectileCount: 3,
        spread: Math.PI / 6 // 30 degrees
      });
    });

    test('should create multiple projectiles', () => {
      const projectiles = multiWeapon.fire(100, 100, 200, 200, projectilePool);
      expect(projectiles.length).toBe(3);
    });

    test('should spread projectiles at different angles', () => {
      const projectiles = multiWeapon.fire(100, 100, 200, 100, projectilePool);

      // Get angles of each projectile
      const angles = projectiles.map(p => Math.atan2(p.vy, p.vx));

      // All angles should be different
      expect(angles[0]).not.toBe(angles[1]);
      expect(angles[1]).not.toBe(angles[2]);
    });

    test('should maintain correct speed for all projectiles', () => {
      const projectiles = multiWeapon.fire(100, 100, 200, 200, projectilePool);

      projectiles.forEach(p => {
        const speed = Math.sqrt(p.vx ** 2 + p.vy ** 2);
        expect(speed).toBeCloseTo(multiWeapon.projectileSpeed, 0);
      });
    });

    test('should apply same damage to all projectiles', () => {
      const projectiles = multiWeapon.fire(100, 100, 200, 200, projectilePool);

      projectiles.forEach(p => {
        expect(p.damage).toBe(multiWeapon.damage);
      });
    });
  });

  describe('Spread Mechanics', () => {
    test('should apply random spread for single projectile with spread', () => {
      const spreadWeapon = new Weapon({
        ...basicWeaponStats,
        projectileCount: 1,
        spread: Math.PI / 4
      });

      // Fire multiple times and check for variation
      const angles: number[] = [];
      for (let i = 0; i < 10; i++) {
        spreadWeapon.cooldown = 0; // Reset cooldown
        const projectiles = spreadWeapon.fire(100, 100, 200, 100, projectilePool);
        angles.push(Math.atan2(projectiles[0].vy, projectiles[0].vx));
      }

      // At least some angles should be different (not all identical)
      const uniqueAngles = new Set(angles.map(a => a.toFixed(3)));
      expect(uniqueAngles.size).toBeGreaterThan(1);
    });

    test('should not apply spread when spread is zero', () => {
      const projectiles = weapon.fire(100, 100, 200, 100, projectilePool);
      const angle = Math.atan2(projectiles[0].vy, projectiles[0].vx);

      weapon.cooldown = 0;
      const projectiles2 = weapon.fire(100, 100, 200, 100, projectilePool);
      const angle2 = Math.atan2(projectiles2[0].vy, projectiles2[0].vx);

      expect(angle).toBeCloseTo(angle2, 5);
    });
  });

  describe('Upgrade System', () => {
    test('should increase level when upgraded', () => {
      weapon.upgrade('damage');
      expect(weapon.level).toBe(2);
    });

    test('should increase damage by 20% when upgraded with damage', () => {
      const initialDamage = weapon.damage;
      weapon.upgrade('damage');
      expect(weapon.damage).toBeCloseTo(initialDamage * 1.2, 2);
    });

    test('should increase fire rate by 15% when upgraded with fireRate', () => {
      const initialFireRate = weapon.fireRate;
      weapon.upgrade('fireRate');
      expect(weapon.fireRate).toBeCloseTo(initialFireRate * 1.15, 2);
    });

    test('should increase projectile count by 1 when upgraded with projectiles', () => {
      const initialCount = weapon.projectileCount;
      weapon.upgrade('projectiles');
      expect(weapon.projectileCount).toBe(initialCount + 1);
    });

    test('should allow multiple upgrades', () => {
      weapon.upgrade('damage');
      weapon.upgrade('fireRate');
      weapon.upgrade('projectiles');

      expect(weapon.level).toBe(4);
      expect(weapon.damage).toBeCloseTo(12, 2);
      expect(weapon.fireRate).toBeCloseTo(2.3, 2);
      expect(weapon.projectileCount).toBe(2);
    });

    test('should compound damage upgrades', () => {
      const initial = weapon.damage;
      weapon.upgrade('damage');
      weapon.upgrade('damage');

      // Should be 1.2 * 1.2 = 1.44x
      expect(weapon.damage).toBeCloseTo(initial * 1.44, 2);
    });
  });

  describe('Weapon Info', () => {
    test('should generate info string', () => {
      const info = weapon.getInfo();
      expect(info).toContain('Test Gun');
      expect(info).toContain('Lv.1');
      expect(info).toContain('DMG');
      expect(info).toContain('Rate');
      expect(info).toContain('Count');
    });

    test('should update info after upgrade', () => {
      weapon.upgrade('damage');
      const info = weapon.getInfo();
      expect(info).toContain('Lv.2');
    });

    test('should format numbers correctly', () => {
      weapon.damage = 15.6789;
      weapon.fireRate = 2.3456;
      const info = weapon.getInfo();

      expect(info).toContain('16'); // Damage rounded
      expect(info).toContain('2.3'); // Fire rate to 1 decimal
    });
  });

  describe('Edge Cases', () => {
    test('should handle firing at same position as weapon', () => {
      const projectiles = weapon.fire(100, 100, 100, 100, projectilePool);
      expect(projectiles.length).toBeGreaterThan(0);
      // Projectile should still be created, velocity might be arbitrary
    });

    test('should handle very high fire rate', () => {
      const rapidWeapon = new Weapon({ ...basicWeaponStats, fireRate: 100 });
      rapidWeapon.fire(100, 100, 200, 200, projectilePool);
      expect(rapidWeapon.cooldown).toBeCloseTo(0.01, 3);
    });

    test('should handle very low fire rate', () => {
      const slowWeapon = new Weapon({ ...basicWeaponStats, fireRate: 0.1 });
      slowWeapon.fire(100, 100, 200, 200, projectilePool);
      expect(slowWeapon.cooldown).toBeCloseTo(10, 1);
    });

    test('should handle zero spread with multiple projectiles', () => {
      const multiWeapon = new Weapon({
        ...basicWeaponStats,
        projectileCount: 3,
        spread: 0
      });

      const projectiles = multiWeapon.fire(100, 100, 200, 100, projectilePool);

      // All projectiles should be at same angle when spread is 0
      const angles = projectiles.map(p => Math.atan2(p.vy, p.vx));
      expect(angles[0]).toBeCloseTo(angles[1], 5);
      expect(angles[1]).toBeCloseTo(angles[2], 5);
    });

    test('should handle very small delta time in update', () => {
      weapon.cooldown = 0.5;
      weapon.update(0.001);
      expect(weapon.cooldown).toBeCloseTo(0.499, 3);
    });

    test('should handle projectile pool reuse', () => {
      // Fire, wait, fire again to test pool reuse
      weapon.fire(100, 100, 200, 200, projectilePool);
      weapon.update(1.0); // Wait for cooldown

      const projectiles = weapon.fire(100, 100, 200, 200, projectilePool);
      expect(projectiles.length).toBe(1);
    });
  });

  describe('Weapon Types Integration', () => {
    test('should support various projectile configurations', () => {
      const configs = [
        { projectileCount: 1, spread: 0 },
        { projectileCount: 3, spread: Math.PI / 4 },
        { projectileCount: 5, spread: Math.PI / 2 },
        { projectileCount: 1, spread: Math.PI / 6 }
      ];

      configs.forEach(config => {
        const testWeapon = new Weapon({ ...basicWeaponStats, ...config });
        const projectiles = testWeapon.fire(100, 100, 200, 200, projectilePool);
        expect(projectiles.length).toBe(config.projectileCount);
      });
    });
  });
});
