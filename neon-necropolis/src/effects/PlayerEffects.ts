/**
 * NEON NECROPOLIS - Player Effects
 * Visual effects for player actions: trail, damage flash, level-up
 */

import { ParticleSystem, ParticleType } from '../engine/ParticleSystem';
import { Colors } from '../utils/Colors';

export class PlayerEffects {
  private particles: ParticleSystem;
  private trailTimer: number = 0;
  private trailInterval: number = 50; // ms between trail particles

  constructor(particles: ParticleSystem) {
    this.particles = particles;
  }

  /**
   * Create player movement trail
   */
  trail(x: number, y: number, velocityX: number, velocityY: number, deltaTime: number): void {
    this.trailTimer += deltaTime;

    if (this.trailTimer >= this.trailInterval) {
      this.trailTimer = 0;

      // Only create trail if player is moving
      const speed = Math.sqrt(velocityX * velocityX + velocityY * velocityY);
      if (speed > 0.5) {
        this.particles.emit({
          x,
          y,
          type: ParticleType.TRAIL,
          velocityX: -velocityX * 0.3,
          velocityY: -velocityY * 0.3,
          color: Colors.effects.trail,
          size: 3,
          lifetime: 300,
          gravity: 0,
          friction: 0.95,
          glow: true,
          glowIntensity: Colors.glow.low
        });
      }
    }
  }

  /**
   * Create damage flash effect
   */
  damageFlash(x: number, y: number, intensity: number = 1): void {
    const count = Math.floor(12 * intensity);

    // Create expanding ring of particles
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count;
      const speed = 2 + Math.random() * 2;

      this.particles.emit({
        x,
        y,
        type: ParticleType.SPARKLE,
        velocityX: Math.cos(angle) * speed,
        velocityY: Math.sin(angle) * speed,
        color: Colors.effects.damage,
        size: 4 + Math.random() * 2,
        lifetime: 300 + Math.random() * 200,
        gravity: 0,
        friction: 0.96,
        glow: true,
        glowIntensity: Colors.glow.high
      });
    }

    // Add some magenta sparkles
    for (let i = 0; i < count / 2; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1 + Math.random() * 3;

      this.particles.emit({
        x,
        y,
        type: ParticleType.SPARKLE,
        velocityX: Math.cos(angle) * speed,
        velocityY: Math.sin(angle) * speed,
        color: Colors.magenta,
        size: 3,
        lifetime: 250,
        gravity: -0.05,
        friction: 0.97,
        glow: true,
        glowIntensity: Colors.glow.medium
      });
    }
  }

  /**
   * Create heal effect
   */
  heal(x: number, y: number): void {
    const count = 20;

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.5 + Math.random() * 1.5;

      this.particles.emit({
        x,
        y,
        type: ParticleType.SPARKLE,
        velocityX: Math.cos(angle) * speed,
        velocityY: Math.sin(angle) * speed - 1, // Float upward
        color: Colors.effects.heal,
        size: 3 + Math.random() * 2,
        lifetime: 600 + Math.random() * 400,
        gravity: -0.05,
        friction: 0.98,
        glow: true,
        glowIntensity: Colors.glow.high
      });
    }
  }

  /**
   * Create level-up effect
   */
  levelUp(x: number, y: number): void {
    // Outer ring explosion
    const outerCount = 30;
    for (let i = 0; i < outerCount; i++) {
      const angle = (Math.PI * 2 * i) / outerCount;
      const speed = 3 + Math.random() * 2;

      this.particles.emit({
        x,
        y,
        type: ParticleType.SPARKLE,
        velocityX: Math.cos(angle) * speed,
        velocityY: Math.sin(angle) * speed,
        color: Colors.effects.levelUp,
        size: 5 + Math.random() * 3,
        lifetime: 800 + Math.random() * 400,
        gravity: -0.1,
        friction: 0.97,
        glow: true,
        glowIntensity: Colors.glow.intense
      });
    }

    // Inner burst
    const innerCount = 20;
    for (let i = 0; i < innerCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1 + Math.random() * 4;

      this.particles.emit({
        x,
        y,
        type: ParticleType.EXPLOSION,
        velocityX: Math.cos(angle) * speed,
        velocityY: Math.sin(angle) * speed,
        color: Colors.cyan,
        size: 8 + Math.random() * 4,
        lifetime: 600 + Math.random() * 400,
        gravity: 0,
        friction: 0.95,
        glow: true,
        glowIntensity: Colors.glow.high
      });
    }

    // Upward floating particles
    for (let i = 0; i < 15; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.5 + Math.random();

      this.particles.emit({
        x: x + (Math.random() - 0.5) * 40,
        y: y + (Math.random() - 0.5) * 40,
        type: ParticleType.SPARKLE,
        velocityX: Math.cos(angle) * speed,
        velocityY: Math.sin(angle) * speed - 2,
        color: Colors.white,
        size: 4,
        lifetime: 1000 + Math.random() * 500,
        gravity: -0.1,
        friction: 0.99,
        glow: true,
        glowIntensity: Colors.glow.extreme
      });
    }
  }

  /**
   * Create dash effect
   */
  dash(x: number, y: number, direction: number): void {
    const count = 15;

    for (let i = 0; i < count; i++) {
      // Spawn behind the dash direction
      const offsetX = -Math.cos(direction) * i * 3;
      const offsetY = -Math.sin(direction) * i * 3;

      this.particles.emit({
        x: x + offsetX,
        y: y + offsetY,
        type: ParticleType.TRAIL,
        velocityX: -Math.cos(direction) * 2,
        velocityY: -Math.sin(direction) * 2,
        color: Colors.electricBlue,
        size: 4 - (i * 0.2),
        lifetime: 400,
        gravity: 0,
        friction: 0.95,
        glow: true,
        glowIntensity: Colors.glow.medium
      });
    }
  }

  /**
   * Create shield hit effect
   */
  shieldHit(x: number, y: number, impactAngle: number): void {
    const count = 10;

    for (let i = 0; i < count; i++) {
      // Particles bounce off at impact angle
      const spread = Math.PI / 3;
      const angle = impactAngle + (Math.random() - 0.5) * spread;
      const speed = 2 + Math.random() * 3;

      this.particles.emit({
        x,
        y,
        type: ParticleType.SPARKLE,
        velocityX: Math.cos(angle) * speed,
        velocityY: Math.sin(angle) * speed,
        color: Colors.electricBlue,
        size: 3 + Math.random() * 2,
        lifetime: 300 + Math.random() * 200,
        gravity: 0.1,
        friction: 0.96,
        glow: true,
        glowIntensity: Colors.glow.high
      });
    }
  }

  /**
   * Create invincibility effect
   */
  invincibility(x: number, y: number, radius: number = 30): void {
    const count = 5;

    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;

      this.particles.emit({
        x: x + Math.cos(angle) * radius,
        y: y + Math.sin(angle) * radius,
        type: ParticleType.SPARKLE,
        velocityX: Math.cos(angle) * 0.5,
        velocityY: Math.sin(angle) * 0.5,
        color: Colors.yellow,
        size: 3,
        lifetime: 300,
        gravity: 0,
        friction: 0.98,
        glow: true,
        glowIntensity: Colors.glow.high
      });
    }
  }

  /**
   * Create respawn effect
   */
  respawn(x: number, y: number): void {
    // Similar to level up but with cyan theme
    const count = 40;

    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count;
      const speed = 2 + Math.random() * 3;

      this.particles.emit({
        x,
        y,
        type: ParticleType.EXPLOSION,
        velocityX: Math.cos(angle) * speed,
        velocityY: Math.sin(angle) * speed,
        color: i % 2 === 0 ? Colors.cyan : Colors.white,
        size: 6 + Math.random() * 4,
        lifetime: 700 + Math.random() * 300,
        gravity: -0.05,
        friction: 0.96,
        glow: true,
        glowIntensity: Colors.glow.intense
      });
    }
  }

  /**
   * Reset trail timer
   */
  reset(): void {
    this.trailTimer = 0;
  }
}
