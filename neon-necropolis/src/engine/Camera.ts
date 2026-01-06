/**
 * NEON NECROPOLIS - Camera System
 * Handles camera shake, smooth following, and screen effects
 */

export interface CameraConfig {
  x: number;
  y: number;
  width: number;
  height: number;
  followSpeed?: number;
  followDeadzone?: number;
}

export interface ShakeConfig {
  intensity: number;
  duration: number;
  frequency?: number;
  falloff?: 'linear' | 'exponential' | 'constant';
}

export class Camera {
  // Camera position and dimensions
  public x: number = 0;
  public y: number = 0;
  public width: number;
  public height: number;

  // Target following
  private targetX: number = 0;
  private targetY: number = 0;
  private followSpeed: number = 0.1;
  private followDeadzone: number = 50;
  private isFollowing: boolean = false;

  // Screen shake
  private shakeOffsetX: number = 0;
  private shakeOffsetY: number = 0;
  private shakeIntensity: number = 0;
  private shakeDuration: number = 0;
  private shakeElapsed: number = 0;
  private shakeFrequency: number = 30;
  private shakeFalloff: 'linear' | 'exponential' | 'constant' = 'exponential';
  private shakeAngle: number = 0;

  // Zoom
  private zoom: number = 1;
  private targetZoom: number = 1;
  private zoomSpeed: number = 0.1;

  // Bounds (optional)
  private minX: number = -Infinity;
  private maxX: number = Infinity;
  private minY: number = -Infinity;
  private maxY: number = Infinity;

  constructor(config: CameraConfig) {
    this.x = config.x;
    this.y = config.y;
    this.width = config.width;
    this.height = config.height;
    this.followSpeed = config.followSpeed ?? 0.1;
    this.followDeadzone = config.followDeadzone ?? 50;

    this.targetX = this.x;
    this.targetY = this.y;
  }

  /**
   * Start following a target position
   */
  public follow(x: number, y: number): void {
    this.targetX = x;
    this.targetY = y;
    this.isFollowing = true;
  }

  /**
   * Stop following
   */
  public stopFollowing(): void {
    this.isFollowing = false;
  }

  /**
   * Set camera position directly (no smoothing)
   */
  public setPosition(x: number, y: number): void {
    this.x = x;
    this.y = y;
    this.targetX = x;
    this.targetY = y;
  }

  /**
   * Center camera on a point
   */
  public centerOn(x: number, y: number): void {
    this.setPosition(
      x - this.width / 2,
      y - this.height / 2
    );
  }

  /**
   * Trigger screen shake effect
   */
  public shake(config: ShakeConfig): void {
    // If already shaking, add to existing shake
    if (this.shakeDuration > 0) {
      this.shakeIntensity = Math.max(this.shakeIntensity, config.intensity);
      this.shakeDuration = Math.max(this.shakeDuration - this.shakeElapsed, config.duration);
      this.shakeElapsed = 0;
    } else {
      this.shakeIntensity = config.intensity;
      this.shakeDuration = config.duration;
      this.shakeElapsed = 0;
      this.shakeFrequency = config.frequency ?? 30;
      this.shakeFalloff = config.falloff ?? 'exponential';
    }
  }

  /**
   * Trigger a small shake (e.g., player hit)
   */
  public shakeSmall(): void {
    this.shake({
      intensity: 3,
      duration: 200,
      frequency: 25,
      falloff: 'exponential'
    });
  }

  /**
   * Trigger a medium shake (e.g., explosion)
   */
  public shakeMedium(): void {
    this.shake({
      intensity: 8,
      duration: 400,
      frequency: 30,
      falloff: 'exponential'
    });
  }

  /**
   * Trigger a large shake (e.g., boss attack)
   */
  public shakeLarge(): void {
    this.shake({
      intensity: 15,
      duration: 600,
      frequency: 35,
      falloff: 'exponential'
    });
  }

  /**
   * Set camera bounds
   */
  public setBounds(minX: number, minY: number, maxX: number, maxY: number): void {
    this.minX = minX;
    this.minY = minY;
    this.maxX = maxX;
    this.maxY = maxY;
  }

  /**
   * Clear camera bounds
   */
  public clearBounds(): void {
    this.minX = -Infinity;
    this.maxX = Infinity;
    this.minY = -Infinity;
    this.maxY = Infinity;
  }

  /**
   * Set zoom level (1 = normal, >1 = zoomed in, <1 = zoomed out)
   */
  public setZoom(zoom: number, instant: boolean = false): void {
    this.targetZoom = Math.max(0.1, Math.min(3, zoom));
    if (instant) {
      this.zoom = this.targetZoom;
    }
  }

  /**
   * Update camera state
   */
  public update(deltaTime: number): void {
    // Update smooth following
    if (this.isFollowing) {
      const centerX = this.x + this.width / 2;
      const centerY = this.y + this.height / 2;

      const dx = this.targetX - centerX;
      const dy = this.targetY - centerY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Only move if outside deadzone
      if (distance > this.followDeadzone) {
        const followAmount = this.followSpeed * (deltaTime / 16);
        this.x += dx * followAmount;
        this.y += dy * followAmount;
      }
    }

    // Update zoom
    if (Math.abs(this.zoom - this.targetZoom) > 0.001) {
      const zoomDiff = this.targetZoom - this.zoom;
      this.zoom += zoomDiff * this.zoomSpeed;
    } else {
      this.zoom = this.targetZoom;
    }

    // Update screen shake
    if (this.shakeDuration > 0) {
      this.shakeElapsed += deltaTime;

      if (this.shakeElapsed >= this.shakeDuration) {
        // Shake finished
        this.shakeDuration = 0;
        this.shakeElapsed = 0;
        this.shakeOffsetX = 0;
        this.shakeOffsetY = 0;
      } else {
        // Calculate shake intensity based on falloff
        let currentIntensity = this.shakeIntensity;
        const progress = this.shakeElapsed / this.shakeDuration;

        switch (this.shakeFalloff) {
          case 'linear':
            currentIntensity *= (1 - progress);
            break;
          case 'exponential':
            currentIntensity *= Math.pow(1 - progress, 2);
            break;
          case 'constant':
            // No falloff
            break;
        }

        // Generate shake offset using perlin-like randomness
        this.shakeAngle += (deltaTime / 1000) * this.shakeFrequency;
        const angle1 = this.shakeAngle;
        const angle2 = this.shakeAngle + Math.PI / 2;

        this.shakeOffsetX = Math.cos(angle1 * 2) * currentIntensity;
        this.shakeOffsetY = Math.sin(angle2 * 2) * currentIntensity;

        // Add some randomness
        this.shakeOffsetX += (Math.random() - 0.5) * currentIntensity * 0.5;
        this.shakeOffsetY += (Math.random() - 0.5) * currentIntensity * 0.5;
      }
    }

    // Apply bounds
    this.x = Math.max(this.minX, Math.min(this.maxX - this.width, this.x));
    this.y = Math.max(this.minY, Math.min(this.maxY - this.height, this.y));
  }

  /**
   * Apply camera transformation to canvas context
   */
  public applyTransform(ctx: CanvasRenderingContext2D): void {
    ctx.save();

    // Apply zoom
    if (this.zoom !== 1) {
      const centerX = this.width / 2;
      const centerY = this.height / 2;
      ctx.translate(centerX, centerY);
      ctx.scale(this.zoom, this.zoom);
      ctx.translate(-centerX, -centerY);
    }

    // Apply camera position (inverted because we're moving the world, not the camera)
    ctx.translate(
      -(this.x + this.shakeOffsetX),
      -(this.y + this.shakeOffsetY)
    );
  }

  /**
   * Remove camera transformation
   */
  public resetTransform(ctx: CanvasRenderingContext2D): void {
    ctx.restore();
  }

  /**
   * Convert screen coordinates to world coordinates
   */
  public screenToWorld(screenX: number, screenY: number): { x: number; y: number } {
    return {
      x: (screenX / this.zoom) + this.x + this.shakeOffsetX,
      y: (screenY / this.zoom) + this.y + this.shakeOffsetY
    };
  }

  /**
   * Convert world coordinates to screen coordinates
   */
  public worldToScreen(worldX: number, worldY: number): { x: number; y: number } {
    return {
      x: (worldX - this.x - this.shakeOffsetX) * this.zoom,
      y: (worldY - this.y - this.shakeOffsetY) * this.zoom
    };
  }

  /**
   * Check if a point is visible in the camera view
   */
  public isPointVisible(x: number, y: number, margin: number = 0): boolean {
    return (
      x >= this.x - margin &&
      x <= this.x + this.width + margin &&
      y >= this.y - margin &&
      y <= this.y + this.height + margin
    );
  }

  /**
   * Check if a rectangle is visible in the camera view
   */
  public isRectVisible(
    x: number,
    y: number,
    width: number,
    height: number,
    margin: number = 0
  ): boolean {
    return !(
      x + width < this.x - margin ||
      x > this.x + this.width + margin ||
      y + height < this.y - margin ||
      y > this.y + this.height + margin
    );
  }

  /**
   * Get camera center position
   */
  public getCenter(): { x: number; y: number } {
    return {
      x: this.x + this.width / 2,
      y: this.y + this.height / 2
    };
  }

  /**
   * Get camera viewport bounds
   */
  public getBounds(): { minX: number; minY: number; maxX: number; maxY: number } {
    return {
      minX: this.x,
      minY: this.y,
      maxX: this.x + this.width,
      maxY: this.y + this.height
    };
  }

  /**
   * Get current shake intensity
   */
  public getShakeIntensity(): number {
    return this.shakeDuration > 0 ? this.shakeIntensity : 0;
  }

  /**
   * Stop current shake immediately
   */
  public stopShake(): void {
    this.shakeDuration = 0;
    this.shakeElapsed = 0;
    this.shakeOffsetX = 0;
    this.shakeOffsetY = 0;
  }

  /**
   * Resize camera viewport
   */
  public resize(width: number, height: number): void {
    this.width = width;
    this.height = height;
  }

  /**
   * Get current zoom level
   */
  public getZoom(): number {
    return this.zoom;
  }

  /**
   * Reset camera to default state
   */
  public reset(): void {
    this.stopFollowing();
    this.stopShake();
    this.setZoom(1, true);
    this.setPosition(0, 0);
  }
}
