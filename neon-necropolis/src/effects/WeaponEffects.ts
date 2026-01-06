/**
 * NEON NECROPOLIS - Weapon Effects
 * Visual effects for all 10 weapon types
 */

import { ParticleSystem, ParticleType } from '../engine/ParticleSystem';
import { Colors } from '../utils/Colors';

export class WeaponEffects {
  private particles: ParticleSystem;

  constructor(particles: ParticleSystem) {
    this.particles = particles;
  }

  /**
   * PISTOL - Cyan muzzle flash and trail
   */
  pistol(x: number, y: number, angle: number): void {
    // Muzzle flash
    this.muzzleFlash(x, y, angle, Colors.weapon.pistol, 5, Colors.glow.medium);
  }

  /**
   * SHOTGUN - Orange spread blast
   */
  shotgun(x: number, y: number, angle: number): void {
    const count = 12;
    const spread = Math.PI / 4;

    for (let i = 0; i < count; i++) {
      const particleAngle = angle + (Math.random() - 0.5) * spread;
      const speed = 4 + Math.random() * 3;

      this.particles.emit({
        x,
        y,
        type: ParticleType.MUZZLE_FLASH,
        velocityX: Math.cos(particleAngle) * speed,
        velocityY: Math.sin(particleAngle) * speed,
        color: Colors.weapon.shotgun,
        size: 6 + Math.random() * 4,
        lifetime: 150 + Math.random() * 100,
        gravity: 0,
        friction: 0.88,
        glow: true,
        glowIntensity: Colors.glow.high
      });
    }

    // Smoke puff
    this.smokeEffect(x, y, angle, Colors.weapon.shotgun, 5);
  }

  /**
   * LASER - Red beam with sparkles
   */
  laser(x: number, y: number, angle: number, length: number = 50): void {
    // Create particles along beam
    const segments = 10;
    for (let i = 0; i < segments; i++) {
      const t = i / segments;
      const particleX = x + Math.cos(angle) * length * t;
      const particleY = y + Math.sin(angle) * length * t;

      this.particles.emit({
        x: particleX,
        y: particleY,
        type: ParticleType.SPARKLE,
        velocityX: (Math.random() - 0.5) * 2,
        velocityY: (Math.random() - 0.5) * 2,
        color: Colors.weapon.laser,
        size: 3,
        lifetime: 100 + Math.random() * 100,
        gravity: 0,
        friction: 0.95,
        glow: true,
        glowIntensity: Colors.glow.high
      });
    }

    // Muzzle flash
    this.muzzleFlash(x, y, angle, Colors.weapon.laser, 8, Colors.glow.intense);
  }

  /**
   * ORBITAL - Cyan rotating projectiles
   */
  orbital(x: number, y: number, angle: number): void {
    // Create orbital trail
    const count = 8;
    for (let i = 0; i < count; i++) {
      const orbitAngle = angle + (Math.PI * 2 * i) / count;
      const radius = 15;

      this.particles.emit({
        x: x + Math.cos(orbitAngle) * radius,
        y: y + Math.sin(orbitAngle) * radius,
        type: ParticleType.TRAIL,
        velocityX: Math.cos(orbitAngle) * 2,
        velocityY: Math.sin(orbitAngle) * 2,
        color: Colors.weapon.orbital,
        size: 4,
        lifetime: 300,
        gravity: 0,
        friction: 0.96,
        glow: true,
        glowIntensity: Colors.glow.high
      });
    }
  }

  /**
   * LIGHTNING - Yellow electric arcs
   */
  lightning(x: number, y: number, targetX: number, targetY: number): void {
    // Create jagged lightning effect
    const segments = 8;
    let currentX = x;
    let currentY = y;

    for (let i = 0; i < segments; i++) {
      const t = (i + 1) / segments;
      const targetSegmentX = x + (targetX - x) * t;
      const targetSegmentY = y + (targetY - y) * t;

      // Add random offset for jagged effect
      const offsetX = (Math.random() - 0.5) * 20;
      const offsetY = (Math.random() - 0.5) * 20;

      const segmentX = targetSegmentX + offsetX;
      const segmentY = targetSegmentY + offsetY;

      // Create particles along segment
      const particleCount = 3;
      for (let j = 0; j < particleCount; j++) {
        const particleT = j / particleCount;
        const particleX = currentX + (segmentX - currentX) * particleT;
        const particleY = currentY + (segmentY - currentY) * particleT;

        this.particles.emit({
          x: particleX,
          y: particleY,
          type: ParticleType.SPARKLE,
          velocityX: (Math.random() - 0.5) * 2,
          velocityY: (Math.random() - 0.5) * 2,
          color: Colors.weapon.lightning,
          size: 4 + Math.random() * 3,
          lifetime: 100 + Math.random() * 100,
          gravity: 0,
          friction: 0.9,
          glow: true,
          glowIntensity: Colors.glow.intense
        });
      }

      currentX = segmentX;
      currentY = segmentY;
    }
  }

  /**
   * MISSILES - Magenta explosive trail
   */
  missiles(x: number, y: number, angle: number): void {
    // Rocket exhaust
    const count = 8;
    for (let i = 0; i < count; i++) {
      const spread = Math.PI / 6;
      const particleAngle = angle + Math.PI + (Math.random() - 0.5) * spread;
      const speed = 2 + Math.random() * 3;

      this.particles.emit({
        x,
        y,
        type: ParticleType.SMOKE,
        velocityX: Math.cos(particleAngle) * speed,
        velocityY: Math.sin(particleAngle) * speed,
        color: Colors.weapon.missiles,
        size: 8 + Math.random() * 4,
        lifetime: 400 + Math.random() * 200,
        gravity: 0,
        friction: 0.97,
        glow: true,
        glowIntensity: Colors.glow.medium
      });
    }

    // Sparkles
    for (let i = 0; i < 5; i++) {
      this.particles.emit({
        x,
        y,
        type: ParticleType.SPARKLE,
        velocityX: Math.cos(angle + Math.PI) * (1 + Math.random() * 2),
        velocityY: Math.sin(angle + Math.PI) * (1 + Math.random() * 2),
        color: Colors.orange,
        size: 3,
        lifetime: 300,
        gravity: 0,
        friction: 0.95,
        glow: true,
        glowIntensity: Colors.glow.high
      });
    }
  }

  /**
   * FLAMETHROWER - Yellow/orange fire particles
   */
  flamethrower(x: number, y: number, angle: number): void {
    const count = 15;
    const spread = Math.PI / 3;

    for (let i = 0; i < count; i++) {
      const particleAngle = angle + (Math.random() - 0.5) * spread;
      const speed = 3 + Math.random() * 4;

      // Alternate between yellow and orange
      const color = Math.random() > 0.5 ? Colors.weapon.flamethrower : Colors.orange;

      this.particles.emit({
        x,
        y,
        type: ParticleType.EXPLOSION,
        velocityX: Math.cos(particleAngle) * speed,
        velocityY: Math.sin(particleAngle) * speed,
        color,
        size: 8 + Math.random() * 6,
        lifetime: 300 + Math.random() * 200,
        gravity: -0.1,
        friction: 0.93,
        glow: true,
        glowIntensity: Colors.glow.high
      });
    }

    // Add smoke
    this.smokeEffect(x, y, angle, Colors.withAlpha(Colors.weapon.flamethrower, 0.5), 3);
  }

  /**
   * TESLA - Electric blue energy ball
   */
  tesla(x: number, y: number, angle: number): void {
    // Central energy burst
    const count = 20;
    for (let i = 0; i < count; i++) {
      const burstAngle = (Math.PI * 2 * i) / count;
      const speed = 2 + Math.random() * 2;

      this.particles.emit({
        x,
        y,
        type: ParticleType.SPARKLE,
        velocityX: Math.cos(burstAngle) * speed,
        velocityY: Math.sin(burstAngle) * speed,
        color: Colors.weapon.tesla,
        size: 4 + Math.random() * 3,
        lifetime: 200 + Math.random() * 200,
        gravity: 0,
        friction: 0.94,
        glow: true,
        glowIntensity: Colors.glow.intense
      });
    }

    // Electric arcs
    for (let i = 0; i < 8; i++) {
      const arcAngle = Math.random() * Math.PI * 2;
      const arcLength = 20 + Math.random() * 20;

      this.particles.emit({
        x: x + Math.cos(arcAngle) * arcLength,
        y: y + Math.sin(arcAngle) * arcLength,
        type: ParticleType.SPARKLE,
        velocityX: (Math.random() - 0.5) * 2,
        velocityY: (Math.random() - 0.5) * 2,
        color: Colors.white,
        size: 3,
        lifetime: 150,
        gravity: 0,
        friction: 0.9,
        glow: true,
        glowIntensity: Colors.glow.extreme
      });
    }
  }

  /**
   * ICE - Light blue freezing particles
   */
  ice(x: number, y: number, angle: number): void {
    const count = 10;
    const spread = Math.PI / 8;

    for (let i = 0; i < count; i++) {
      const particleAngle = angle + (Math.random() - 0.5) * spread;
      const speed = 3 + Math.random() * 2;

      this.particles.emit({
        x,
        y,
        type: ParticleType.SPARKLE,
        velocityX: Math.cos(particleAngle) * speed,
        velocityY: Math.sin(particleAngle) * speed,
        color: Colors.weapon.ice,
        size: 4 + Math.random() * 3,
        lifetime: 300 + Math.random() * 200,
        gravity: -0.05,
        friction: 0.96,
        glow: true,
        glowIntensity: Colors.glow.medium
      });
    }

    // Ice crystals
    for (let i = 0; i < 5; i++) {
      this.particles.emit({
        x,
        y,
        type: ParticleType.SPARKLE,
        velocityX: Math.cos(angle) * (2 + Math.random() * 2),
        velocityY: Math.sin(angle) * (2 + Math.random() * 2),
        color: Colors.white,
        size: 3,
        lifetime: 400,
        gravity: 0.1,
        friction: 0.97,
        glow: true,
        glowIntensity: Colors.glow.high
      });
    }
  }

  /**
   * POISON - Green toxic cloud
   */
  poison(x: number, y: number, angle: number): void {
    const count = 12;
    const spread = Math.PI / 6;

    for (let i = 0; i < count; i++) {
      const particleAngle = angle + (Math.random() - 0.5) * spread;
      const speed = 2 + Math.random() * 3;

      this.particles.emit({
        x,
        y,
        type: ParticleType.SMOKE,
        velocityX: Math.cos(particleAngle) * speed,
        velocityY: Math.sin(particleAngle) * speed,
        color: Colors.weapon.poison,
        size: 10 + Math.random() * 6,
        lifetime: 500 + Math.random() * 300,
        gravity: -0.03,
        friction: 0.97,
        glow: true,
        glowIntensity: Colors.glow.medium
      });
    }

    // Toxic sparkles
    for (let i = 0; i < 8; i++) {
      this.particles.emit({
        x,
        y,
        type: ParticleType.SPARKLE,
        velocityX: Math.cos(angle) * (1 + Math.random() * 3),
        velocityY: Math.sin(angle) * (1 + Math.random() * 3),
        color: Colors.acidGreen,
        size: 3,
        lifetime: 300,
        gravity: 0,
        friction: 0.96,
        glow: true,
        glowIntensity: Colors.glow.high
      });
    }
  }

  /**
   * Generic muzzle flash effect
   */
  private muzzleFlash(
    x: number,
    y: number,
    angle: number,
    color: string,
    count: number = 5,
    glowIntensity: number = Colors.glow.medium
  ): void {
    const spread = Math.PI / 4;

    for (let i = 0; i < count; i++) {
      const particleAngle = angle + (Math.random() - 0.5) * spread;
      const speed = 3 + Math.random() * 3;

      this.particles.emit({
        x,
        y,
        type: ParticleType.MUZZLE_FLASH,
        velocityX: Math.cos(particleAngle) * speed,
        velocityY: Math.sin(particleAngle) * speed,
        color,
        size: 6 + Math.random() * 4,
        lifetime: 120 + Math.random() * 80,
        gravity: 0,
        friction: 0.9,
        glow: true,
        glowIntensity
      });
    }
  }

  /**
   * Generic smoke effect
   */
  private smokeEffect(
    x: number,
    y: number,
    angle: number,
    color: string,
    count: number = 3
  ): void {
    for (let i = 0; i < count; i++) {
      const spread = Math.PI / 3;
      const particleAngle = angle + Math.PI + (Math.random() - 0.5) * spread;
      const speed = 1 + Math.random() * 2;

      this.particles.emit({
        x,
        y,
        type: ParticleType.SMOKE,
        velocityX: Math.cos(particleAngle) * speed,
        velocityY: Math.sin(particleAngle) * speed,
        color: Colors.withAlpha(color, 0.5),
        size: 12 + Math.random() * 8,
        lifetime: 600 + Math.random() * 400,
        gravity: -0.05,
        friction: 0.98,
        glow: false,
        glowIntensity: 0
      });
    }
  }

  /**
   * Projectile trail effect (called per frame for moving projectiles)
   */
  projectileTrail(
    x: number,
    y: number,
    velocityX: number,
    velocityY: number,
    color: string
  ): void {
    this.particles.emit({
      x,
      y,
      type: ParticleType.TRAIL,
      velocityX: -velocityX * 0.3,
      velocityY: -velocityY * 0.3,
      color,
      size: 3,
      lifetime: 200,
      gravity: 0,
      friction: 0.96,
      glow: true,
      glowIntensity: Colors.glow.low
    });
  }

  /**
   * Explosion effect (for missiles, etc.)
   */
  explosion(x: number, y: number, color: string, intensity: number = 1): void {
    const count = Math.floor(25 * intensity);

    // Main explosion
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count;
      const speed = 3 + Math.random() * 4 * intensity;

      this.particles.emit({
        x,
        y,
        type: ParticleType.EXPLOSION,
        velocityX: Math.cos(angle) * speed,
        velocityY: Math.sin(angle) * speed,
        color,
        size: 10 + Math.random() * 8 * intensity,
        lifetime: 500 + Math.random() * 300,
        gravity: 0.2,
        friction: 0.93,
        glow: true,
        glowIntensity: Colors.glow.intense
      });
    }

    // Sparkles
    for (let i = 0; i < count / 2; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 5;

      this.particles.emit({
        x,
        y,
        type: ParticleType.SPARKLE,
        velocityX: Math.cos(angle) * speed,
        velocityY: Math.sin(angle) * speed,
        color: Colors.yellow,
        size: 4,
        lifetime: 400,
        gravity: 0.1,
        friction: 0.95,
        glow: true,
        glowIntensity: Colors.glow.high
      });
    }

    // Smoke
    for (let i = 0; i < count / 3; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1 + Math.random() * 2;

      this.particles.emit({
        x,
        y,
        type: ParticleType.SMOKE,
        velocityX: Math.cos(angle) * speed,
        velocityY: Math.sin(angle) * speed,
        color: Colors.withAlpha(color, 0.4),
        size: 15 + Math.random() * 10,
        lifetime: 800 + Math.random() * 400,
        gravity: -0.05,
        friction: 0.98,
        glow: false,
        glowIntensity: 0
      });
    }
  }

  /**
   * Impact effect (when projectile hits enemy)
   */
  impact(x: number, y: number, color: string, size: number = 1): void {
    const count = Math.floor(8 * size);

    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count;
      const speed = 2 + Math.random() * 3;

      this.particles.emit({
        x,
        y,
        type: ParticleType.SPARKLE,
        velocityX: Math.cos(angle) * speed,
        velocityY: Math.sin(angle) * speed,
        color,
        size: 3 + Math.random() * 2,
        lifetime: 200 + Math.random() * 200,
        gravity: 0.1,
        friction: 0.95,
        glow: true,
        glowIntensity: Colors.glow.medium
      });
    }
  }
}
