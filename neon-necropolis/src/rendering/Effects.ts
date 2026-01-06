/**
 * NEON NECROPOLIS - Post-Processing Effects
 * CRT scanlines, chromatic aberration, vignette, and screen flash effects
 */

export interface EffectsConfig {
  scanlineIntensity?: number;
  scanlineSpeed?: number;
  vignetteIntensity?: number;
  chromaticAberrationEnabled?: boolean;
  crtCurvature?: boolean;
}

export class Effects {
  // Scanline effect
  private scanlineIntensity: number = 0.1;
  private scanlineSpeed: number = 0.5;
  private scanlineOffset: number = 0;
  private scanlineEnabled: boolean = true;

  // Vignette effect
  private vignetteIntensity: number = 0.5;
  private vignetteEnabled: boolean = true;

  // Chromatic aberration
  private chromaticAberrationEnabled: boolean = false;
  private chromaticAberrationIntensity: number = 0;
  private chromaticAberrationMaxIntensity: number = 5;
  private chromaticAberrationDecay: number = 0.1;

  // Screen flash
  private flashActive: boolean = false;
  private flashColor: string = '#ffffff';
  private flashAlpha: number = 0;
  private flashDecay: number = 0.05;

  // CRT curvature
  private crtCurvature: boolean = false;
  private curvatureAmount: number = 0.1;

  // Noise effect
  private noiseIntensity: number = 0.02;
  private noiseEnabled: boolean = true;

  // Off-screen canvas for effects
  private effectCanvas: HTMLCanvasElement | null = null;
  private effectCtx: CanvasRenderingContext2D | null = null;

  constructor(config?: EffectsConfig) {
    this.scanlineIntensity = config?.scanlineIntensity ?? 0.1;
    this.scanlineSpeed = config?.scanlineSpeed ?? 0.5;
    this.vignetteIntensity = config?.vignetteIntensity ?? 0.5;
    this.chromaticAberrationEnabled = config?.chromaticAberrationEnabled ?? false;
    this.crtCurvature = config?.crtCurvature ?? false;
  }

  /**
   * Initialize effect canvas (call once)
   */
  private initEffectCanvas(width: number, height: number): void {
    if (!this.effectCanvas) {
      this.effectCanvas = document.createElement('canvas');
      this.effectCanvas.width = width;
      this.effectCanvas.height = height;
      this.effectCtx = this.effectCanvas.getContext('2d', { willReadFrequently: true });
    }
  }

  /**
   * Render all post-processing effects
   */
  public render(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement): void {
    const width = canvas.width;
    const height = canvas.height;

    // Initialize effect canvas if needed
    this.initEffectCanvas(width, height);

    // Apply chromatic aberration (most intensive, do first)
    if (this.chromaticAberrationEnabled && this.chromaticAberrationIntensity > 0) {
      this.applyChromaticAberration(ctx, canvas);
    }

    // Apply scanlines
    if (this.scanlineEnabled) {
      this.applyScanlines(ctx, width, height);
    }

    // Apply vignette
    if (this.vignetteEnabled) {
      this.applyVignette(ctx, width, height);
    }

    // Apply noise
    if (this.noiseEnabled) {
      this.applyNoise(ctx, width, height);
    }

    // Apply screen flash
    if (this.flashActive) {
      this.applyFlash(ctx, width, height);
    }
  }

  /**
   * Update effects (call every frame)
   */
  public update(deltaTime: number): void {
    // Update scanline animation
    this.scanlineOffset += this.scanlineSpeed * (deltaTime / 16);
    if (this.scanlineOffset > 2) {
      this.scanlineOffset = 0;
    }

    // Decay chromatic aberration
    if (this.chromaticAberrationIntensity > 0) {
      this.chromaticAberrationIntensity -= this.chromaticAberrationDecay * (deltaTime / 16);
      if (this.chromaticAberrationIntensity < 0) {
        this.chromaticAberrationIntensity = 0;
      }
    }

    // Decay screen flash
    if (this.flashActive) {
      this.flashAlpha -= this.flashDecay;
      if (this.flashAlpha <= 0) {
        this.flashActive = false;
        this.flashAlpha = 0;
      }
    }
  }

  /**
   * Apply CRT scanline effect
   */
  private applyScanlines(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    ctx.save();
    ctx.globalCompositeOperation = 'multiply';
    ctx.globalAlpha = this.scanlineIntensity;

    // Draw horizontal scanlines
    ctx.fillStyle = '#000000';
    for (let y = this.scanlineOffset; y < height; y += 2) {
      ctx.fillRect(0, y, width, 1);
    }

    ctx.restore();
  }

  /**
   * Apply vignette effect (dark corners)
   */
  private applyVignette(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    ctx.save();

    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.sqrt(centerX * centerX + centerY * centerY);

    const gradient = ctx.createRadialGradient(
      centerX, centerY, radius * 0.3,
      centerX, centerY, radius * 1.2
    );

    gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
    gradient.addColorStop(1, `rgba(0, 0, 0, ${this.vignetteIntensity})`);

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    ctx.restore();
  }

  /**
   * Apply chromatic aberration effect
   */
  private applyChromaticAberration(
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement
  ): void {
    if (!this.effectCanvas || !this.effectCtx) return;

    const width = canvas.width;
    const height = canvas.height;
    const intensity = this.chromaticAberrationIntensity;

    // Copy current canvas to effect canvas
    this.effectCtx.clearRect(0, 0, width, height);
    this.effectCtx.drawImage(canvas, 0, 0);

    // Get image data
    const imageData = this.effectCtx.getImageData(0, 0, width, height);
    const data = imageData.data;

    // Create output image data
    const outputData = ctx.createImageData(width, height);
    const output = outputData.data;

    // Apply chromatic aberration by shifting color channels
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const i = (y * width + x) * 4;

        // Calculate offset from center
        const dx = (x - width / 2) / width;
        const dy = (y - height / 2) / height;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Red channel - shift outward
        const redOffset = Math.floor(distance * intensity);
        const redX = Math.min(width - 1, Math.max(0, x + redOffset));
        const redI = (y * width + redX) * 4;

        // Blue channel - shift inward
        const blueOffset = Math.floor(distance * intensity);
        const blueX = Math.min(width - 1, Math.max(0, x - blueOffset));
        const blueI = (y * width + blueX) * 4;

        // Apply shifted channels
        output[i] = data[redI];         // R
        output[i + 1] = data[i + 1];    // G (no shift)
        output[i + 2] = data[blueI + 2];// B
        output[i + 3] = data[i + 3];    // A
      }
    }

    // Draw modified image data
    ctx.putImageData(outputData, 0, 0);
  }

  /**
   * Apply film grain noise effect
   */
  private applyNoise(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    ctx.save();
    ctx.globalAlpha = this.noiseIntensity;
    ctx.globalCompositeOperation = 'overlay';

    const imageData = ctx.createImageData(width, height);
    const data = imageData.data;

    // Generate random noise
    for (let i = 0; i < data.length; i += 4) {
      const noise = Math.random() * 255;
      data[i] = noise;     // R
      data[i + 1] = noise; // G
      data[i + 2] = noise; // B
      data[i + 3] = 255;   // A
    }

    // Draw noise with low resolution for performance
    const noiseCanvas = document.createElement('canvas');
    noiseCanvas.width = Math.floor(width / 2);
    noiseCanvas.height = Math.floor(height / 2);
    const noiseCtx = noiseCanvas.getContext('2d');
    if (noiseCtx) {
      const scaledData = noiseCtx.createImageData(noiseCanvas.width, noiseCanvas.height);
      // Sample every other pixel
      for (let y = 0; y < noiseCanvas.height; y++) {
        for (let x = 0; x < noiseCanvas.width; x++) {
          const srcIdx = ((y * 2) * width + (x * 2)) * 4;
          const dstIdx = (y * noiseCanvas.width + x) * 4;
          scaledData.data[dstIdx] = data[srcIdx];
          scaledData.data[dstIdx + 1] = data[srcIdx + 1];
          scaledData.data[dstIdx + 2] = data[srcIdx + 2];
          scaledData.data[dstIdx + 3] = data[srcIdx + 3];
        }
      }
      noiseCtx.putImageData(scaledData, 0, 0);
      ctx.drawImage(noiseCanvas, 0, 0, width, height);
    }

    ctx.restore();
  }

  /**
   * Apply screen flash effect
   */
  private applyFlash(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    ctx.save();
    ctx.globalAlpha = this.flashAlpha;
    ctx.fillStyle = this.flashColor;
    ctx.fillRect(0, 0, width, height);
    ctx.restore();
  }

  /**
   * Trigger chromatic aberration effect (on player damage)
   */
  public triggerChromaticAberration(intensity: number = 5): void {
    this.chromaticAberrationEnabled = true;
    this.chromaticAberrationIntensity = Math.min(
      intensity,
      this.chromaticAberrationMaxIntensity
    );
  }

  /**
   * Trigger screen flash effect
   */
  public flash(color: string, intensity: number = 0.5): void {
    this.flashActive = true;
    this.flashColor = color;
    this.flashAlpha = Math.max(0, Math.min(1, intensity));
  }

  /**
   * Quick flash presets
   */
  public flashDamage(): void {
    this.flash('#ff0080', 0.4); // Hot pink
  }

  public flashHeal(): void {
    this.flash('#00ff80', 0.3); // Acid green
  }

  public flashLevelUp(): void {
    this.flash('#00ffff', 0.6); // Cyan
  }

  public flashExplosion(): void {
    this.flash('#ffff00', 0.7); // Yellow
  }

  /**
   * Enable/disable scanlines
   */
  public setScanlineEnabled(enabled: boolean): void {
    this.scanlineEnabled = enabled;
  }

  /**
   * Set scanline intensity
   */
  public setScanlineIntensity(intensity: number): void {
    this.scanlineIntensity = Math.max(0, Math.min(1, intensity));
  }

  /**
   * Enable/disable vignette
   */
  public setVignetteEnabled(enabled: boolean): void {
    this.vignetteEnabled = enabled;
  }

  /**
   * Set vignette intensity
   */
  public setVignetteIntensity(intensity: number): void {
    this.vignetteIntensity = Math.max(0, Math.min(1, intensity));
  }

  /**
   * Enable/disable noise
   */
  public setNoiseEnabled(enabled: boolean): void {
    this.noiseEnabled = enabled;
  }

  /**
   * Set noise intensity
   */
  public setNoiseIntensity(intensity: number): void {
    this.noiseIntensity = Math.max(0, Math.min(1, intensity));
  }

  /**
   * Enable/disable chromatic aberration
   */
  public setChromaticAberrationEnabled(enabled: boolean): void {
    this.chromaticAberrationEnabled = enabled;
    if (!enabled) {
      this.chromaticAberrationIntensity = 0;
    }
  }

  /**
   * Reset all effects to default
   */
  public reset(): void {
    this.scanlineOffset = 0;
    this.chromaticAberrationIntensity = 0;
    this.flashActive = false;
    this.flashAlpha = 0;
  }

  /**
   * Dispose of resources
   */
  public dispose(): void {
    this.effectCanvas = null;
    this.effectCtx = null;
  }

  /**
   * Get current settings
   */
  public getSettings() {
    return {
      scanlineEnabled: this.scanlineEnabled,
      scanlineIntensity: this.scanlineIntensity,
      vignetteEnabled: this.vignetteEnabled,
      vignetteIntensity: this.vignetteIntensity,
      noiseEnabled: this.noiseEnabled,
      noiseIntensity: this.noiseIntensity,
      chromaticAberrationEnabled: this.chromaticAberrationEnabled
    };
  }
}
