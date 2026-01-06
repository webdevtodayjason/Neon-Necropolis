/**
 * NEON NECROPOLIS - Main Renderer
 * Handles layered rendering with neon glow effects and additive blending
 */

import { Camera } from '../engine/Camera';
import { ParticleSystem } from '../engine/ParticleSystem';

export enum RenderLayer {
  BACKGROUND = 0,
  ENVIRONMENT = 1,
  ENTITIES = 2,
  PROJECTILES = 3,
  PARTICLES = 4,
  UI_BACKGROUND = 5,
  UI = 6,
  UI_OVERLAY = 7
}

export interface RenderConfig {
  canvas: HTMLCanvasElement;
  width: number;
  height: number;
  enableGlow?: boolean;
  enablePostProcessing?: boolean;
  backgroundColor?: string;
  backgroundGradient?: boolean;
}

export type RenderCallback = (ctx: CanvasRenderingContext2D, camera: Camera) => void;

interface LayerCallbacks {
  layer: RenderLayer;
  callbacks: RenderCallback[];
}

export class Renderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private width: number;
  private height: number;

  // Rendering options
  private enableGlow: boolean = true;
  private enablePostProcessing: boolean = true;
  private backgroundColor: string = '#0a0015';
  private backgroundGradient: boolean = true;

  // Layer management
  private layers: Map<RenderLayer, RenderCallback[]> = new Map();

  // Off-screen canvas for effects
  private effectCanvas: HTMLCanvasElement;
  private effectCtx: CanvasRenderingContext2D;

  // Performance tracking
  private frameCount: number = 0;
  private fps: number = 0;
  private lastFpsUpdate: number = 0;
  private showDebug: boolean = false;

  // Color palette
  public readonly colors = {
    background: '#0a0015',
    backgroundGradient: '#1a0033',
    cyan: '#00ffff',
    magenta: '#ff00ff',
    electricBlue: '#0080ff',
    acidGreen: '#00ff80',
    hotPink: '#ff0080',
    yellow: '#ffff00',
    white: '#ffffff',
    black: '#000000'
  };

  constructor(config: RenderConfig) {
    this.canvas = config.canvas;
    this.width = config.width;
    this.height = config.height;
    this.enableGlow = config.enableGlow ?? true;
    this.enablePostProcessing = config.enablePostProcessing ?? true;
    this.backgroundColor = config.backgroundColor ?? this.colors.background;
    this.backgroundGradient = config.backgroundGradient ?? true;

    // Get main context
    const ctx = this.canvas.getContext('2d', { alpha: false });
    if (!ctx) {
      throw new Error('Failed to get 2D context from canvas');
    }
    this.ctx = ctx;

    // Create off-screen canvas for effects
    this.effectCanvas = document.createElement('canvas');
    this.effectCanvas.width = this.width;
    this.effectCanvas.height = this.height;
    const effectCtx = this.effectCanvas.getContext('2d', { alpha: false });
    if (!effectCtx) {
      throw new Error('Failed to get 2D context from effect canvas');
    }
    this.effectCtx = effectCtx;

    // Initialize all layers
    for (const layer of Object.values(RenderLayer)) {
      if (typeof layer === 'number') {
        this.layers.set(layer, []);
      }
    }

    // Set canvas size
    this.canvas.width = this.width;
    this.canvas.height = this.height;

    // Configure rendering quality
    this.ctx.imageSmoothingEnabled = true;
    this.ctx.imageSmoothingQuality = 'high';
  }

  /**
   * Register a render callback for a specific layer
   */
  public register(layer: RenderLayer, callback: RenderCallback): void {
    const callbacks = this.layers.get(layer);
    if (callbacks) {
      callbacks.push(callback);
    }
  }

  /**
   * Unregister a render callback from a layer
   */
  public unregister(layer: RenderLayer, callback: RenderCallback): void {
    const callbacks = this.layers.get(layer);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index !== -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  /**
   * Clear all render callbacks from all layers
   */
  public clearAll(): void {
    for (const callbacks of this.layers.values()) {
      callbacks.length = 0;
    }
  }

  /**
   * Render a single frame
   */
  public render(camera: Camera, particles?: ParticleSystem, effects?: any): void {
    // Clear canvas
    this.clear();

    // Draw background
    this.renderBackground();

    // Apply camera transform for world space rendering
    camera.applyTransform(this.ctx);

    // Render all layers in order (world space)
    this.renderLayer(RenderLayer.BACKGROUND, camera);
    this.renderLayer(RenderLayer.ENVIRONMENT, camera);
    this.renderLayer(RenderLayer.ENTITIES, camera);
    this.renderLayer(RenderLayer.PROJECTILES, camera);

    // Render particles
    if (particles) {
      if (this.enableGlow) {
        this.ctx.globalCompositeOperation = 'screen'; // Additive-like blending for neon glow
      }
      particles.render(this.ctx);
      this.ctx.globalCompositeOperation = 'source-over';
    }

    this.renderLayer(RenderLayer.PARTICLES, camera);

    // Reset camera transform for UI rendering
    camera.resetTransform(this.ctx);

    // Render UI layers (screen space)
    this.renderLayer(RenderLayer.UI_BACKGROUND, camera);
    this.renderLayer(RenderLayer.UI, camera);

    // Apply post-processing effects
    if (this.enablePostProcessing && effects) {
      effects.render(this.ctx, this.canvas);
    }

    this.renderLayer(RenderLayer.UI_OVERLAY, camera);

    // Update FPS counter
    this.updateFps();

    // Draw debug info if enabled
    if (this.showDebug) {
      this.renderDebug(particles);
    }
  }

  /**
   * Render the background with gradient
   */
  private renderBackground(): void {
    if (this.backgroundGradient) {
      const gradient = this.ctx.createLinearGradient(0, 0, 0, this.height);
      gradient.addColorStop(0, this.colors.background);
      gradient.addColorStop(1, this.colors.backgroundGradient);
      this.ctx.fillStyle = gradient;
    } else {
      this.ctx.fillStyle = this.backgroundColor;
    }

    this.ctx.fillRect(0, 0, this.width, this.height);
  }

  /**
   * Render all callbacks in a specific layer
   */
  private renderLayer(layer: RenderLayer, camera: Camera): void {
    const callbacks = this.layers.get(layer);
    if (!callbacks) return;

    for (const callback of callbacks) {
      this.ctx.save();
      callback(this.ctx, camera);
      this.ctx.restore();
    }
  }

  /**
   * Clear the canvas
   */
  private clear(): void {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }

  /**
   * Update FPS counter
   */
  private updateFps(): void {
    this.frameCount++;
    const now = performance.now();

    if (now - this.lastFpsUpdate >= 1000) {
      this.fps = Math.round((this.frameCount * 1000) / (now - this.lastFpsUpdate));
      this.frameCount = 0;
      this.lastFpsUpdate = now;
    }
  }

  /**
   * Render debug information
   */
  private renderDebug(particles?: ParticleSystem): void {
    this.ctx.save();

    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    this.ctx.fillRect(10, 10, 200, particles ? 90 : 60);

    this.ctx.fillStyle = this.colors.cyan;
    this.ctx.font = '14px monospace';
    this.ctx.fillText(`FPS: ${this.fps}`, 20, 30);
    this.ctx.fillText(`Resolution: ${this.width}x${this.height}`, 20, 50);

    if (particles) {
      const activeParticles = particles.getActiveCount();
      const utilization = (particles.getPoolUtilization() * 100).toFixed(1);
      this.ctx.fillText(`Particles: ${activeParticles}`, 20, 70);
      this.ctx.fillText(`Pool: ${utilization}%`, 20, 90);
    }

    this.ctx.restore();
  }

  /**
   * Draw a glowing line (for neon effects)
   */
  public drawGlowLine(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    color: string,
    width: number = 2,
    glowIntensity: number = 10
  ): void {
    this.ctx.save();

    if (this.enableGlow) {
      this.ctx.shadowBlur = glowIntensity;
      this.ctx.shadowColor = color;
    }

    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = width;
    this.ctx.lineCap = 'round';

    this.ctx.beginPath();
    this.ctx.moveTo(x1, y1);
    this.ctx.lineTo(x2, y2);
    this.ctx.stroke();

    this.ctx.restore();
  }

  /**
   * Draw a glowing circle (for neon effects)
   */
  public drawGlowCircle(
    x: number,
    y: number,
    radius: number,
    color: string,
    filled: boolean = true,
    glowIntensity: number = 15
  ): void {
    this.ctx.save();

    if (this.enableGlow) {
      this.ctx.shadowBlur = glowIntensity;
      this.ctx.shadowColor = color;
    }

    if (filled) {
      this.ctx.fillStyle = color;
      this.ctx.beginPath();
      this.ctx.arc(x, y, radius, 0, Math.PI * 2);
      this.ctx.fill();
    } else {
      this.ctx.strokeStyle = color;
      this.ctx.lineWidth = 2;
      this.ctx.beginPath();
      this.ctx.arc(x, y, radius, 0, Math.PI * 2);
      this.ctx.stroke();
    }

    this.ctx.restore();
  }

  /**
   * Draw a glowing rectangle (for neon effects)
   */
  public drawGlowRect(
    x: number,
    y: number,
    width: number,
    height: number,
    color: string,
    filled: boolean = true,
    glowIntensity: number = 15
  ): void {
    this.ctx.save();

    if (this.enableGlow) {
      this.ctx.shadowBlur = glowIntensity;
      this.ctx.shadowColor = color;
    }

    if (filled) {
      this.ctx.fillStyle = color;
      this.ctx.fillRect(x, y, width, height);
    } else {
      this.ctx.strokeStyle = color;
      this.ctx.lineWidth = 2;
      this.ctx.strokeRect(x, y, width, height);
    }

    this.ctx.restore();
  }

  /**
   * Draw glowing text
   */
  public drawGlowText(
    text: string,
    x: number,
    y: number,
    color: string,
    fontSize: number = 16,
    glowIntensity: number = 10,
    align: CanvasTextAlign = 'left'
  ): void {
    this.ctx.save();

    if (this.enableGlow) {
      this.ctx.shadowBlur = glowIntensity;
      this.ctx.shadowColor = color;
    }

    this.ctx.fillStyle = color;
    this.ctx.font = `${fontSize}px 'Courier New', monospace`;
    this.ctx.textAlign = align;
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText(text, x, y);

    this.ctx.restore();
  }

  /**
   * Enable/disable glow effects
   */
  public setGlowEnabled(enabled: boolean): void {
    this.enableGlow = enabled;
  }

  /**
   * Enable/disable post-processing
   */
  public setPostProcessingEnabled(enabled: boolean): void {
    this.enablePostProcessing = enabled;
  }

  /**
   * Toggle debug display
   */
  public setDebugEnabled(enabled: boolean): void {
    this.showDebug = enabled;
  }

  /**
   * Get current FPS
   */
  public getFps(): number {
    return this.fps;
  }

  /**
   * Resize renderer
   */
  public resize(width: number, height: number): void {
    this.width = width;
    this.height = height;
    this.canvas.width = width;
    this.canvas.height = height;
    this.effectCanvas.width = width;
    this.effectCanvas.height = height;
  }

  /**
   * Get canvas context
   */
  public getContext(): CanvasRenderingContext2D {
    return this.ctx;
  }

  /**
   * Get canvas dimensions
   */
  public getDimensions(): { width: number; height: number } {
    return { width: this.width, height: this.height };
  }

  /**
   * Screenshot/capture current frame
   */
  public captureFrame(): string {
    return this.canvas.toDataURL('image/png');
  }

  /**
   * Flash the screen (for effects)
   */
  public flashScreen(color: string, alpha: number = 0.5): void {
    this.ctx.save();
    this.ctx.globalAlpha = alpha;
    this.ctx.fillStyle = color;
    this.ctx.fillRect(0, 0, this.width, this.height);
    this.ctx.restore();
  }
}
