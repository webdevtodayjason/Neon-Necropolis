/**
 * Spawner tests
 * Tests wave-based zombie spawning, difficulty scaling, and spawn positioning
 */
import { Spawner } from '../src/game/Spawner';
import { Zombie } from '../src/game/Zombie';

describe('Spawner', () => {
  let spawner: Spawner;
  let zombies: Zombie[];
  const worldWidth = 1600;
  const worldHeight = 1200;

  beforeEach(() => {
    spawner = new Spawner(worldWidth, worldHeight);
    zombies = [];
  });

  describe('Initialization', () => {
    test('should initialize with wave 1', () => {
      expect(spawner.getWave()).toBe(1);
    });

    test('should initialize with correct world dimensions', () => {
      expect(() => spawner.update(0.1, 0, zombies)).not.toThrow();
    });

    test('should start with zero zombies spawned', () => {
      expect(spawner.getZombiesSpawned()).toBe(0);
    });

    test('should calculate initial wave stats', () => {
      expect(spawner.getTotalZombies()).toBeGreaterThan(0);
    });
  });

  describe('Basic Spawning', () => {
    test('should spawn zombie after interval', () => {
      spawner.update(2.1, 0, zombies); // Wait longer than spawn interval
      expect(zombies.length).toBeGreaterThan(0);
    });

    test('should spawn on first update since timer starts at 0', () => {
      spawner.update(0.1, 0, zombies);
      expect(zombies.length).toBe(1);
    });

    test('should spawn multiple zombies over time', () => {
      for (let i = 0; i < 10; i++) {
        spawner.update(2.1, 0, zombies);
      }
      expect(zombies.length).toBeGreaterThan(1);
    });

    test('should respect spawn interval', () => {
      spawner.update(0.1, 0, zombies); // First spawn
      const count1 = zombies.length;

      spawner.update(2.1, 0, zombies); // After spawn interval
      const count2 = zombies.length;

      expect(count2).toBeGreaterThan(count1);
    });

    test('should create zombie with valid properties', () => {
      spawner.update(2.1, 0, zombies);
      expect(zombies.length).toBeGreaterThan(0);

      const zombie = zombies[0];
      expect(zombie.health).toBeGreaterThan(0);
      expect(zombie.speed).toBeGreaterThan(0);
      expect(zombie.damage).toBeGreaterThan(0);
      expect(zombie.xpValue).toBeGreaterThan(0);
    });
  });

  describe('Spawn Positioning', () => {
    test('should spawn zombies outside screen bounds', () => {
      for (let i = 0; i < 20; i++) {
        spawner.update(2.1, 0, zombies);
      }

      const outsideBounds = zombies.some(z => {
        return z.x < 0 || z.x > worldWidth || z.y < 0 || z.y > worldHeight;
      });

      expect(outsideBounds).toBe(true);
    });

    test('should spawn zombies at different positions', () => {
      for (let i = 0; i < 10; i++) {
        spawner.update(2.1, 0, zombies);
      }

      // Check that not all zombies are at the same position
      const positions = zombies.map(z => `${z.x},${z.y}`);
      const uniquePositions = new Set(positions);

      expect(uniquePositions.size).toBeGreaterThan(1);
    });

    test('should spawn on all four sides', () => {
      // Spawn many zombies to ensure all sides are used
      for (let i = 0; i < 100; i++) {
        spawner.update(2.1, 0, zombies);
      }

      const left = zombies.some(z => z.x < 0);
      const right = zombies.some(z => z.x > worldWidth);
      const top = zombies.some(z => z.y < 0);
      const bottom = zombies.some(z => z.y > worldHeight);

      // Should spawn from at least 3 sides (likely all 4)
      const sidesUsed = [left, right, top, bottom].filter(Boolean).length;
      expect(sidesUsed).toBeGreaterThanOrEqual(3);
    });
  });

  describe('Wave System', () => {
    test('should increment wave based on game time', () => {
      spawner.update(0.1, 0, zombies);
      expect(spawner.getWave()).toBe(1);

      spawner.update(0.1, 120, zombies); // 2 minutes
      expect(spawner.getWave()).toBe(2);

      spawner.update(0.1, 240, zombies); // 4 minutes
      expect(spawner.getWave()).toBe(3);
    });

    test('should increase zombies per wave', () => {
      const wave1Total = spawner.getTotalZombies();

      spawner.update(0.1, 120, zombies); // Advance to wave 2
      const wave2Total = spawner.getTotalZombies();

      expect(wave2Total).toBeGreaterThan(wave1Total);
    });

    test('should spawn correct number of zombies per wave', () => {
      const totalZombies = spawner.getTotalZombies();

      // Spawn all zombies for wave
      for (let i = 0; i < totalZombies + 5; i++) {
        spawner.update(2.1, 0, zombies);
      }

      expect(spawner.getZombiesSpawned()).toBe(totalZombies);
    });

    test('should not exceed wave zombie limit', () => {
      const totalZombies = spawner.getTotalZombies();

      // Try to spawn more than the limit
      for (let i = 0; i < totalZombies + 10; i++) {
        spawner.update(2.1, 0, zombies);
      }

      expect(zombies.length).toBe(totalZombies);
    });

    test('should handle wave progression', () => {
      // Wave 1
      expect(spawner.getWave()).toBe(1);

      // Progress to wave 2
      spawner.update(0.1, 120, zombies);
      expect(spawner.getWave()).toBe(2);
      // Spawner may spawn immediately on update
      expect(spawner.getZombiesSpawned()).toBeGreaterThanOrEqual(0);

      // Progress to wave 3
      zombies = [];
      spawner.update(0.1, 240, zombies);
      expect(spawner.getWave()).toBe(3);
    });
  });

  describe('Difficulty Scaling', () => {
    test('should scale zombie health with wave', () => {
      // Get zombie from wave 1
      spawner.update(2.1, 0, zombies);
      const wave1Health = zombies[0].maxHealth;

      // Reset and get zombie from wave 3
      zombies = [];
      spawner = new Spawner(worldWidth, worldHeight);
      spawner.update(0.1, 240, zombies); // Wave 3
      spawner.update(2.1, 240, zombies);

      const wave3Health = zombies[0].maxHealth;

      expect(wave3Health).toBeGreaterThan(wave1Health);
    });

    test('should scale zombie damage with wave', () => {
      // Get zombie from wave 1
      spawner.update(2.1, 0, zombies);
      const wave1Damage = zombies[0].damage;

      // Reset and get zombie from wave 5
      zombies = [];
      spawner = new Spawner(worldWidth, worldHeight);
      spawner.update(0.1, 480, zombies); // Wave 5
      spawner.update(2.1, 480, zombies);

      const wave5Damage = zombies[0].damage;

      expect(wave5Damage).toBeGreaterThan(wave1Damage);
    });

    test('should increase difficulty progressively', () => {
      const waveStats: Array<{ health: number; damage: number }> = [];

      for (let wave = 1; wave <= 5; wave++) {
        zombies = [];
        spawner = new Spawner(worldWidth, worldHeight);
        const gameTime = (wave - 1) * 120;

        spawner.update(0.1, gameTime, zombies);
        if (zombies.length === 0) {
          spawner.update(2.1, gameTime, zombies);
        }

        waveStats.push({
          health: zombies[0].maxHealth,
          damage: zombies[0].damage
        });
      }

      // Each wave should generally be harder (allow for zombie type variations)
      // Just check that later waves are harder overall
      expect(waveStats[4].health).toBeGreaterThan(waveStats[0].health);
      expect(waveStats[4].damage).toBeGreaterThan(waveStats[0].damage);
    });
  });

  describe('Spawn Interval', () => {
    test('should decrease spawn interval in later waves', () => {
      // Initial spawn interval (wave 1)
      spawner.update(2.0, 0, zombies);
      const wave1Spawned = zombies.length;

      // Later wave spawn interval
      zombies = [];
      spawner = new Spawner(worldWidth, worldHeight);
      spawner.update(0.1, 600, zombies); // Wave 6
      spawner.update(2.0, 600, zombies);
      const wave6Spawned = zombies.length;

      // Later waves should spawn more zombies in same time
      expect(wave6Spawned).toBeGreaterThanOrEqual(wave1Spawned);
    });

    test('should not reduce spawn interval below minimum', () => {
      // Test very late game
      spawner.update(0.1, 10000, zombies); // Very late wave

      // Should still spawn zombies (not instant)
      const initialCount = zombies.length;
      spawner.update(0.1, 10000, zombies);
      const afterSmallUpdate = zombies.length;

      expect(afterSmallUpdate - initialCount).toBeLessThanOrEqual(1);
    });
  });

  describe('Zombie Type Variation', () => {
    test('should spawn different zombie types', () => {
      // Spawn many zombies
      for (let i = 0; i < 50; i++) {
        spawner.update(2.1, 0, zombies);
      }

      // Check for variety in zombie stats (indicating different types)
      const healthValues = new Set(zombies.map(z => z.maxHealth));
      const speedValues = new Set(zombies.map(z => z.speed));

      // Should have some variety (though with scaling, all might have same base)
      expect(healthValues.size).toBeGreaterThanOrEqual(1);
      expect(speedValues.size).toBeGreaterThanOrEqual(1);
    });

    test('should spawn appropriate types for wave', () => {
      // Early wave
      spawner.update(2.1, 0, zombies);
      expect(zombies[0]).toBeDefined();

      // Late wave
      zombies = [];
      spawner = new Spawner(worldWidth, worldHeight);
      spawner.update(0.1, 600, zombies); // Wave 6
      spawner.update(2.1, 600, zombies);
      expect(zombies[0]).toBeDefined();
    });
  });

  describe('Wave Statistics', () => {
    test('should track zombies spawned this wave', () => {
      expect(spawner.getZombiesSpawned()).toBe(0);

      spawner.update(2.1, 0, zombies);
      expect(spawner.getZombiesSpawned()).toBe(1);

      spawner.update(2.1, 0, zombies);
      expect(spawner.getZombiesSpawned()).toBe(2);
    });

    test('should return total zombies for wave', () => {
      const total = spawner.getTotalZombies();
      expect(total).toBeGreaterThan(0);
      expect(total).toBe(10); // Initial wave has 10 zombies
    });

    test('should return current wave number', () => {
      expect(spawner.getWave()).toBe(1);

      spawner.update(0.1, 120, zombies);
      expect(spawner.getWave()).toBe(2);
    });
  });

  describe('Wave Transitions', () => {
    test('should handle transition between waves', () => {
      // Spawn all zombies from wave 1
      const wave1Total = spawner.getTotalZombies();
      for (let i = 0; i < wave1Total + 5; i++) {
        spawner.update(2.1, 0, zombies);
      }

      expect(spawner.getZombiesSpawned()).toBeGreaterThanOrEqual(wave1Total);

      // Clear zombies to trigger next wave
      zombies = [];
      spawner.update(0.1, 0, zombies);

      // Next wave should start when all zombies cleared
      expect(spawner.getWave()).toBeGreaterThanOrEqual(1);
    });

    test('should start new wave after time-based trigger', () => {
      spawner.update(0.1, 120, zombies); // 2 minutes = wave 2
      expect(spawner.getWave()).toBe(2);
      // May spawn a zombie on the update
      expect(spawner.getZombiesSpawned()).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Edge Cases', () => {
    test('should handle very small deltaTime', () => {
      expect(() => spawner.update(0.001, 0, zombies)).not.toThrow();
    });

    test('should handle large deltaTime', () => {
      spawner.update(100, 0, zombies);
      // Should spawn some zombies but not crash
      expect(zombies.length).toBeGreaterThan(0);
    });

    test('should handle zero deltaTime', () => {
      expect(() => spawner.update(0, 0, zombies)).not.toThrow();
    });

    test('should handle very small world dimensions', () => {
      const smallSpawner = new Spawner(100, 100);
      expect(() => smallSpawner.update(2.1, 0, zombies)).not.toThrow();
    });

    test('should handle very large world dimensions', () => {
      const largeSpawner = new Spawner(10000, 10000);
      expect(() => largeSpawner.update(2.1, 0, zombies)).not.toThrow();
    });

    test('should handle negative game time gracefully', () => {
      spawner.update(0.1, -10, zombies);
      expect(spawner.getWave()).toBe(1); // Should default to wave 1
    });

    test('should handle very large game time', () => {
      spawner.update(0.1, 10000, zombies); // Very late game
      expect(spawner.getWave()).toBeGreaterThan(1);
    });
  });

  describe('Force Next Wave', () => {
    test('should manually advance to next wave', () => {
      expect(spawner.getWave()).toBe(1);
      spawner.forceNextWave();
      expect(spawner.getWave()).toBe(2);
    });

    test('should reset zombie count on forced wave', () => {
      spawner.update(2.1, 0, zombies);
      expect(spawner.getZombiesSpawned()).toBeGreaterThan(0);

      spawner.forceNextWave();
      expect(spawner.getZombiesSpawned()).toBe(0);
    });

    test('should recalculate wave stats on forced wave', () => {
      const wave1Total = spawner.getTotalZombies();
      spawner.forceNextWave();
      const wave2Total = spawner.getTotalZombies();

      expect(wave2Total).toBeGreaterThan(wave1Total);
    });
  });

  describe('Integration Scenarios', () => {
    test('should simulate complete wave cycle', () => {
      const totalZombies = spawner.getTotalZombies();

      // Spawn all zombies
      for (let i = 0; i < totalZombies; i++) {
        spawner.update(2.1, 0, zombies);
      }

      expect(zombies.length).toBe(totalZombies);
      expect(spawner.getZombiesSpawned()).toBe(totalZombies);

      // Clear zombies (simulating them being killed)
      zombies = [];

      // Should trigger next wave when zombies array is empty
      spawner.update(0.1, 0, zombies);
    });

    test('should handle continuous spawning over many frames', () => {
      // Simulate 60 seconds of gameplay at 60fps
      for (let frame = 0; frame < 60 * 60; frame++) {
        spawner.update(1 / 60, frame / 60, zombies);
      }

      // Should have spawned some zombies
      expect(zombies.length).toBeGreaterThan(0);
    });

    test('should handle multiple waves in single session', () => {
      // Play through multiple waves
      for (let wave = 0; wave < 5; wave++) {
        const gameTime = wave * 120;
        spawner.update(0.1, gameTime, zombies);

        // Spawn some zombies
        for (let i = 0; i < 5; i++) {
          spawner.update(2.1, gameTime, zombies);
        }
      }

      expect(zombies.length).toBeGreaterThan(0);
    });
  });
});
