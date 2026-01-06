/**
 * NEON NECROPOLIS - Screen Effects
 * Screen shake, flash, and other full-screen visual effects
 */

export interface ScreenShakeConfig {
  intensity: number;
  duration: number;
  frequency?: number;
}

export class ScreenEffects {
  // Screen shake
  private shakeIntensity: number = 0;
  private shakeDuration: number = 0;
  private shakeTime: number = 0;
  private shakeFrequency: number = 0.1;
  private shakeX: number = 0;
  private shakeY: number = 0;

  // Screen flash
  private flashActive: boolean = false;
  private flashColor: string = '#ffffff';
  private flashAlpha: number = 0;
  private flashDecay: number = 0.05;

  // Freeze frame
  private freezeActive: boolean = false;
  private freezeDuration: number = 0;
  private freezeTime: number = 0;

  // Zoom effect
  private zoomActive: boolean = false;
  private zoomTarget: number = 1;
  private zoomCurrent: number = 1;
  private zoomSpeed: number = 0.1;

  // Chromatic aberration
  private chromaticActive: boolean = false;
  private chromaticIntensity: number = 0;
  private chromaticDecay: number = 0.1;

  constructor() {}

  /**
   * Update all effects
   */
  update(deltaTime: number): void {
    // Update screen shake
    if (this.shakeDuration > 0) {
      this.shakeTime += deltaTime * this.shakeFrequency;
      this.shakeDuration -= deltaTime;

      if (this.shakeDuration <= 0) {
        this.shakeIntensity = 0;
        this.shakeX = 0;
        this.shakeY = 0;
      } else {
        // Use Perlin-like noise for smooth shake
        this.shakeX = Math.sin(this.shakeTime * 10) * this.shakeIntensity;
        this.shakeY = Math.cos(this.shakeTime * 13) * this.shakeIntensity;
      }
    }

    // Update screen flash
    if (this.flashActive) {
      this.flashAlpha -= this.flashDecay * (deltaTime / 16);
      if (this.flashAlpha <= 0) {
        this.flashActive = false;
        this.flashAlpha = 0;
      }
    }

    // Update freeze frame
    if (this.freezeActive) {
      this.freezeTime += deltaTime;
      if (this.freezeTime >= this.freezeDuration) {
        this.freezeActive = false;
        this.freezeTime = 0;
      }
    }

    // Update zoom
    if (this.zoomActive) {
      const diff = this.zoomTarget - this.zoomCurrent;
      this.zoomCurrent += diff * this.zoomSpeed;

      if (Math.abs(diff) < 0.01) {
        this.zoomCurrent = this.zoomTarget;
        this.zoomActive = false;
      }
    }

    // Update chromatic aberration
    if (this.chromaticActive) {
      this.chromaticIntensity -= this.chromaticDecay * (deltaTime / 16);
      if (this.chromaticIntensity <= 0) {
        this.chromaticActive = false;
        this.chromaticIntensity = 0;
      }
    }
  }

  /**
   * Trigger screen shake
   */
  shake(config: ScreenShakeConfig): void {
    this.shakeIntensity = config.intensity;
    this.shakeDuration = config.duration;
    this.shakeFrequency = config.frequency ?? 0.1;
    this.shakeTime = 0;
  }

  /**
   * Quick shake presets
   */
  shakeSmall(): void {
    this.shake({ intensity: 3, duration: 200 });
  }

  shakeMedium(): void {
    this.shake({ intensity: 6, duration: 300 });
  }

  shakeLarge(): void {
    this.shake({ intensity: 10, duration: 400 });
  }

  shakeExplosion(): void {
    this.shake({ intensity: 15, duration: 500, frequency: 0.15 });
  }

  shakeDamage(): void {
    this.shake({ intensity: 8, duration: 250, frequency: 0.2 });
  }

  /**
   * Trigger screen flash
   */
  flash(color: string, intensity: number = 0.5, decay: number = 0.05): void {
    this.flashActive = true;
    this.flashColor = color;
    this.flashAlpha = Math.max(0, Math.min(1, intensity));
    this.flashDecay = decay;
  }

  /**
   * Quick flash presets
   */
  flashDamage(): void {
    this.flash('#ff0080', 0.4, 0.08);
  }

  flashHeal(): void {
    this.flash('#00ff80', 0.3, 0.06);
  }

  flashLevelUp(): void {
    this.flash('#00ffff', 0.6, 0.04);
  }

  flashExplosion(): void {
    this.flash('#ffff00', 0.7, 0.1);
  }

  flashDeath(): void {
    this.flash('#ff0000', 0.8, 0.03);
  }

  flashWhite(): void {
    this.flash('#ffffff', 0.9, 0.15);
  }

  /**
   * Trigger freeze frame (stop time briefly)
   */
  freeze(duration: number): void {
    this.freezeActive = true;
    this.freezeDuration = duration;
    this.freezeTime = 0;
  }

  /**
   * Quick freeze presets
   */
  freezeHit(): void {
    this.freeze(50);
  }

  freezeKill(): void {
    this.freeze(100);
  }

  freezeCritical(): void {
    this.freeze(150);
  }

  /**
   * Trigger zoom effect
   */
  zoomTo(target: number, speed: number = 0.1): void {
    this.zoomActive = true;
    this.zoomTarget = target;
    this.zoomSpeed = speed;
  }

  /**
   * Reset zoom to normal
   */
  resetZoom(): void {
    this.zoomTo(1, 0.15);
  }

  /**
   * Trigger chromatic aberration
   */
  chromaticAberration(intensity: number = 5): void {
    this.chromaticActive = true;
    this.chromaticIntensity = intensity;
  }

  /**
   * Apply screen shake transform to context
   */
  applyShake(ctx: CanvasRenderingContext2D): void {
    if (this.shakeIntensity > 0) {
      ctx.translate(this.shakeX, this.shakeY);
    }
  }

  /**
   * Render screen flash
   */
  renderFlash(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    if (this.flashActive && this.flashAlpha > 0) {
      ctx.save();
      ctx.globalAlpha = this.flashAlpha;
      ctx.fillStyle = this.flashColor;
      ctx.fillRect(0, 0, width, height);
      ctx.restore();
    }
  }

  /**
   * Apply zoom transform to context
   */
  applyZoom(ctx: CanvasRenderingContext2D, centerX: number, centerY: number): void {
    if (this.zoomCurrent !== 1) {
      ctx.translate(centerX, centerY);
      ctx.scale(this.zoomCurrent, this.zoomCurrent);
      ctx.translate(-centerX, -centerY);
    }
  }

  /**
   * Get current shake offset
   */
  getShakeOffset(): { x: number; y: number } {
    return { x: this.shakeX, y: this.shakeY };
  }

  /**
   * Check if freeze frame is active
   */
  isFrozen(): boolean {
    return this.freezeActive;
  }

  /**
   * Get current zoom level
   */
  getZoom(): number {
    return this.zoomCurrent;
  }

  /**
   * Get chromatic aberration intensity
   */
  getChromaticIntensity(): number {
    return this.chromaticIntensity;
  }

  /**
   * Clear all effects
   */
  clear(): void {
    this.shakeIntensity = 0;
    this.shakeDuration = 0;
    this.shakeX = 0;
    this.shakeY = 0;
    this.flashActive = false;
    this.flashAlpha = 0;
    this.freezeActive = false;
    this.freezeTime = 0;
    this.zoomCurrent = 1;
    this.zoomTarget = 1;
    this.zoomActive = false;
    this.chromaticActive = false;
    this.chromaticIntensity = 0;
  }

  /**
   * Combo effects for common scenarios
   */
  comboPlayerDamage(): void {
    this.shakeDamage();
    this.flashDamage();
    this.chromaticAberration(3);
  }

  comboPlayerDeath(): void {
    this.shakeExplosion();
    this.flashDeath();
    this.chromaticAberration(8);
    this.zoomTo(1.2, 0.05);
  }

  comboLevelUp(): void {
    this.shakeLarge();
    this.flashLevelUp();
    this.freezeHit();
  }

  comboBigExplosion(): void {
    this.shakeExplosion();
    this.flashExplosion();
    this.chromaticAberration(5);
    this.freezeKill();
  }

  comboCriticalHit(): void {
    this.shakeSmall();
    this.flashWhite();
    this.freezeCritical();
    this.zoomTo(1.1, 0.2);
  }
}
