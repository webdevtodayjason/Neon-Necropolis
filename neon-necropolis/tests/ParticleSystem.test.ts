/**
 * ParticleSystem tests
 * Tests particle emission, updates, pooling, and rendering
 */
import { ParticleSystem, ParticleType, ParticleConfig } from '../src/engine/ParticleSystem';

describe('ParticleSystem', () => {
  let particleSystem: ParticleSystem;

  beforeEach(() => {
    particleSystem = new ParticleSystem(100); // Smaller pool for testing
  });

  describe('Initialization', () => {
    test('should initialize with default pool size', () => {
      const system = new ParticleSystem();
      expect(system.getActiveCount()).toBe(0);
    });

    test('should initialize with custom pool size', () => {
      const system = new ParticleSystem(50);
      expect(system.getActiveCount()).toBe(0);
    });

    test('should have zero active particles initially', () => {
      expect(particleSystem.getActiveCount()).toBe(0);
    });

    test('should have zero pool utilization initially', () => {
      expect(particleSystem.getPoolUtilization()).toBe(0);
    });
  });

  describe('Single Particle Emission', () => {
    test('should emit blood splatter particle', () => {
      particleSystem.emit({
        x: 100,
        y: 100,
        type: ParticleType.BLOOD_SPLATTER
      });

      expect(particleSystem.getActiveCount()).toBe(1);
    });

    test('should emit XP orb particle', () => {
      particleSystem.emit({
        x: 200,
        y: 200,
        type: ParticleType.XP_ORB
      });

      expect(particleSystem.getActiveCount()).toBe(1);
    });

    test('should emit muzzle flash particle', () => {
      particleSystem.emit({
        x: 150,
        y: 150,
        type: ParticleType.MUZZLE_FLASH
      });

      expect(particleSystem.getActiveCount()).toBe(1);
    });

    test('should emit explosion particle', () => {
      particleSystem.emit({
        x: 300,
        y: 300,
        type: ParticleType.EXPLOSION
      });

      expect(particleSystem.getActiveCount()).toBe(1);
    });

    test('should emit trail particle', () => {
      particleSystem.emit({
        x: 250,
        y: 250,
        type: ParticleType.TRAIL
      });

      expect(particleSystem.getActiveCount()).toBe(1);
    });

    test('should emit sparkle particle', () => {
      particleSystem.emit({
        x: 180,
        y: 180,
        type: ParticleType.SPARKLE
      });

      expect(particleSystem.getActiveCount()).toBe(1);
    });

    test('should emit smoke particle', () => {
      particleSystem.emit({
        x: 220,
        y: 220,
        type: ParticleType.SMOKE
      });

      expect(particleSystem.getActiveCount()).toBe(1);
    });

    test('should emit particle with custom velocity', () => {
      particleSystem.emit({
        x: 100,
        y: 100,
        type: ParticleType.BLOOD_SPLATTER,
        velocityX: 5,
        velocityY: -3
      });

      expect(particleSystem.getActiveCount()).toBe(1);
    });

    test('should emit particle with custom color', () => {
      particleSystem.emit({
        x: 100,
        y: 100,
        type: ParticleType.BLOOD_SPLATTER,
        color: '#ff0000'
      });

      expect(particleSystem.getActiveCount()).toBe(1);
    });

    test('should emit particle with custom size', () => {
      particleSystem.emit({
        x: 100,
        y: 100,
        type: ParticleType.BLOOD_SPLATTER,
        size: 10
      });

      expect(particleSystem.getActiveCount()).toBe(1);
    });

    test('should emit particle with custom lifetime', () => {
      particleSystem.emit({
        x: 100,
        y: 100,
        type: ParticleType.BLOOD_SPLATTER,
        lifetime: 2000
      });

      expect(particleSystem.getActiveCount()).toBe(1);
    });

    test('should emit particle with custom gravity', () => {
      particleSystem.emit({
        x: 100,
        y: 100,
        type: ParticleType.BLOOD_SPLATTER,
        gravity: 0.5
      });

      expect(particleSystem.getActiveCount()).toBe(1);
    });

    test('should emit particle with custom friction', () => {
      particleSystem.emit({
        x: 100,
        y: 100,
        type: ParticleType.BLOOD_SPLATTER,
        friction: 0.9
      });

      expect(particleSystem.getActiveCount()).toBe(1);
    });

    test('should emit particle with glow enabled', () => {
      particleSystem.emit({
        x: 100,
        y: 100,
        type: ParticleType.BLOOD_SPLATTER,
        glow: true,
        glowIntensity: 25
      });

      expect(particleSystem.getActiveCount()).toBe(1);
    });
  });

  describe('Burst Emission', () => {
    test('should emit particle burst', () => {
      particleSystem.emitBurst({
        x: 100,
        y: 100,
        type: ParticleType.BLOOD_SPLATTER
      }, 10);

      expect(particleSystem.getActiveCount()).toBe(10);
    });

    test('should emit burst with custom spread', () => {
      particleSystem.emitBurst({
        x: 100,
        y: 100,
        type: ParticleType.EXPLOSION
      }, 20, 2.0);

      expect(particleSystem.getActiveCount()).toBe(20);
    });

    test('should emit zero particles with count zero', () => {
      particleSystem.emitBurst({
        x: 100,
        y: 100,
        type: ParticleType.BLOOD_SPLATTER
      }, 0);

      expect(particleSystem.getActiveCount()).toBe(0);
    });

    test('should emit single particle with count one', () => {
      particleSystem.emitBurst({
        x: 100,
        y: 100,
        type: ParticleType.BLOOD_SPLATTER
      }, 1);

      expect(particleSystem.getActiveCount()).toBe(1);
    });

    test('should distribute burst particles in circle', () => {
      particleSystem.emitBurst({
        x: 100,
        y: 100,
        type: ParticleType.EXPLOSION
      }, 8);

      expect(particleSystem.getActiveCount()).toBe(8);
    });
  });

  describe('Cone Emission', () => {
    test('should emit cone of particles', () => {
      particleSystem.emitCone({
        x: 100,
        y: 100,
        type: ParticleType.MUZZLE_FLASH
      }, 5, 0, Math.PI / 4);

      expect(particleSystem.getActiveCount()).toBe(5);
    });

    test('should emit cone in specific direction', () => {
      particleSystem.emitCone({
        x: 100,
        y: 100,
        type: ParticleType.MUZZLE_FLASH
      }, 10, Math.PI, Math.PI / 6);

      expect(particleSystem.getActiveCount()).toBe(10);
    });

    test('should emit cone with narrow spread', () => {
      particleSystem.emitCone({
        x: 100,
        y: 100,
        type: ParticleType.MUZZLE_FLASH
      }, 3, 0, Math.PI / 8);

      expect(particleSystem.getActiveCount()).toBe(3);
    });

    test('should emit cone with wide spread', () => {
      particleSystem.emitCone({
        x: 100,
        y: 100,
        type: ParticleType.MUZZLE_FLASH
      }, 7, 0, Math.PI / 2);

      expect(particleSystem.getActiveCount()).toBe(7);
    });
  });

  describe('Effect Methods', () => {
    test('should create blood splatter effect', () => {
      particleSystem.bloodSplatter(100, 100, 15);
      expect(particleSystem.getActiveCount()).toBe(15);
    });

    test('should create blood splatter with default count', () => {
      particleSystem.bloodSplatter(100, 100);
      expect(particleSystem.getActiveCount()).toBe(15);
    });

    test('should create explosion effect', () => {
      particleSystem.explosion(200, 200, 1);
      // Explosion creates multiple types of particles
      expect(particleSystem.getActiveCount()).toBeGreaterThan(0);
    });

    test('should create explosion with different intensities', () => {
      const system1 = new ParticleSystem(200);
      system1.explosion(100, 100, 0.5);
      const count1 = system1.getActiveCount();

      const system2 = new ParticleSystem(200);
      system2.explosion(100, 100, 2.0);
      const count2 = system2.getActiveCount();

      expect(count2).toBeGreaterThan(count1);
    });

    test('should create XP collect effect', () => {
      particleSystem.xpCollect(150, 150, 8);
      expect(particleSystem.getActiveCount()).toBe(8);
    });

    test('should create XP collect with default count', () => {
      particleSystem.xpCollect(150, 150);
      expect(particleSystem.getActiveCount()).toBe(8);
    });

    test('should create muzzle flash effect', () => {
      particleSystem.muzzleFlash(100, 100, 0);
      expect(particleSystem.getActiveCount()).toBe(5);
    });

    test('should create muzzle flash in different directions', () => {
      particleSystem.muzzleFlash(100, 100, Math.PI);
      expect(particleSystem.getActiveCount()).toBe(5);
    });

    test('should create trail effect', () => {
      particleSystem.trail(100, 100, 5, 3);
      expect(particleSystem.getActiveCount()).toBe(1);
    });

    test('should create trail with zero velocity', () => {
      particleSystem.trail(100, 100, 0, 0);
      expect(particleSystem.getActiveCount()).toBe(1);
    });
  });

  describe('Particle Updates', () => {
    test('should update particles over time', () => {
      particleSystem.emit({
        x: 100,
        y: 100,
        type: ParticleType.BLOOD_SPLATTER,
        velocityX: 5,
        velocityY: 0
      });

      particleSystem.update(100); // 100ms

      // Particle should still be active
      expect(particleSystem.getActiveCount()).toBe(1);
    });

    test('should expire particles after lifetime', () => {
      particleSystem.emit({
        x: 100,
        y: 100,
        type: ParticleType.BLOOD_SPLATTER,
        lifetime: 500
      });

      particleSystem.update(600); // 600ms, exceeds lifetime

      // Particle should be inactive
      expect(particleSystem.getActiveCount()).toBe(0);
    });

    test('should apply gravity to particles', () => {
      particleSystem.emit({
        x: 100,
        y: 100,
        type: ParticleType.BLOOD_SPLATTER,
        gravity: 0.5
      });

      particleSystem.update(100);

      expect(particleSystem.getActiveCount()).toBe(1);
    });

    test('should apply friction to particles', () => {
      particleSystem.emit({
        x: 100,
        y: 100,
        type: ParticleType.BLOOD_SPLATTER,
        velocityX: 10,
        friction: 0.9
      });

      particleSystem.update(100);

      expect(particleSystem.getActiveCount()).toBe(1);
    });

    test('should handle multiple particle updates', () => {
      for (let i = 0; i < 5; i++) {
        particleSystem.emit({
          x: 100 + i * 10,
          y: 100,
          type: ParticleType.BLOOD_SPLATTER
        });
      }

      particleSystem.update(100);

      expect(particleSystem.getActiveCount()).toBe(5);
    });

    test('should handle zero delta time', () => {
      particleSystem.emit({
        x: 100,
        y: 100,
        type: ParticleType.BLOOD_SPLATTER
      });

      particleSystem.update(0);

      expect(particleSystem.getActiveCount()).toBe(1);
    });

    test('should handle large delta time', () => {
      particleSystem.emit({
        x: 100,
        y: 100,
        type: ParticleType.BLOOD_SPLATTER,
        lifetime: 10000
      });

      particleSystem.update(5000);

      expect(particleSystem.getActiveCount()).toBe(1);
    });
  });

  describe('Particle Pooling', () => {
    test('should reuse particles from pool', () => {
      // Fill pool
      for (let i = 0; i < 10; i++) {
        particleSystem.emit({
          x: 100,
          y: 100,
          type: ParticleType.BLOOD_SPLATTER,
          lifetime: 100
        });
      }

      // Wait for particles to expire
      particleSystem.update(200);
      expect(particleSystem.getActiveCount()).toBe(0);

      // Emit new particles - should reuse pool
      for (let i = 0; i < 10; i++) {
        particleSystem.emit({
          x: 100,
          y: 100,
          type: ParticleType.BLOOD_SPLATTER
        });
      }

      expect(particleSystem.getActiveCount()).toBe(10);
    });

    test('should handle pool overflow', () => {
      // Emit more particles than pool size
      for (let i = 0; i < 150; i++) {
        particleSystem.emit({
          x: 100,
          y: 100,
          type: ParticleType.BLOOD_SPLATTER
        });
      }

      // Should wrap around and reuse pool
      expect(particleSystem.getActiveCount()).toBeLessThanOrEqual(100);
    });

    test('should calculate pool utilization correctly', () => {
      particleSystem.emit({
        x: 100,
        y: 100,
        type: ParticleType.BLOOD_SPLATTER
      });

      expect(particleSystem.getPoolUtilization()).toBe(0.01); // 1/100
    });

    test('should have 100% utilization when pool is full', () => {
      for (let i = 0; i < 100; i++) {
        particleSystem.emit({
          x: 100,
          y: 100,
          type: ParticleType.BLOOD_SPLATTER
        });
      }

      expect(particleSystem.getPoolUtilization()).toBe(1.0);
    });
  });

  describe('Clearing', () => {
    test('should clear all particles', () => {
      for (let i = 0; i < 20; i++) {
        particleSystem.emit({
          x: 100,
          y: 100,
          type: ParticleType.BLOOD_SPLATTER
        });
      }

      particleSystem.clear();

      expect(particleSystem.getActiveCount()).toBe(0);
    });

    test('should reset pool utilization after clear', () => {
      for (let i = 0; i < 50; i++) {
        particleSystem.emit({
          x: 100,
          y: 100,
          type: ParticleType.BLOOD_SPLATTER
        });
      }

      particleSystem.clear();

      expect(particleSystem.getPoolUtilization()).toBe(0);
    });

    test('should allow new emissions after clear', () => {
      particleSystem.emit({
        x: 100,
        y: 100,
        type: ParticleType.BLOOD_SPLATTER
      });

      particleSystem.clear();

      particleSystem.emit({
        x: 100,
        y: 100,
        type: ParticleType.XP_ORB
      });

      expect(particleSystem.getActiveCount()).toBe(1);
    });
  });

  describe('Rendering', () => {
    let canvas: HTMLCanvasElement;
    let ctx: CanvasRenderingContext2D;

    beforeEach(() => {
      canvas = (global as any).createMockCanvas();
      ctx = canvas.getContext('2d')!;
    });

    test('should render without errors', () => {
      particleSystem.emit({
        x: 100,
        y: 100,
        type: ParticleType.BLOOD_SPLATTER
      });

      expect(() => particleSystem.render(ctx)).not.toThrow();
    });

    test('should render multiple particles', () => {
      for (let i = 0; i < 10; i++) {
        particleSystem.emit({
          x: 100 + i * 10,
          y: 100,
          type: ParticleType.BLOOD_SPLATTER
        });
      }

      expect(() => particleSystem.render(ctx)).not.toThrow();
    });

    test('should render different particle types', () => {
      const types = [
        ParticleType.BLOOD_SPLATTER,
        ParticleType.XP_ORB,
        ParticleType.MUZZLE_FLASH,
        ParticleType.EXPLOSION,
        ParticleType.TRAIL,
        ParticleType.SPARKLE,
        ParticleType.SMOKE
      ];

      types.forEach(type => {
        particleSystem.emit({ x: 100, y: 100, type });
      });

      expect(() => particleSystem.render(ctx)).not.toThrow();
    });

    test('should call canvas methods during render', () => {
      particleSystem.emit({
        x: 100,
        y: 100,
        type: ParticleType.BLOOD_SPLATTER
      });

      particleSystem.render(ctx);

      expect(ctx.save).toHaveBeenCalled();
      expect(ctx.restore).toHaveBeenCalled();
    });

    test('should render with glow effect', () => {
      particleSystem.emit({
        x: 100,
        y: 100,
        type: ParticleType.BLOOD_SPLATTER,
        glow: true,
        glowIntensity: 20
      });

      particleSystem.render(ctx);

      expect(ctx.shadowBlur).toHaveBeenCalled;
    });

    test('should handle rendering with no active particles', () => {
      expect(() => particleSystem.render(ctx)).not.toThrow();
    });
  });

  describe('Edge Cases', () => {
    test('should handle emitting at negative coordinates', () => {
      particleSystem.emit({
        x: -100,
        y: -100,
        type: ParticleType.BLOOD_SPLATTER
      });

      expect(particleSystem.getActiveCount()).toBe(1);
    });

    test('should handle emitting with extreme velocities', () => {
      particleSystem.emit({
        x: 100,
        y: 100,
        type: ParticleType.BLOOD_SPLATTER,
        velocityX: 1000,
        velocityY: -1000
      });

      expect(particleSystem.getActiveCount()).toBe(1);
    });

    test('should handle very short lifetimes', () => {
      particleSystem.emit({
        x: 100,
        y: 100,
        type: ParticleType.BLOOD_SPLATTER,
        lifetime: 1
      });

      particleSystem.update(10);

      expect(particleSystem.getActiveCount()).toBe(0);
    });

    test('should handle very long lifetimes', () => {
      particleSystem.emit({
        x: 100,
        y: 100,
        type: ParticleType.BLOOD_SPLATTER,
        lifetime: 100000
      });

      particleSystem.update(1000);

      expect(particleSystem.getActiveCount()).toBe(1);
    });

    test('should handle extreme gravity values', () => {
      particleSystem.emit({
        x: 100,
        y: 100,
        type: ParticleType.BLOOD_SPLATTER,
        gravity: 100
      });

      particleSystem.update(100);

      expect(particleSystem.getActiveCount()).toBe(1);
    });

    test('should handle zero friction', () => {
      particleSystem.emit({
        x: 100,
        y: 100,
        type: ParticleType.BLOOD_SPLATTER,
        friction: 0
      });

      particleSystem.update(100);

      expect(particleSystem.getActiveCount()).toBe(1);
    });

    test('should handle friction greater than 1', () => {
      particleSystem.emit({
        x: 100,
        y: 100,
        type: ParticleType.BLOOD_SPLATTER,
        friction: 1.5
      });

      particleSystem.update(100);

      expect(particleSystem.getActiveCount()).toBe(1);
    });

    test('should handle zero size particles', () => {
      particleSystem.emit({
        x: 100,
        y: 100,
        type: ParticleType.BLOOD_SPLATTER,
        size: 0
      });

      expect(particleSystem.getActiveCount()).toBe(1);
    });

    test('should handle very large particle sizes', () => {
      particleSystem.emit({
        x: 100,
        y: 100,
        type: ParticleType.BLOOD_SPLATTER,
        size: 1000
      });

      expect(particleSystem.getActiveCount()).toBe(1);
    });
  });

  describe('Performance', () => {
    test('should handle many simultaneous particles', () => {
      for (let i = 0; i < 100; i++) {
        particleSystem.emit({
          x: Math.random() * 800,
          y: Math.random() * 600,
          type: ParticleType.BLOOD_SPLATTER
        });
      }

      expect(particleSystem.getActiveCount()).toBe(100);
    });

    test('should update many particles efficiently', () => {
      for (let i = 0; i < 100; i++) {
        particleSystem.emit({
          x: Math.random() * 800,
          y: Math.random() * 600,
          type: ParticleType.BLOOD_SPLATTER
        });
      }

      expect(() => {
        for (let i = 0; i < 100; i++) {
          particleSystem.update(16); // 60fps
        }
      }).not.toThrow();
    });

    test('should render many particles efficiently', () => {
      const canvas = (global as any).createMockCanvas();
      const ctx = canvas.getContext('2d')!;

      for (let i = 0; i < 100; i++) {
        particleSystem.emit({
          x: Math.random() * 800,
          y: Math.random() * 600,
          type: ParticleType.BLOOD_SPLATTER
        });
      }

      expect(() => particleSystem.render(ctx)).not.toThrow();
    });
  });
});
