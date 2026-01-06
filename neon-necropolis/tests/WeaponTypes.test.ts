/**
 * WeaponTypes tests
 * Tests weapon type definitions, configurations, and helper functions
 */
import { WEAPON_TYPES, getWeaponStats, getAllWeaponNames, getRandomWeaponName } from '../src/game/WeaponTypes';
import { WeaponStats } from '../src/game/Weapon';

describe('WeaponTypes', () => {
  describe('WEAPON_TYPES Definition', () => {
    test('should have all 10 weapon types defined', () => {
      const expectedTypes = [
        'PISTOL', 'SHOTGUN', 'LASER', 'ORBITAL', 'LIGHTNING',
        'MISSILES', 'FLAMETHROWER', 'TESLA', 'ICE', 'POISON'
      ];

      expectedTypes.forEach(type => {
        expect(WEAPON_TYPES[type]).toBeDefined();
      });

      expect(Object.keys(WEAPON_TYPES).length).toBe(10);
    });

    test('all weapon types should have required properties', () => {
      Object.values(WEAPON_TYPES).forEach((stats: WeaponStats) => {
        expect(stats.name).toBeDefined();
        expect(stats.damage).toBeDefined();
        expect(stats.fireRate).toBeDefined();
        expect(stats.projectileSpeed).toBeDefined();
        expect(stats.projectileCount).toBeDefined();
        expect(stats.piercing).toBeDefined();
        expect(stats.spread).toBeDefined();
        expect(stats.color).toBeDefined();
        expect(stats.projectileRadius).toBeDefined();
      });
    });

    test('all weapon types should have positive numeric stats', () => {
      Object.values(WEAPON_TYPES).forEach((stats: WeaponStats) => {
        expect(stats.damage).toBeGreaterThan(0);
        expect(stats.fireRate).toBeGreaterThan(0);
        expect(stats.projectileSpeed).toBeGreaterThan(0);
        expect(stats.projectileCount).toBeGreaterThan(0);
        expect(stats.piercing).toBeGreaterThanOrEqual(0);
        expect(stats.spread).toBeGreaterThanOrEqual(0);
        expect(stats.projectileRadius).toBeGreaterThan(0);
      });
    });

    test('all weapon types should have valid hex colors', () => {
      const hexColorRegex = /^#[0-9a-fA-F]{3}(?:[0-9a-fA-F]{3})?$/;

      Object.values(WEAPON_TYPES).forEach((stats: WeaponStats) => {
        expect(stats.color).toMatch(hexColorRegex);
      });
    });
  });

  describe('PISTOL Type', () => {
    test('should have correct stats', () => {
      const pistol = WEAPON_TYPES.PISTOL;
      expect(pistol.name).toBe('Pistol');
      expect(pistol.damage).toBe(10);
      expect(pistol.fireRate).toBe(3);
      expect(pistol.projectileSpeed).toBe(400);
      expect(pistol.projectileCount).toBe(1);
      expect(pistol.piercing).toBe(0);
      expect(pistol.spread).toBe(0);
      expect(pistol.color).toBe('#fff');
      expect(pistol.projectileRadius).toBe(4);
    });

    test('should be basic starter weapon', () => {
      const pistol = WEAPON_TYPES.PISTOL;
      expect(pistol.special).toBeUndefined();
      expect(pistol.range).toBeUndefined();
    });
  });

  describe('SHOTGUN Type', () => {
    test('should have correct stats', () => {
      const shotgun = WEAPON_TYPES.SHOTGUN;
      expect(shotgun.name).toBe('Shotgun');
      expect(shotgun.damage).toBe(8);
      expect(shotgun.fireRate).toBe(1.5);
      expect(shotgun.projectileSpeed).toBe(350);
      expect(shotgun.projectileCount).toBe(5);
      expect(shotgun.piercing).toBe(0);
      expect(shotgun.spread).toBe(Math.PI / 6);
      expect(shotgun.color).toBe('#f80');
      expect(shotgun.projectileRadius).toBe(5);
    });

    test('should have multiple projectiles with spread', () => {
      const shotgun = WEAPON_TYPES.SHOTGUN;
      expect(shotgun.projectileCount).toBeGreaterThan(1);
      expect(shotgun.spread).toBeGreaterThan(0);
    });
  });

  describe('LASER Type', () => {
    test('should have correct stats', () => {
      const laser = WEAPON_TYPES.LASER;
      expect(laser.name).toBe('Laser');
      expect(laser.damage).toBe(15);
      expect(laser.fireRate).toBe(5);
      expect(laser.projectileSpeed).toBe(600);
      expect(laser.projectileCount).toBe(1);
      expect(laser.piercing).toBe(3);
      expect(laser.spread).toBe(0);
      expect(laser.color).toBe('#f00');
      expect(laser.projectileRadius).toBe(3);
    });

    test('should have piercing capability', () => {
      const laser = WEAPON_TYPES.LASER;
      expect(laser.piercing).toBeGreaterThan(0);
    });

    test('should be fast firing', () => {
      const laser = WEAPON_TYPES.LASER;
      expect(laser.fireRate).toBeGreaterThan(WEAPON_TYPES.PISTOL.fireRate);
    });
  });

  describe('ORBITAL Type', () => {
    test('should have correct stats', () => {
      const orbital = WEAPON_TYPES.ORBITAL;
      expect(orbital.name).toBe('Orbital');
      expect(orbital.damage).toBe(25);
      expect(orbital.fireRate).toBe(2);
      expect(orbital.projectileSpeed).toBe(300);
      expect(orbital.projectileCount).toBe(3);
      expect(orbital.piercing).toBe(1);
      expect(orbital.spread).toBe(Math.PI * 2 / 3);
      expect(orbital.color).toBe('#0ff');
      expect(orbital.projectileRadius).toBe(6);
    });

    test('should have orbital special ability', () => {
      const orbital = WEAPON_TYPES.ORBITAL;
      expect(orbital.special).toBe('orbital');
    });
  });

  describe('LIGHTNING Type', () => {
    test('should have correct stats', () => {
      const lightning = WEAPON_TYPES.LIGHTNING;
      expect(lightning.name).toBe('Lightning');
      expect(lightning.damage).toBe(20);
      expect(lightning.fireRate).toBe(4);
      expect(lightning.projectileSpeed).toBe(500);
      expect(lightning.projectileCount).toBe(1);
      expect(lightning.piercing).toBe(5);
      expect(lightning.spread).toBe(0);
      expect(lightning.color).toBe('#ff0');
      expect(lightning.projectileRadius).toBe(4);
    });

    test('should have chain special ability', () => {
      const lightning = WEAPON_TYPES.LIGHTNING;
      expect(lightning.special).toBe('chain');
    });

    test('should have high piercing', () => {
      const lightning = WEAPON_TYPES.LIGHTNING;
      expect(lightning.piercing).toBeGreaterThan(3);
    });
  });

  describe('MISSILES Type', () => {
    test('should have correct stats', () => {
      const missiles = WEAPON_TYPES.MISSILES;
      expect(missiles.name).toBe('Missiles');
      expect(missiles.damage).toBe(40);
      expect(missiles.fireRate).toBe(1);
      expect(missiles.projectileSpeed).toBe(250);
      expect(missiles.projectileCount).toBe(2);
      expect(missiles.piercing).toBe(0);
      expect(missiles.spread).toBe(Math.PI / 8);
      expect(missiles.color).toBe('#f0f');
      expect(missiles.projectileRadius).toBe(7);
    });

    test('should have explosive special ability', () => {
      const missiles = WEAPON_TYPES.MISSILES;
      expect(missiles.special).toBe('explosive');
    });

    test('should have high damage', () => {
      const missiles = WEAPON_TYPES.MISSILES;
      expect(missiles.damage).toBeGreaterThan(WEAPON_TYPES.PISTOL.damage * 2);
    });
  });

  describe('FLAMETHROWER Type', () => {
    test('should have correct stats', () => {
      const flamethrower = WEAPON_TYPES.FLAMETHROWER;
      expect(flamethrower.name).toBe('Flamethrower');
      expect(flamethrower.damage).toBe(5);
      expect(flamethrower.fireRate).toBe(10);
      expect(flamethrower.projectileSpeed).toBe(200);
      expect(flamethrower.projectileCount).toBe(3);
      expect(flamethrower.piercing).toBe(2);
      expect(flamethrower.spread).toBe(Math.PI / 4);
      expect(flamethrower.color).toBe('#f50');
      expect(flamethrower.projectileRadius).toBe(6);
    });

    test('should have limited range', () => {
      const flamethrower = WEAPON_TYPES.FLAMETHROWER;
      expect(flamethrower.range).toBe(300);
    });

    test('should have dot special ability', () => {
      const flamethrower = WEAPON_TYPES.FLAMETHROWER;
      expect(flamethrower.special).toBe('dot');
    });

    test('should be very fast firing', () => {
      const flamethrower = WEAPON_TYPES.FLAMETHROWER;
      expect(flamethrower.fireRate).toBe(10);
    });
  });

  describe('TESLA Type', () => {
    test('should have correct stats', () => {
      const tesla = WEAPON_TYPES.TESLA;
      expect(tesla.name).toBe('Tesla');
      expect(tesla.damage).toBe(30);
      expect(tesla.fireRate).toBe(2);
      expect(tesla.projectileSpeed).toBe(400);
      expect(tesla.projectileCount).toBe(1);
      expect(tesla.piercing).toBe(8);
      expect(tesla.spread).toBe(0);
      expect(tesla.color).toBe('#08f');
      expect(tesla.projectileRadius).toBe(5);
    });

    test('should have aoe special ability', () => {
      const tesla = WEAPON_TYPES.TESLA;
      expect(tesla.special).toBe('aoe');
    });

    test('should have very high piercing', () => {
      const tesla = WEAPON_TYPES.TESLA;
      expect(tesla.piercing).toBeGreaterThan(5);
    });
  });

  describe('ICE Type', () => {
    test('should have correct stats', () => {
      const ice = WEAPON_TYPES.ICE;
      expect(ice.name).toBe('Ice');
      expect(ice.damage).toBe(12);
      expect(ice.fireRate).toBe(3);
      expect(ice.projectileSpeed).toBe(350);
      expect(ice.projectileCount).toBe(1);
      expect(ice.piercing).toBe(1);
      expect(ice.spread).toBe(0);
      expect(ice.color).toBe('#0af');
      expect(ice.projectileRadius).toBe(5);
    });

    test('should have slow special ability', () => {
      const ice = WEAPON_TYPES.ICE;
      expect(ice.special).toBe('slow');
    });
  });

  describe('POISON Type', () => {
    test('should have correct stats', () => {
      const poison = WEAPON_TYPES.POISON;
      expect(poison.name).toBe('Poison');
      expect(poison.damage).toBe(8);
      expect(poison.fireRate).toBe(4);
      expect(poison.projectileSpeed).toBe(300);
      expect(poison.projectileCount).toBe(2);
      expect(poison.piercing).toBe(2);
      expect(poison.spread).toBe(Math.PI / 12);
      expect(poison.color).toBe('#0f0');
      expect(poison.projectileRadius).toBe(4);
    });

    test('should have poison special ability', () => {
      const poison = WEAPON_TYPES.POISON;
      expect(poison.special).toBe('poison');
    });
  });

  describe('getWeaponStats', () => {
    test('should return correct stats for valid weapon type', () => {
      const stats = getWeaponStats('PISTOL');
      expect(stats).toBe(WEAPON_TYPES.PISTOL);
    });

    test('should return stats for all weapon types', () => {
      const types = ['PISTOL', 'SHOTGUN', 'LASER', 'ORBITAL', 'LIGHTNING',
                    'MISSILES', 'FLAMETHROWER', 'TESLA', 'ICE', 'POISON'];

      types.forEach(type => {
        const stats = getWeaponStats(type);
        expect(stats).toBe(WEAPON_TYPES[type]);
      });
    });

    test('should return PISTOL for invalid type', () => {
      const stats = getWeaponStats('INVALID_WEAPON');
      expect(stats).toBe(WEAPON_TYPES.PISTOL);
    });

    test('should return PISTOL for empty string', () => {
      const stats = getWeaponStats('');
      expect(stats).toBe(WEAPON_TYPES.PISTOL);
    });

    test('should handle case sensitivity', () => {
      const stats = getWeaponStats('pistol');
      // Function is case-sensitive, should return default
      expect(stats).toBe(WEAPON_TYPES.PISTOL);
    });
  });

  describe('getAllWeaponNames', () => {
    test('should return all weapon type names', () => {
      const names = getAllWeaponNames();
      expect(names).toHaveLength(10);
    });

    test('should include all expected weapon names', () => {
      const names = getAllWeaponNames();
      const expectedNames = ['PISTOL', 'SHOTGUN', 'LASER', 'ORBITAL', 'LIGHTNING',
                            'MISSILES', 'FLAMETHROWER', 'TESLA', 'ICE', 'POISON'];

      expectedNames.forEach(name => {
        expect(names).toContain(name);
      });
    });

    test('should return array', () => {
      const names = getAllWeaponNames();
      expect(Array.isArray(names)).toBe(true);
    });

    test('should not be empty', () => {
      const names = getAllWeaponNames();
      expect(names.length).toBeGreaterThan(0);
    });
  });

  describe('getRandomWeaponName', () => {
    test('should return a valid weapon name', () => {
      const name = getRandomWeaponName();
      expect(getAllWeaponNames()).toContain(name);
    });

    test('should return different weapons over multiple calls', () => {
      const weapons = new Set<string>();

      for (let i = 0; i < 50; i++) {
        weapons.add(getRandomWeaponName());
      }

      // Should have gotten multiple different weapons
      expect(weapons.size).toBeGreaterThan(1);
    });

    test('should exclude specified weapons', () => {
      const exclude = ['PISTOL', 'SHOTGUN'];

      for (let i = 0; i < 50; i++) {
        const name = getRandomWeaponName(exclude);
        expect(exclude).not.toContain(name);
      }
    });

    test('should handle excluding all but one weapon', () => {
      const exclude = ['PISTOL', 'SHOTGUN', 'LASER', 'ORBITAL', 'LIGHTNING',
                      'MISSILES', 'FLAMETHROWER', 'TESLA', 'ICE'];
      const name = getRandomWeaponName(exclude);

      expect(name).toBe('POISON');
    });

    test('should return PISTOL when all weapons excluded', () => {
      const allWeapons = getAllWeaponNames();
      const name = getRandomWeaponName(allWeapons);

      expect(name).toBe('PISTOL');
    });

    test('should handle empty exclude array', () => {
      const name = getRandomWeaponName([]);
      expect(getAllWeaponNames()).toContain(name);
    });

    test('should handle undefined exclude parameter', () => {
      const name = getRandomWeaponName();
      expect(getAllWeaponNames()).toContain(name);
    });
  });

  describe('Weapon Balance', () => {
    test('should have variety in damage values', () => {
      const damages = new Set<number>();

      Object.values(WEAPON_TYPES).forEach(weapon => {
        damages.add(weapon.damage);
      });

      expect(damages.size).toBeGreaterThan(5);
    });

    test('should have variety in fire rates', () => {
      const fireRates = new Set<number>();

      Object.values(WEAPON_TYPES).forEach(weapon => {
        fireRates.add(weapon.fireRate);
      });

      expect(fireRates.size).toBeGreaterThan(5);
    });

    test('should have variety in projectile counts', () => {
      const counts = new Set<number>();

      Object.values(WEAPON_TYPES).forEach(weapon => {
        counts.add(weapon.projectileCount);
      });

      expect(counts.size).toBeGreaterThan(2);
    });

    test('should have variety in piercing values', () => {
      const piercings = new Set<number>();

      Object.values(WEAPON_TYPES).forEach(weapon => {
        piercings.add(weapon.piercing);
      });

      expect(piercings.size).toBeGreaterThan(3);
    });

    test('highest damage weapons should have lower fire rate', () => {
      const highDamageWeapons = Object.values(WEAPON_TYPES)
        .filter(weapon => weapon.damage >= 30);

      highDamageWeapons.forEach(weapon => {
        expect(weapon.fireRate).toBeLessThan(5);
      });
    });

    test('fastest firing weapons should have lower damage', () => {
      const fastWeapons = Object.values(WEAPON_TYPES)
        .filter(weapon => weapon.fireRate >= 5);

      fastWeapons.forEach(weapon => {
        expect(weapon.damage).toBeLessThan(20);
      });
    });
  });

  describe('Special Abilities', () => {
    test('should have weapons with special abilities', () => {
      const weaponsWithSpecials = Object.values(WEAPON_TYPES)
        .filter(weapon => weapon.special !== undefined);

      expect(weaponsWithSpecials.length).toBeGreaterThan(0);
    });

    test('should have weapons without special abilities', () => {
      const weaponsWithoutSpecials = Object.values(WEAPON_TYPES)
        .filter(weapon => weapon.special === undefined);

      expect(weaponsWithoutSpecials.length).toBeGreaterThan(0);
    });

    test('special abilities should be unique strings', () => {
      const specials = new Set<string>();

      Object.values(WEAPON_TYPES).forEach(weapon => {
        if (weapon.special) {
          specials.add(weapon.special);
        }
      });

      expect(specials.size).toBeGreaterThan(3);
    });

    test('should have variety of special abilities', () => {
      const expectedSpecials = ['orbital', 'chain', 'explosive', 'dot', 'aoe', 'slow', 'poison'];
      const actualSpecials = new Set<string>();

      Object.values(WEAPON_TYPES).forEach(weapon => {
        if (weapon.special) {
          actualSpecials.add(weapon.special);
        }
      });

      expectedSpecials.forEach(special => {
        expect(actualSpecials.has(special)).toBe(true);
      });
    });
  });

  describe('Range Properties', () => {
    test('only FLAMETHROWER should have explicit range', () => {
      const weaponsWithRange = Object.values(WEAPON_TYPES)
        .filter(weapon => weapon.range !== undefined);

      expect(weaponsWithRange).toHaveLength(1);
      expect(weaponsWithRange[0].name).toBe('Flamethrower');
    });

    test('FLAMETHROWER range should be shorter', () => {
      const flamethrower = WEAPON_TYPES.FLAMETHROWER;
      expect(flamethrower.range).toBe(300);
      expect(flamethrower.range).toBeLessThan(1000); // Default range
    });
  });

  describe('Projectile Properties', () => {
    test('should have variety in projectile speeds', () => {
      const speeds = new Set<number>();

      Object.values(WEAPON_TYPES).forEach(weapon => {
        speeds.add(weapon.projectileSpeed);
      });

      expect(speeds.size).toBeGreaterThan(5);
    });

    test('should have variety in projectile sizes', () => {
      const sizes = new Set<number>();

      Object.values(WEAPON_TYPES).forEach(weapon => {
        sizes.add(weapon.projectileRadius);
      });

      expect(sizes.size).toBeGreaterThan(3);
    });

    test('slower projectiles should have higher damage', () => {
      const slowProjectiles = Object.values(WEAPON_TYPES)
        .filter(weapon => weapon.projectileSpeed < 300);

      slowProjectiles.forEach(weapon => {
        // FLAMETHROWER is an exception (fast firing, slow projectiles)
        if (weapon.name !== 'Flamethrower') {
          expect(weapon.damage).toBeGreaterThan(10);
        }
      });
    });
  });

  describe('Spread Mechanics', () => {
    test('should have weapons with spread', () => {
      const weaponsWithSpread = Object.values(WEAPON_TYPES)
        .filter(weapon => weapon.spread > 0);

      expect(weaponsWithSpread.length).toBeGreaterThan(0);
    });

    test('should have weapons without spread', () => {
      const weaponsWithoutSpread = Object.values(WEAPON_TYPES)
        .filter(weapon => weapon.spread === 0);

      expect(weaponsWithoutSpread.length).toBeGreaterThan(0);
    });

    test('multi-projectile weapons should generally have spread', () => {
      const multiProjectile = Object.values(WEAPON_TYPES)
        .filter(weapon => weapon.projectileCount > 2);

      const withSpread = multiProjectile.filter(weapon => weapon.spread > 0);

      expect(withSpread.length).toBeGreaterThan(0);
    });
  });

  describe('Color Variety', () => {
    test('should have unique colors for each weapon', () => {
      const colors = new Set<string>();

      Object.values(WEAPON_TYPES).forEach(weapon => {
        colors.add(weapon.color);
      });

      expect(colors.size).toBe(10); // All weapons should have unique colors
    });

    test('should use diverse color palette', () => {
      const colors = Object.values(WEAPON_TYPES).map(w => w.color);

      // Should have variety of colors
      expect(colors).toContain('#fff'); // White
      expect(colors).toContain('#f00'); // Red
      expect(colors).toContain('#0ff'); // Cyan
      expect(colors).toContain('#ff0'); // Yellow
      expect(colors).toContain('#f0f'); // Magenta
      expect(colors).toContain('#0f0'); // Green
    });
  });

  describe('Type Naming Consistency', () => {
    test('weapon names should be properly capitalized', () => {
      Object.values(WEAPON_TYPES).forEach(weapon => {
        // Name should start with capital letter
        expect(weapon.name[0]).toMatch(/[A-Z]/);
      });
    });

    test('weapon type keys should be uppercase', () => {
      Object.keys(WEAPON_TYPES).forEach(key => {
        expect(key).toBe(key.toUpperCase());
      });
    });
  });
});
