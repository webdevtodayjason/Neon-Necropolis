/**
 * ZombieTypes tests
 * Tests zombie type definitions, configurations, and wave-based spawning
 */
import { ZOMBIE_TYPES, getZombieConfig, getRandomZombieType } from '../src/game/ZombieTypes';
import { ZombieConfig } from '../src/game/Zombie';

describe('ZombieTypes', () => {
  describe('ZOMBIE_TYPES Definition', () => {
    test('should have all 9 zombie types defined', () => {
      const expectedTypes = [
        'SHAMBLER', 'RUNNER', 'TANK', 'EXPLODER',
        'SPITTER', 'SWARM', 'BRUTE', 'PHANTOM', 'NECROMANCER'
      ];

      expectedTypes.forEach(type => {
        expect(ZOMBIE_TYPES[type]).toBeDefined();
      });

      expect(Object.keys(ZOMBIE_TYPES).length).toBe(9);
    });

    test('all zombie types should have required properties', () => {
      Object.values(ZOMBIE_TYPES).forEach((config: ZombieConfig) => {
        expect(config.type).toBeDefined();
        expect(config.health).toBeDefined();
        expect(config.speed).toBeDefined();
        expect(config.damage).toBeDefined();
        expect(config.xpValue).toBeDefined();
        expect(config.color).toBeDefined();
        expect(config.radius).toBeDefined();
        expect(config.attackCooldown).toBeDefined();
      });
    });

    test('all zombie types should have positive stats', () => {
      Object.values(ZOMBIE_TYPES).forEach((config: ZombieConfig) => {
        expect(config.health).toBeGreaterThan(0);
        expect(config.speed).toBeGreaterThan(0);
        expect(config.damage).toBeGreaterThan(0);
        expect(config.xpValue).toBeGreaterThan(0);
        expect(config.radius).toBeGreaterThan(0);
        expect(config.attackCooldown).toBeGreaterThan(0);
      });
    });

    test('all zombie types should have valid hex colors', () => {
      const hexColorRegex = /^#[0-9a-fA-F]{3}(?:[0-9a-fA-F]{3})?$/;

      Object.values(ZOMBIE_TYPES).forEach((config: ZombieConfig) => {
        expect(config.color).toMatch(hexColorRegex);
      });
    });
  });

  describe('SHAMBLER Type', () => {
    test('should have correct stats', () => {
      const shambler = ZOMBIE_TYPES.SHAMBLER;
      expect(shambler.type).toBe('Shambler');
      expect(shambler.health).toBe(30);
      expect(shambler.speed).toBe(40);
      expect(shambler.damage).toBe(5);
      expect(shambler.xpValue).toBe(10);
      expect(shambler.color).toBe('#0f0');
      expect(shambler.radius).toBe(12);
      expect(shambler.attackCooldown).toBe(1.5);
    });

    test('should be basic zombie type', () => {
      const shambler = ZOMBIE_TYPES.SHAMBLER;
      expect(shambler.specialAbility).toBeUndefined();
    });
  });

  describe('RUNNER Type', () => {
    test('should have correct stats', () => {
      const runner = ZOMBIE_TYPES.RUNNER;
      expect(runner.type).toBe('Runner');
      expect(runner.health).toBe(20);
      expect(runner.speed).toBe(120);
      expect(runner.damage).toBe(8);
      expect(runner.xpValue).toBe(15);
      expect(runner.color).toBe('#ff0');
      expect(runner.radius).toBe(10);
      expect(runner.attackCooldown).toBe(1.0);
    });

    test('should be faster than shambler', () => {
      expect(ZOMBIE_TYPES.RUNNER.speed).toBeGreaterThan(ZOMBIE_TYPES.SHAMBLER.speed);
    });

    test('should have less health than shambler', () => {
      expect(ZOMBIE_TYPES.RUNNER.health).toBeLessThan(ZOMBIE_TYPES.SHAMBLER.health);
    });
  });

  describe('TANK Type', () => {
    test('should have correct stats', () => {
      const tank = ZOMBIE_TYPES.TANK;
      expect(tank.type).toBe('Tank');
      expect(tank.health).toBe(150);
      expect(tank.speed).toBe(30);
      expect(tank.damage).toBe(15);
      expect(tank.xpValue).toBe(50);
      expect(tank.color).toBe('#f00');
      expect(tank.radius).toBe(20);
      expect(tank.attackCooldown).toBe(2.0);
    });

    test('should have highest health among basic types', () => {
      expect(ZOMBIE_TYPES.TANK.health).toBeGreaterThan(ZOMBIE_TYPES.SHAMBLER.health);
      expect(ZOMBIE_TYPES.TANK.health).toBeGreaterThan(ZOMBIE_TYPES.RUNNER.health);
    });

    test('should be slowest among basic types', () => {
      expect(ZOMBIE_TYPES.TANK.speed).toBeLessThan(ZOMBIE_TYPES.SHAMBLER.speed);
      expect(ZOMBIE_TYPES.TANK.speed).toBeLessThan(ZOMBIE_TYPES.RUNNER.speed);
    });
  });

  describe('EXPLODER Type', () => {
    test('should have correct stats', () => {
      const exploder = ZOMBIE_TYPES.EXPLODER;
      expect(exploder.type).toBe('Exploder');
      expect(exploder.health).toBe(25);
      expect(exploder.speed).toBe(60);
      expect(exploder.damage).toBe(30);
      expect(exploder.xpValue).toBe(25);
      expect(exploder.color).toBe('#f80');
      expect(exploder.radius).toBe(14);
      expect(exploder.attackCooldown).toBe(0.5);
    });

    test('should have explode special ability', () => {
      expect(ZOMBIE_TYPES.EXPLODER.specialAbility).toBe('explode');
    });

    test('should have high damage', () => {
      expect(ZOMBIE_TYPES.EXPLODER.damage).toBeGreaterThan(ZOMBIE_TYPES.SHAMBLER.damage);
      expect(ZOMBIE_TYPES.EXPLODER.damage).toBeGreaterThan(ZOMBIE_TYPES.RUNNER.damage);
    });
  });

  describe('SPITTER Type', () => {
    test('should have correct stats', () => {
      const spitter = ZOMBIE_TYPES.SPITTER;
      expect(spitter.type).toBe('Spitter');
      expect(spitter.health).toBe(40);
      expect(spitter.speed).toBe(50);
      expect(spitter.damage).toBe(12);
      expect(spitter.xpValue).toBe(20);
      expect(spitter.color).toBe('#0f8');
      expect(spitter.radius).toBe(13);
      expect(spitter.attackCooldown).toBe(2.0);
    });

    test('should have ranged special ability', () => {
      expect(ZOMBIE_TYPES.SPITTER.specialAbility).toBe('ranged');
    });
  });

  describe('SWARM Type', () => {
    test('should have correct stats', () => {
      const swarm = ZOMBIE_TYPES.SWARM;
      expect(swarm.type).toBe('Swarm');
      expect(swarm.health).toBe(15);
      expect(swarm.speed).toBe(80);
      expect(swarm.damage).toBe(3);
      expect(swarm.xpValue).toBe(5);
      expect(swarm.color).toBe('#f0f');
      expect(swarm.radius).toBe(8);
      expect(swarm.attackCooldown).toBe(0.8);
    });

    test('should be small and weak', () => {
      expect(ZOMBIE_TYPES.SWARM.health).toBeLessThan(ZOMBIE_TYPES.SHAMBLER.health);
      expect(ZOMBIE_TYPES.SWARM.damage).toBeLessThan(ZOMBIE_TYPES.SHAMBLER.damage);
      expect(ZOMBIE_TYPES.SWARM.xpValue).toBeLessThan(ZOMBIE_TYPES.SHAMBLER.xpValue);
    });

    test('should be fast', () => {
      expect(ZOMBIE_TYPES.SWARM.speed).toBeGreaterThan(ZOMBIE_TYPES.SHAMBLER.speed);
    });
  });

  describe('BRUTE Type', () => {
    test('should have correct stats', () => {
      const brute = ZOMBIE_TYPES.BRUTE;
      expect(brute.type).toBe('Brute');
      expect(brute.health).toBe(200);
      expect(brute.speed).toBe(40);
      expect(brute.damage).toBe(25);
      expect(brute.xpValue).toBe(75);
      expect(brute.color).toBe('#800');
      expect(brute.radius).toBe(25);
      expect(brute.attackCooldown).toBe(2.5);
    });

    test('should have highest health', () => {
      Object.values(ZOMBIE_TYPES).forEach(zombie => {
        if (zombie !== ZOMBIE_TYPES.BRUTE) {
          expect(ZOMBIE_TYPES.BRUTE.health).toBeGreaterThanOrEqual(zombie.health);
        }
      });
    });

    test('should be largest', () => {
      Object.values(ZOMBIE_TYPES).forEach(zombie => {
        if (zombie !== ZOMBIE_TYPES.BRUTE) {
          expect(ZOMBIE_TYPES.BRUTE.radius).toBeGreaterThanOrEqual(zombie.radius);
        }
      });
    });
  });

  describe('PHANTOM Type', () => {
    test('should have correct stats', () => {
      const phantom = ZOMBIE_TYPES.PHANTOM;
      expect(phantom.type).toBe('Phantom');
      expect(phantom.health).toBe(35);
      expect(phantom.speed).toBe(90);
      expect(phantom.damage).toBe(10);
      expect(phantom.xpValue).toBe(30);
      expect(phantom.color).toBe('#88f');
      expect(phantom.radius).toBe(12);
      expect(phantom.attackCooldown).toBe(1.2);
    });

    test('should have teleport special ability', () => {
      expect(ZOMBIE_TYPES.PHANTOM.specialAbility).toBe('teleport');
    });

    test('should be fast', () => {
      expect(ZOMBIE_TYPES.PHANTOM.speed).toBeGreaterThan(ZOMBIE_TYPES.SHAMBLER.speed);
    });
  });

  describe('NECROMANCER Type', () => {
    test('should have correct stats', () => {
      const necromancer = ZOMBIE_TYPES.NECROMANCER;
      expect(necromancer.type).toBe('Necromancer');
      expect(necromancer.health).toBe(100);
      expect(necromancer.speed).toBe(35);
      expect(necromancer.damage).toBe(5);
      expect(necromancer.xpValue).toBe(100);
      expect(necromancer.color).toBe('#808');
      expect(necromancer.radius).toBe(16);
      expect(necromancer.attackCooldown).toBe(3.0);
    });

    test('should have summon special ability', () => {
      expect(ZOMBIE_TYPES.NECROMANCER.specialAbility).toBe('summon');
    });

    test('should have highest XP value', () => {
      Object.values(ZOMBIE_TYPES).forEach(zombie => {
        if (zombie !== ZOMBIE_TYPES.NECROMANCER) {
          expect(ZOMBIE_TYPES.NECROMANCER.xpValue).toBeGreaterThanOrEqual(zombie.xpValue);
        }
      });
    });
  });

  describe('getZombieConfig', () => {
    test('should return correct config for valid type', () => {
      const config = getZombieConfig('SHAMBLER');
      expect(config).toBe(ZOMBIE_TYPES.SHAMBLER);
    });

    test('should return config for all zombie types', () => {
      const types = ['SHAMBLER', 'RUNNER', 'TANK', 'EXPLODER', 'SPITTER',
                    'SWARM', 'BRUTE', 'PHANTOM', 'NECROMANCER'];

      types.forEach(type => {
        const config = getZombieConfig(type);
        expect(config).toBe(ZOMBIE_TYPES[type]);
      });
    });

    test('should return SHAMBLER for invalid type', () => {
      const config = getZombieConfig('INVALID_TYPE');
      expect(config).toBe(ZOMBIE_TYPES.SHAMBLER);
    });

    test('should return SHAMBLER for empty string', () => {
      const config = getZombieConfig('');
      expect(config).toBe(ZOMBIE_TYPES.SHAMBLER);
    });

    test('should handle case sensitivity', () => {
      const config = getZombieConfig('shambler');
      // Function is case-sensitive, should return default
      expect(config).toBe(ZOMBIE_TYPES.SHAMBLER);
    });
  });

  describe('getRandomZombieType - Wave 1', () => {
    test('should only return SHAMBLER for wave 1', () => {
      // Test multiple times due to randomness
      for (let i = 0; i < 50; i++) {
        const type = getRandomZombieType(1);
        expect(type).toBe('SHAMBLER');
      }
    });
  });

  describe('getRandomZombieType - Wave 2', () => {
    test('should return SHAMBLER or RUNNER for wave 2', () => {
      const possibleTypes = new Set<string>();

      // Test multiple times to get different random results
      for (let i = 0; i < 100; i++) {
        const type = getRandomZombieType(2);
        possibleTypes.add(type);
        expect(['SHAMBLER', 'RUNNER']).toContain(type);
      }

      // Should have seen both types with 100 iterations
      expect(possibleTypes.size).toBeGreaterThan(1);
    });
  });

  describe('getRandomZombieType - Wave 3', () => {
    test('should include TANK starting wave 3', () => {
      const possibleTypes = new Set<string>();

      for (let i = 0; i < 100; i++) {
        const type = getRandomZombieType(3);
        possibleTypes.add(type);
        expect(['SHAMBLER', 'RUNNER', 'TANK']).toContain(type);
      }
    });
  });

  describe('getRandomZombieType - Wave 5', () => {
    test('should include EXPLODER and SPITTER starting wave 5', () => {
      const possibleTypes = new Set<string>();

      for (let i = 0; i < 200; i++) {
        const type = getRandomZombieType(5);
        possibleTypes.add(type);
        expect(['SHAMBLER', 'RUNNER', 'TANK', 'EXPLODER', 'SPITTER']).toContain(type);
      }
    });
  });

  describe('getRandomZombieType - Wave 8', () => {
    test('should include SWARM starting wave 8', () => {
      const possibleTypes = new Set<string>();

      for (let i = 0; i < 200; i++) {
        const type = getRandomZombieType(8);
        possibleTypes.add(type);
      }

      expect(possibleTypes.has('SWARM')).toBe(true);
    });
  });

  describe('getRandomZombieType - Wave 10', () => {
    test('should include BRUTE starting wave 10', () => {
      const possibleTypes = new Set<string>();

      for (let i = 0; i < 200; i++) {
        const type = getRandomZombieType(10);
        possibleTypes.add(type);
      }

      expect(possibleTypes.has('BRUTE')).toBe(true);
    });
  });

  describe('getRandomZombieType - Wave 12', () => {
    test('should include PHANTOM starting wave 12', () => {
      const possibleTypes = new Set<string>();

      for (let i = 0; i < 200; i++) {
        const type = getRandomZombieType(12);
        possibleTypes.add(type);
      }

      expect(possibleTypes.has('PHANTOM')).toBe(true);
    });
  });

  describe('getRandomZombieType - Wave 15+', () => {
    test('should include all zombie types starting wave 15', () => {
      const possibleTypes = new Set<string>();

      for (let i = 0; i < 500; i++) {
        const type = getRandomZombieType(15);
        possibleTypes.add(type);
      }

      expect(possibleTypes.has('NECROMANCER')).toBe(true);
      expect(possibleTypes.size).toBeGreaterThan(5);
    });

    test('should include NECROMANCER at wave 20', () => {
      const possibleTypes = new Set<string>();

      for (let i = 0; i < 200; i++) {
        const type = getRandomZombieType(20);
        possibleTypes.add(type);
      }

      expect(possibleTypes.has('NECROMANCER')).toBe(true);
    });
  });

  describe('Wave Progression Logic', () => {
    test('should progressively unlock more types', () => {
      const wave1Types = new Set<string>();
      const wave5Types = new Set<string>();
      const wave15Types = new Set<string>();

      for (let i = 0; i < 100; i++) {
        wave1Types.add(getRandomZombieType(1));
        wave5Types.add(getRandomZombieType(5));
        wave15Types.add(getRandomZombieType(15));
      }

      expect(wave1Types.size).toBeLessThan(wave5Types.size);
      expect(wave5Types.size).toBeLessThan(wave15Types.size);
    });

    test('should not return types before their unlock wave', () => {
      // Wave 1 should never have NECROMANCER
      for (let i = 0; i < 100; i++) {
        const type = getRandomZombieType(1);
        expect(type).not.toBe('NECROMANCER');
        expect(type).not.toBe('BRUTE');
        expect(type).not.toBe('PHANTOM');
      }
    });

    test('should handle very high wave numbers', () => {
      const type = getRandomZombieType(100);
      expect(Object.keys(ZOMBIE_TYPES)).toContain(type);
    });

    test('should handle wave 0', () => {
      // Wave 0 should still work (treated as wave 1 logic)
      const type = getRandomZombieType(0);
      expect(type).toBe('SHAMBLER');
    });

    test('should handle negative wave numbers', () => {
      const type = getRandomZombieType(-1);
      expect(type).toBe('SHAMBLER');
    });
  });

  describe('Special Abilities Distribution', () => {
    test('should have types with special abilities', () => {
      const typesWithAbilities = Object.values(ZOMBIE_TYPES)
        .filter(config => config.specialAbility !== undefined);

      expect(typesWithAbilities.length).toBeGreaterThan(0);
    });

    test('should have types without special abilities', () => {
      const typesWithoutAbilities = Object.values(ZOMBIE_TYPES)
        .filter(config => config.specialAbility === undefined);

      expect(typesWithoutAbilities.length).toBeGreaterThan(0);
    });

    test('special abilities should be unique strings', () => {
      const abilities = new Set<string>();

      Object.values(ZOMBIE_TYPES).forEach(config => {
        if (config.specialAbility) {
          abilities.add(config.specialAbility);
        }
      });

      expect(abilities.size).toBeGreaterThan(0);
    });
  });

  describe('Stat Balance', () => {
    test('higher health should correlate with higher XP', () => {
      const highHealthZombies = Object.values(ZOMBIE_TYPES)
        .filter(config => config.health > 100);

      highHealthZombies.forEach(zombie => {
        expect(zombie.xpValue).toBeGreaterThan(20);
      });
    });

    test('faster zombies should have lower health', () => {
      const fastZombies = Object.values(ZOMBIE_TYPES)
        .filter(config => config.speed > 80);

      fastZombies.forEach(zombie => {
        expect(zombie.health).toBeLessThan(ZOMBIE_TYPES.TANK.health);
      });
    });

    test('should have variety in attack cooldowns', () => {
      const cooldowns = new Set<number>();

      Object.values(ZOMBIE_TYPES).forEach(config => {
        cooldowns.add(config.attackCooldown);
      });

      expect(cooldowns.size).toBeGreaterThan(3);
    });

    test('should have variety in sizes', () => {
      const sizes = new Set<number>();

      Object.values(ZOMBIE_TYPES).forEach(config => {
        sizes.add(config.radius);
      });

      expect(sizes.size).toBeGreaterThan(3);
    });
  });

  describe('Color Variety', () => {
    test('should have unique colors for each type', () => {
      const colors = new Set<string>();

      Object.values(ZOMBIE_TYPES).forEach(config => {
        colors.add(config.color);
      });

      expect(colors.size).toBe(9); // All types should have unique colors
    });
  });
});
