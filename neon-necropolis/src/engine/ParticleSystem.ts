/**
 * NEON NECROPOLIS - Particle System
 * High-performance particle system with object pooling for 2000+ particles
 * Supports multiple particle types with configurable properties
 */

export enum ParticleType {
  BLOOD_SPLATTER = 'blood_splatter',
  XP_ORB = 'xp_orb',
  MUZZLE_FLASH = 'muzzle_flash',
  EXPLOSION = 'explosion',
  TRAIL = 'trail',
  SPARKLE = 'sparkle',
  SMOKE = 'smoke'
}

export interface ParticleConfig {
  x: number;
  y: number;
  type: ParticleType;
  velocityX?: number;
  velocityY?: number;
  color?: string;
  size?: number;
  lifetime?: number;
  gravity?: number;
  friction?: number;
  glow?: boolean;
  glowIntensity?: number;
}

interface Particle {
  active: boolean;
  x: number;
  y: number;
  velocityX: number;
  velocityY: number;
  color: string;
  size: number;
  lifetime: number;
  maxLifetime: number;
  alpha: number;
  gravity: number;
  friction: number;
  type: ParticleType;
  glow: boolean;
  glowIntensity: number;
  rotation: number;
  rotationSpeed: number;
}

export class ParticleSystem {
  private particles: Particle[] = [];
  private poolSize: number;
  private nextParticleIndex: number = 0;

  // Particle type presets
  private readonly presets: Record<ParticleType, Partial<ParticleConfig>> = {
    [ParticleType.BLOOD_SPLATTER]: {
      color: '#ff00ff',
      size: 4,
      lifetime: 800,
      gravity: 0.3,
      friction: 0.95,
      glow: true,
      glowIntensity: 15
    },
    [ParticleType.XP_ORB]: {
      color: '#00ffff',
      size: 6,
      lifetime: 1200,
      gravity: -0.1,
      friction: 0.98,
      glow: true,
      glowIntensity: 20
    },
    [ParticleType.MUZZLE_FLASH]: {
      color: '#ffff00',
      size: 8,
      lifetime: 150,
      gravity: 0,
      friction: 0.9,
      glow: true,
      glowIntensity: 25
    },
    [ParticleType.EXPLOSION]: {
      color: '#ff0080',
      size: 10,
      lifetime: 600,
      gravity: 0.2,
      friction: 0.92,
      glow: true,
      glowIntensity: 30
    },
    [ParticleType.TRAIL]: {
      color: '#0080ff',
      size: 3,
      lifetime: 400,
      gravity: 0,
      friction: 0.96,
      glow: true,
      glowIntensity: 10
    },
    [ParticleType.SPARKLE]: {
      color: '#00ff80',
      size: 5,
      lifetime: 500,
      gravity: 0.1,
      friction: 0.97,
      glow: true,
      glowIntensity: 18
    },
    [ParticleType.SMOKE]: {
      color: '#8800ff',
      size: 12,
      lifetime: 1000,
      gravity: -0.05,
      friction: 0.98,
      glow: false,
      glowIntensity: 0
    }
  };

  constructor(poolSize: number = 2000) {
    this.poolSize = poolSize;
    this.initializePool();
  }

  /**
   * Initialize the particle pool
   */
  private initializePool(): void {
    for (let i = 0; i < this.poolSize; i++) {
      this.particles.push({
        active: false,
        x: 0,
        y: 0,
        velocityX: 0,
        velocityY: 0,
        color: '#ffffff',
        size: 1,
        lifetime: 0,
        maxLifetime: 1000,
        alpha: 1,
        gravity: 0,
        friction: 1,
        type: ParticleType.BLOOD_SPLATTER,
        glow: false,
        glowIntensity: 0,
        rotation: 0,
        rotationSpeed: 0
      });
    }
  }

  /**
   * Emit a single particle
   */
  public emit(config: ParticleConfig): void {
    const particle = this.particles[this.nextParticleIndex];
    const preset = this.presets[config.type];

    // Merge preset with config
    particle.active = true;
    particle.x = config.x;
    particle.y = config.y;
    particle.type = config.type;
    particle.velocityX = config.velocityX ?? (Math.random() - 0.5) * 4;
    particle.velocityY = config.velocityY ?? (Math.random() - 0.5) * 4;
    particle.color = config.color ?? preset.color ?? '#ffffff';
    particle.size = config.size ?? preset.size ?? 5;
    particle.lifetime = 0;
    particle.maxLifetime = config.lifetime ?? preset.lifetime ?? 1000;
    particle.alpha = 1;
    particle.gravity = config.gravity ?? preset.gravity ?? 0;
    particle.friction = config.friction ?? preset.friction ?? 1;
    particle.glow = config.glow ?? preset.glow ?? false;
    particle.glowIntensity = config.glowIntensity ?? preset.glowIntensity ?? 0;
    particle.rotation = Math.random() * Math.PI * 2;
    particle.rotationSpeed = (Math.random() - 0.5) * 0.2;

    // Move to next particle in pool (circular buffer)
    this.nextParticleIndex = (this.nextParticleIndex + 1) % this.poolSize;
  }

  /**
   * Emit multiple particles in a burst
   */
  public emitBurst(config: ParticleConfig, count: number, spread: number = 1): void {
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count;
      const speed = 2 + Math.random() * 3 * spread;

      this.emit({
        ...config,
        velocityX: Math.cos(angle) * speed,
        velocityY: Math.sin(angle) * speed
      });
    }
  }

  /**
   * Emit a directional cone of particles
   */
  public emitCone(
    config: ParticleConfig,
    count: number,
    direction: number,
    spread: number = Math.PI / 4
  ): void {
    for (let i = 0; i < count; i++) {
      const angle = direction + (Math.random() - 0.5) * spread;
      const speed = 2 + Math.random() * 4;

      this.emit({
        ...config,
        velocityX: Math.cos(angle) * speed,
        velocityY: Math.sin(angle) * speed
      });
    }
  }

  /**
   * Create a blood splatter effect
   */
  public bloodSplatter(x: number, y: number, count: number = 15): void {
    this.emitBurst(
      { x, y, type: ParticleType.BLOOD_SPLATTER },
      count,
      1.5
    );
  }

  /**
   * Create an explosion effect
   */
  public explosion(x: number, y: number, intensity: number = 1): void {
    const count = Math.floor(20 * intensity);

    // Main explosion particles
    this.emitBurst(
      { x, y, type: ParticleType.EXPLOSION, size: 12 * intensity },
      count,
      2
    );

    // Sparkles
    this.emitBurst(
      { x, y, type: ParticleType.SPARKLE, size: 4 },
      count / 2,
      1.5
    );

    // Smoke
    this.emitBurst(
      { x, y, type: ParticleType.SMOKE, size: 15 * intensity },
      count / 3,
      0.8
    );
  }

  /**
   * Create XP orb collection effect
   */
  public xpCollect(x: number, y: number, count: number = 8): void {
    this.emitBurst(
      { x, y, type: ParticleType.XP_ORB },
      count,
      0.8
    );
  }

  /**
   * Create muzzle flash effect
   */
  public muzzleFlash(x: number, y: number, direction: number): void {
    this.emitCone(
      { x, y, type: ParticleType.MUZZLE_FLASH, size: 10 },
      5,
      direction,
      Math.PI / 6
    );
  }

  /**
   * Create a trail effect (for projectiles)
   */
  public trail(x: number, y: number, velocityX: number, velocityY: number): void {
    this.emit({
      x,
      y,
      type: ParticleType.TRAIL,
      velocityX: velocityX * 0.3,
      velocityY: velocityY * 0.3
    });
  }

  /**
   * Update all active particles
   */
  public update(deltaTime: number): void {
    for (let i = 0; i < this.poolSize; i++) {
      const particle = this.particles[i];

      if (!particle.active) continue;

      // Update lifetime
      particle.lifetime += deltaTime;

      if (particle.lifetime >= particle.maxLifetime) {
        particle.active = false;
        continue;
      }

      // Update position
      particle.x += particle.velocityX * deltaTime / 16;
      particle.y += particle.velocityY * deltaTime / 16;

      // Apply physics
      particle.velocityY += particle.gravity * deltaTime / 16;
      particle.velocityX *= particle.friction;
      particle.velocityY *= particle.friction;

      // Update rotation
      particle.rotation += particle.rotationSpeed;

      // Update alpha (fade out near end of lifetime)
      const lifeRatio = particle.lifetime / particle.maxLifetime;
      if (lifeRatio > 0.7) {
        particle.alpha = 1 - (lifeRatio - 0.7) / 0.3;
      } else {
        particle.alpha = 1;
      }
    }
  }

  /**
   * Render all active particles
   */
  public render(ctx: CanvasRenderingContext2D): void {
    ctx.save();

    for (let i = 0; i < this.poolSize; i++) {
      const particle = this.particles[i];

      if (!particle.active) continue;

      ctx.globalAlpha = particle.alpha;

      // Apply glow effect
      if (particle.glow && particle.glowIntensity > 0) {
        ctx.shadowBlur = particle.glowIntensity;
        ctx.shadowColor = particle.color;
      } else {
        ctx.shadowBlur = 0;
      }

      ctx.fillStyle = particle.color;

      // Render based on particle type
      switch (particle.type) {
        case ParticleType.BLOOD_SPLATTER:
        case ParticleType.EXPLOSION:
          // Circular particles
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fill();
          break;

        case ParticleType.XP_ORB:
          // Pulsing orbs
          const pulse = 1 + Math.sin(particle.lifetime * 0.01) * 0.2;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size * pulse, 0, Math.PI * 2);
          ctx.fill();
          break;

        case ParticleType.MUZZLE_FLASH:
        case ParticleType.SPARKLE:
          // Star-shaped particles
          ctx.save();
          ctx.translate(particle.x, particle.y);
          ctx.rotate(particle.rotation);
          this.drawStar(ctx, 0, 0, 5, particle.size, particle.size * 0.5);
          ctx.restore();
          break;

        case ParticleType.TRAIL:
          // Elongated trail particles
          ctx.save();
          ctx.translate(particle.x, particle.y);
          ctx.rotate(Math.atan2(particle.velocityY, particle.velocityX));
          ctx.fillRect(-particle.size * 2, -particle.size / 2, particle.size * 4, particle.size);
          ctx.restore();
          break;

        case ParticleType.SMOKE:
          // Large, soft circles
          const gradient = ctx.createRadialGradient(
            particle.x, particle.y, 0,
            particle.x, particle.y, particle.size
          );
          gradient.addColorStop(0, particle.color);
          gradient.addColorStop(1, 'transparent');
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fill();
          break;
      }
    }

    ctx.restore();
  }

  /**
   * Helper function to draw a star shape
   */
  private drawStar(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    points: number,
    outer: number,
    inner: number
  ): void {
    ctx.beginPath();

    for (let i = 0; i < points * 2; i++) {
      const angle = (Math.PI * i) / points;
      const radius = i % 2 === 0 ? outer : inner;
      const px = x + Math.cos(angle) * radius;
      const py = y + Math.sin(angle) * radius;

      if (i === 0) {
        ctx.moveTo(px, py);
      } else {
        ctx.lineTo(px, py);
      }
    }

    ctx.closePath();
    ctx.fill();
  }

  /**
   * Get the number of active particles
   */
  public getActiveCount(): number {
    return this.particles.filter(p => p.active).length;
  }

  /**
   * Clear all particles
   */
  public clear(): void {
    for (let i = 0; i < this.poolSize; i++) {
      this.particles[i].active = false;
    }
    this.nextParticleIndex = 0;
  }

  /**
   * Get pool utilization (0-1)
   */
  public getPoolUtilization(): number {
    return this.getActiveCount() / this.poolSize;
  }
}
