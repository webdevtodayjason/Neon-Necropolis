/**
 * NEON NECROPOLIS - Blood Effect
 * Magenta neon blood particles for zombie deaths
 */

import { ParticleSystem, ParticleType } from '../engine/ParticleSystem';
import { Colors } from '../utils/Colors';

export class BloodEffect {
  private particles: ParticleSystem;

  constructor(particles: ParticleSystem) {
    this.particles = particles;
  }

  /**
   * Create blood splatter on zombie death
   */
  splatter(x: number, y: number, intensity: number = 1): void {
    const count = Math.floor(15 * intensity);

    // Main blood splatter
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
      const speed = 2 + Math.random() * 4 * intensity;

      this.particles.emit({
        x,
        y,
        type: ParticleType.BLOOD_SPLATTER,
        velocityX: Math.cos(angle) * speed,
        velocityY: Math.sin(angle) * speed,
        color: Colors.effects.blood,
        size: 3 + Math.random() * 3,
        lifetime: 600 + Math.random() * 400,
        gravity: 0.3,
        friction: 0.95,
        glow: true,
        glowIntensity: Colors.glow.medium
      });
    }

    // Add some sparkles for extra flair
    for (let i = 0; i < count / 3; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1 + Math.random() * 2;

      this.particles.emit({
        x,
        y,
        type: ParticleType.SPARKLE,
        velocityX: Math.cos(angle) * speed,
        velocityY: Math.sin(angle) * speed,
        color: Colors.hotPink,
        size: 2 + Math.random() * 2,
        lifetime: 400 + Math.random() * 200,
        gravity: 0.1,
        friction: 0.97,
        glow: true,
        glowIntensity: Colors.glow.high
      });
    }
  }

  /**
   * Create small blood spray (for minor hits)
   */
  spray(x: number, y: number, direction: number, count: number = 5): void {
    for (let i = 0; i < count; i++) {
      const angle = direction + (Math.random() - 0.5) * 0.8;
      const speed = 2 + Math.random() * 3;

      this.particles.emit({
        x,
        y,
        type: ParticleType.BLOOD_SPLATTER,
        velocityX: Math.cos(angle) * speed,
        velocityY: Math.sin(angle) * speed,
        color: Colors.effects.blood,
        size: 2 + Math.random() * 2,
        lifetime: 400 + Math.random() * 200,
        gravity: 0.2,
        friction: 0.96,
        glow: true,
        glowIntensity: Colors.glow.low
      });
    }
  }

  /**
   * Create blood mist (for explosive deaths)
   */
  mist(x: number, y: number, radius: number = 50): void {
    const count = 30;

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * radius;
      const speed = 0.5 + Math.random() * 1.5;

      const offsetX = Math.cos(angle) * distance;
      const offsetY = Math.sin(angle) * distance;

      this.particles.emit({
        x: x + offsetX,
        y: y + offsetY,
        type: ParticleType.SMOKE,
        velocityX: Math.cos(angle) * speed,
        velocityY: Math.sin(angle) * speed,
        color: Colors.withAlpha(Colors.effects.blood, 0.6),
        size: 8 + Math.random() * 8,
        lifetime: 800 + Math.random() * 400,
        gravity: -0.05,
        friction: 0.98,
        glow: false,
        glowIntensity: 0
      });
    }
  }

  /**
   * Create blood trail (for fast-moving projectiles)
   */
  trail(x: number, y: number, velocityX: number, velocityY: number): void {
    this.particles.emit({
      x,
      y,
      type: ParticleType.BLOOD_SPLATTER,
      velocityX: velocityX * -0.2,
      velocityY: velocityY * -0.2,
      color: Colors.effects.blood,
      size: 2,
      lifetime: 300,
      gravity: 0.1,
      friction: 0.97,
      glow: true,
      glowIntensity: Colors.glow.subtle
    });
  }

  /**
   * Create blood pool effect (on ground)
   */
  pool(x: number, y: number, size: number = 20): void {
    const count = 8;

    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count;
      const distance = size * (0.5 + Math.random() * 0.5);

      this.particles.emit({
        x: x + Math.cos(angle) * distance,
        y: y + Math.sin(angle) * distance,
        type: ParticleType.BLOOD_SPLATTER,
        velocityX: 0,
        velocityY: 0,
        color: Colors.withAlpha(Colors.effects.blood, 0.8),
        size: 6 + Math.random() * 4,
        lifetime: 2000,
        gravity: 0,
        friction: 1,
        glow: true,
        glowIntensity: Colors.glow.subtle
      });
    }
  }
}
