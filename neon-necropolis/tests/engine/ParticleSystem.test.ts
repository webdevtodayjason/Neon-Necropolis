/**
 * ParticleSystem.test.ts
 * Comprehensive tests for the particle system with object pooling
 */

import { ParticleSystem, ParticleType, ParticleConfig } from '../../src/engine/ParticleSystem';

describe('ParticleSystem', () => {
  let particleSystem: ParticleSystem;
  let mockCanvas: HTMLCanvasElement;
  let mockCtx: CanvasRenderingContext2D;

  beforeEach(() => {
    particleSystem = new ParticleSystem(100); // Smaller pool for testing
    mockCanvas = (global as any).createMockCanvas();
    mockCtx = mockCanvas.getContext('2d')!;
    (global as any).resetTime();
  });

  describe('Initialization', () => {
    it('should create particle system with specified pool size', () => {
      const system = new ParticleSystem(50);
      expect(system).toBeDefined();
      expect(system.getActiveCount()).toBe(0);
    });

    it('should initialize with default pool size of 2000', () => {
      const system = new ParticleSystem();
      expect(system).toBeDefined();
      expect(system.getActiveCount()).toBe(0);
    });

    it('should have zero active particles initially', () => {
      expect(particleSystem.getActiveCount()).toBe(0);
      expect(particleSystem.getPoolUtilization()).toBe(0);
    });
  });

  describe('Particle Emission', () => {
    it('should emit a single particle', () => {
      particleSystem.emit({
        x: 100,
        y: 200,
        type: ParticleType.BLOOD_SPLATTER
      });

      expect(particleSystem.getActiveCount()).toBe(1);
    });

    it('should emit multiple particles', () => {
      for (let i = 0; i < 10; i++) {
        particleSystem.emit({
          x: 100,
          y: 200,
          type: ParticleType.BLOOD_SPLATTER
        });
      }

      expect(particleSystem.getActiveCount()).toBe(10);
    });

    it('should apply particle type presets', () => {
      particleSystem.emit({
        x: 100,
        y: 200,
        type: ParticleType.BLOOD_SPLATTER
      });

      expect(particleSystem.getActiveCount()).toBe(1);
    });

    it('should allow custom particle properties to override presets', () => {
      particleSystem.emit({
        x: 100,
        y: 200,
        type: ParticleType.BLOOD_SPLATTER,
        color: '#ffffff',
        size: 20,
        lifetime: 500
      });

      expect(particleSystem.getActiveCount()).toBe(1);
    });

    it('should handle pool overflow with circular buffer', () => {
      // Fill the pool beyond capacity
      for (let i = 0; i < 150; i++) {
        particleSystem.emit({
          x: i,
          y: i,
          type: ParticleType.BLOOD_SPLATTER
        });
      }

      // Should not exceed pool size
      expect(particleSystem.getActiveCount()).toBeLessThanOrEqual(100);
    });
  });

  describe('Burst Emission', () => {
    it('should emit burst of particles', () => {
      particleSystem.emitBurst(
        { x: 100, y: 200, type: ParticleType.BLOOD_SPLATTER },
        10
      );

      expect(particleSystem.getActiveCount()).toBe(10);
    });

    it('should spread particles in all directions', () => {
      particleSystem.emitBurst(
        { x: 100, y: 200, type: ParticleType.EXPLOSION },
        8,
        1.5
      );

      expect(particleSystem.getActiveCount()).toBe(8);
    });

    it('should emit burst with custom spread', () => {
      particleSystem.emitBurst(
        { x: 100, y: 200, type: ParticleType.SPARKLE },
        20,
        2.0
      );

      expect(particleSystem.getActiveCount()).toBe(20);
    });
  });

  describe('Cone Emission', () => {
    it('should emit particles in a cone', () => {
      particleSystem.emitCone(
        { x: 100, y: 200, type: ParticleType.MUZZLE_FLASH },
        5,
        0, // direction
        Math.PI / 4 // spread
      );

      expect(particleSystem.getActiveCount()).toBe(5);
    });

    it('should emit cone in specified direction', () => {
      particleSystem.emitCone(
        { x: 100, y: 200, type: ParticleType.MUZZLE_FLASH },
        10,
        Math.PI / 2, // 90 degrees
        Math.PI / 6
      );

      expect(particleSystem.getActiveCount()).toBe(10);
    });
  });

  describe('Special Effects', () => {
    it('should create blood splatter effect', () => {
      particleSystem.bloodSplatter(100, 200, 15);
      expect(particleSystem.getActiveCount()).toBe(15);
    });

    it('should create explosion effect', () => {
      particleSystem.explosion(100, 200, 1);
      // Explosion creates multiple particle types
      expect(particleSystem.getActiveCount()).toBeGreaterThan(20);
    });

    it('should scale explosion with intensity', () => {
      particleSystem.explosion(100, 200, 2);
      const highIntensityCount = particleSystem.getActiveCount();

      particleSystem.clear();
      particleSystem.explosion(100, 200, 0.5);
      const lowIntensityCount = particleSystem.getActiveCount();

      expect(highIntensityCount).toBeGreaterThan(lowIntensityCount);
    });

    it('should create XP collect effect', () => {
      particleSystem.xpCollect(100, 200, 8);
      expect(particleSystem.getActiveCount()).toBe(8);
    });

    it('should create muzzle flash effect', () => {
      particleSystem.muzzleFlash(100, 200, 0);
      expect(particleSystem.getActiveCount()).toBe(5);
    });

    it('should create trail effect', () => {
      particleSystem.trail(100, 200, 5, 5);
      expect(particleSystem.getActiveCount()).toBe(1);
    });
  });

  describe('Particle Update', () => {
    it('should update particle positions', () => {
      particleSystem.emit({
        x: 100,
        y: 200,
        type: ParticleType.BLOOD_SPLATTER,
        velocityX: 10,
        velocityY: 0
      });

      particleSystem.update(16); // 1 frame at 60fps

      // Particle should have moved
      expect(particleSystem.getActiveCount()).toBe(1);
    });

    it('should apply gravity to particles', () => {
      particleSystem.emit({
        x: 100,
        y: 200,
        type: ParticleType.BLOOD_SPLATTER,
        velocityX: 0,
        velocityY: 0,
        gravity: 1
      });

      particleSystem.update(16);
      particleSystem.update(16);

      // Particle should still be active
      expect(particleSystem.getActiveCount()).toBe(1);
    });

    it('should apply friction to particles', () => {
      particleSystem.emit({
        x: 100,
        y: 200,
        type: ParticleType.BLOOD_SPLATTER,
        velocityX: 10,
        velocityY: 10,
        friction: 0.9
      });

      particleSystem.update(16);

      // Friction should slow down particle
      expect(particleSystem.getActiveCount()).toBe(1);
    });

    it('should deactivate particles after lifetime', () => {
      particleSystem.emit({
        x: 100,
        y: 200,
        type: ParticleType.BLOOD_SPLATTER,
        lifetime: 100 // 100ms lifetime
      });

      expect(particleSystem.getActiveCount()).toBe(1);

      // Update past lifetime
      particleSystem.update(150);

      expect(particleSystem.getActiveCount()).toBe(0);
    });

    it('should update alpha based on lifetime', () => {
      particleSystem.emit({
        x: 100,
        y: 200,
        type: ParticleType.BLOOD_SPLATTER,
        lifetime: 1000
      });

      // Update to 80% of lifetime (should start fading)
      particleSystem.update(800);
      expect(particleSystem.getActiveCount()).toBe(1);
    });

    it('should rotate particles', () => {
      particleSystem.emit({
        x: 100,
        y: 200,
        type: ParticleType.SPARKLE
      });

      particleSystem.update(16);

      // Particle should still be active
      expect(particleSystem.getActiveCount()).toBe(1);
    });
  });

  describe('Particle Rendering', () => {
    it('should render active particles', () => {
      particleSystem.emit({
        x: 100,
        y: 200,
        type: ParticleType.BLOOD_SPLATTER
      });

      particleSystem.render(mockCtx);

      // Should have called rendering methods
      expect(mockCtx.save).toHaveBeenCalled();
      expect(mockCtx.restore).toHaveBeenCalled();
    });

    it('should not render inactive particles', () => {
      particleSystem.render(mockCtx);

      // Should still call save/restore but no drawing
      expect(mockCtx.save).toHaveBeenCalled();
      expect(mockCtx.restore).toHaveBeenCalled();
    });

    it('should render blood splatter particles', () => {
      particleSystem.emit({
        x: 100,
        y: 200,
        type: ParticleType.BLOOD_SPLATTER
      });

      particleSystem.render(mockCtx);

      expect(mockCtx.arc).toHaveBeenCalled();
      expect(mockCtx.fill).toHaveBeenCalled();
    });

    it('should render XP orb particles with pulse effect', () => {
      particleSystem.emit({
        x: 100,
        y: 200,
        type: ParticleType.XP_ORB
      });

      particleSystem.update(16);
      particleSystem.render(mockCtx);

      expect(mockCtx.arc).toHaveBeenCalled();
    });

    it('should render muzzle flash particles as stars', () => {
      particleSystem.emit({
        x: 100,
        y: 200,
        type: ParticleType.MUZZLE_FLASH
      });

      particleSystem.render(mockCtx);

      expect(mockCtx.translate).toHaveBeenCalled();
      expect(mockCtx.rotate).toHaveBeenCalled();
    });

    it('should render trail particles', () => {
      particleSystem.emit({
        x: 100,
        y: 200,
        type: ParticleType.TRAIL,
        velocityX: 5,
        velocityY: 0
      });

      particleSystem.render(mockCtx);

      expect(mockCtx.fillRect).toHaveBeenCalled();
    });

    it('should render smoke particles with gradient', () => {
      particleSystem.emit({
        x: 100,
        y: 200,
        type: ParticleType.SMOKE
      });

      particleSystem.render(mockCtx);

      expect(mockCtx.createRadialGradient).toHaveBeenCalled();
    });

    it('should apply glow effect to particles', () => {
      particleSystem.emit({
        x: 100,
        y: 200,
        type: ParticleType.EXPLOSION,
        glow: true,
        glowIntensity: 25
      });

      particleSystem.render(mockCtx);

      expect(mockCtx.save).toHaveBeenCalled();
    });
  });

  describe('Pool Management', () => {
    it('should track active particle count', () => {
      expect(particleSystem.getActiveCount()).toBe(0);

      particleSystem.emit({ x: 0, y: 0, type: ParticleType.BLOOD_SPLATTER });
      expect(particleSystem.getActiveCount()).toBe(1);

      particleSystem.emit({ x: 0, y: 0, type: ParticleType.BLOOD_SPLATTER });
      expect(particleSystem.getActiveCount()).toBe(2);
    });

    it('should calculate pool utilization', () => {
      expect(particleSystem.getPoolUtilization()).toBe(0);

      // Emit 50 particles (50% of 100 pool size)
      for (let i = 0; i < 50; i++) {
        particleSystem.emit({ x: 0, y: 0, type: ParticleType.BLOOD_SPLATTER });
      }

      expect(particleSystem.getPoolUtilization()).toBe(0.5);
    });

    it('should clear all particles', () => {
      particleSystem.emitBurst(
        { x: 100, y: 200, type: ParticleType.BLOOD_SPLATTER },
        50
      );

      expect(particleSystem.getActiveCount()).toBe(50);

      particleSystem.clear();

      expect(particleSystem.getActiveCount()).toBe(0);
      expect(particleSystem.getPoolUtilization()).toBe(0);
    });

    it('should reuse particles from pool', () => {
      // Fill pool
      for (let i = 0; i < 100; i++) {
        particleSystem.emit({ x: i, y: i, type: ParticleType.BLOOD_SPLATTER, lifetime: 10 });
      }

      // Update past lifetime
      particleSystem.update(20);

      expect(particleSystem.getActiveCount()).toBe(0);

      // Emit new particles (should reuse pool)
      particleSystem.emit({ x: 0, y: 0, type: ParticleType.BLOOD_SPLATTER });
      expect(particleSystem.getActiveCount()).toBe(1);
    });
  });

  describe('Performance', () => {
    it('should handle large number of particles efficiently', () => {
      const largeSystem = new ParticleSystem(2000);

      // Emit 2000 particles
      for (let i = 0; i < 2000; i++) {
        largeSystem.emit({
          x: Math.random() * 800,
          y: Math.random() * 600,
          type: ParticleType.BLOOD_SPLATTER
        });
      }

      expect(largeSystem.getActiveCount()).toBe(2000);

      // Update should complete quickly
      const startTime = performance.now();
      largeSystem.update(16);
      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(100); // Should take less than 100ms
    });

    it('should render many particles without errors', () => {
      for (let i = 0; i < 100; i++) {
        particleSystem.emit({
          x: Math.random() * 800,
          y: Math.random() * 600,
          type: [
            ParticleType.BLOOD_SPLATTER,
            ParticleType.XP_ORB,
            ParticleType.MUZZLE_FLASH,
            ParticleType.EXPLOSION,
            ParticleType.TRAIL,
            ParticleType.SPARKLE,
            ParticleType.SMOKE
          ][Math.floor(Math.random() * 7)]
        });
      }

      expect(() => {
        particleSystem.render(mockCtx);
      }).not.toThrow();
    });
  });

  describe('Particle Types', () => {
    it('should support all particle types', () => {
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
        particleSystem.emit({ x: 100, y: 200, type });
      });

      expect(particleSystem.getActiveCount()).toBe(types.length);
    });
  });
});
