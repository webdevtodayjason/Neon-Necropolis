/**
 * NEON NECROPOLIS - XP Orb Effect
 * Cyan glowing orbs that float toward the player
 */

import { ParticleSystem, ParticleType } from '../engine/ParticleSystem';
import { Colors } from '../utils/Colors';

export interface XPOrb {
  x: number;
  y: number;
  velocityX: number;
  velocityY: number;
  value: number;
  lifetime: number;
  collected: boolean;
  size: number;
  pulsePhase: number;
}

export class XPOrbEffect {
  private particles: ParticleSystem;
  private orbs: XPOrb[] = [];
  private maxOrbs: number = 200;

  constructor(particles: ParticleSystem) {
    this.particles = particles;
  }

  /**
   * Spawn XP orbs at location
   */
  spawn(x: number, y: number, xpValue: number): void {
    if (this.orbs.length >= this.maxOrbs) {
      // Remove oldest orb
      this.orbs.shift();
    }

    // Calculate number of orbs based on XP value
    const orbCount = Math.min(5, Math.max(1, Math.floor(xpValue / 10)));

    for (let i = 0; i < orbCount; i++) {
      const angle = (Math.PI * 2 * i) / orbCount + (Math.random() - 0.5) * 0.3;
      const speed = 1 + Math.random() * 2;

      this.orbs.push({
        x,
        y,
        velocityX: Math.cos(angle) * speed,
        velocityY: Math.sin(angle) * speed,
        value: xpValue / orbCount,
        lifetime: 0,
        collected: false,
        size: 4 + Math.random() * 2,
        pulsePhase: Math.random() * Math.PI * 2
      });

      // Spawn particle effect
      this.particles.emit({
        x,
        y,
        type: ParticleType.SPARKLE,
        velocityX: Math.cos(angle) * speed * 0.5,
        velocityY: Math.sin(angle) * speed * 0.5,
        color: Colors.effects.xp,
        size: 3,
        lifetime: 300,
        gravity: 0,
        friction: 0.96,
        glow: true,
        glowIntensity: Colors.glow.medium
      });
    }
  }

  /**
   * Update all XP orbs
   */
  update(deltaTime: number, playerX: number, playerY: number, magnetRadius: number = 150): void {
    for (let i = this.orbs.length - 1; i >= 0; i--) {
      const orb = this.orbs[i];

      // Update lifetime
      orb.lifetime += deltaTime;
      orb.pulsePhase += deltaTime * 0.005;

      // Calculate distance to player
      const dx = playerX - orb.x;
      const dy = playerY - orb.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Apply magnetic pull toward player
      if (distance < magnetRadius) {
        const pullStrength = 1 - (distance / magnetRadius);
        const pullForce = 0.5 * pullStrength;

        orb.velocityX += (dx / distance) * pullForce * (deltaTime / 16);
        orb.velocityY += (dy / distance) * pullForce * (deltaTime / 16);
      }

      // Apply friction
      orb.velocityX *= 0.98;
      orb.velocityY *= 0.98;

      // Update position
      orb.x += orb.velocityX * (deltaTime / 16);
      orb.y += orb.velocityY * (deltaTime / 16);

      // Check if collected (within pickup radius)
      if (distance < 20) {
        orb.collected = true;
        this.collect(orb.x, orb.y);
        this.orbs.splice(i, 1);
        continue;
      }

      // Remove old orbs (timeout after 10 seconds)
      if (orb.lifetime > 10000) {
        this.orbs.splice(i, 1);
        continue;
      }

      // Spawn trail particles occasionally
      if (Math.random() < 0.3) {
        this.particles.emit({
          x: orb.x,
          y: orb.y,
          type: ParticleType.TRAIL,
          velocityX: -orb.velocityX * 0.5,
          velocityY: -orb.velocityY * 0.5,
          color: Colors.effects.xp,
          size: 2,
          lifetime: 200,
          gravity: 0,
          friction: 0.96,
          glow: true,
          glowIntensity: Colors.glow.low
        });
      }
    }
  }

  /**
   * Render all XP orbs
   */
  render(ctx: CanvasRenderingContext2D): void {
    ctx.save();

    for (const orb of this.orbs) {
      // Calculate pulse effect
      const pulse = 1 + Math.sin(orb.pulsePhase) * 0.2;
      const size = orb.size * pulse;

      // Draw glow
      ctx.shadowBlur = Colors.glow.high;
      ctx.shadowColor = Colors.effects.xp;

      // Draw orb
      ctx.fillStyle = Colors.effects.xp;
      ctx.beginPath();
      ctx.arc(orb.x, orb.y, size, 0, Math.PI * 2);
      ctx.fill();

      // Draw inner bright core
      ctx.shadowBlur = Colors.glow.extreme;
      ctx.fillStyle = Colors.white;
      ctx.beginPath();
      ctx.arc(orb.x, orb.y, size * 0.4, 0, Math.PI * 2);
      ctx.fill();

      // Draw outer ring
      ctx.shadowBlur = Colors.glow.medium;
      ctx.strokeStyle = Colors.effects.xp;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(orb.x, orb.y, size * 1.5, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.restore();
  }

  /**
   * Create collection effect
   */
  collect(x: number, y: number): void {
    // Create burst of particles
    for (let i = 0; i < 8; i++) {
      const angle = (Math.PI * 2 * i) / 8;
      const speed = 1 + Math.random() * 2;

      this.particles.emit({
        x,
        y,
        type: ParticleType.SPARKLE,
        velocityX: Math.cos(angle) * speed,
        velocityY: Math.sin(angle) * speed,
        color: Colors.effects.xp,
        size: 3 + Math.random() * 2,
        lifetime: 400 + Math.random() * 200,
        gravity: -0.1,
        friction: 0.97,
        glow: true,
        glowIntensity: Colors.glow.high
      });
    }
  }

  /**
   * Get all orbs (for collision checking)
   */
  getOrbs(): XPOrb[] {
    return this.orbs;
  }

  /**
   * Clear all orbs
   */
  clear(): void {
    this.orbs.length = 0;
  }

  /**
   * Get orb count
   */
  getCount(): number {
    return this.orbs.length;
  }
}
