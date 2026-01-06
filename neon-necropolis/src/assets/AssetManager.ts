/**
 * AssetManager.ts
 * Centralized asset loading and management for NEON NECROPOLIS
 * Handles sprites, audio, and other game assets
 */

export interface SpriteAsset {
  image: HTMLImageElement;
  loaded: boolean;
  width: number;
  height: number;
}

export interface AudioAsset {
  buffer: AudioBuffer | null;
  loaded: boolean;
}

export class AssetManager {
  private static instance: AssetManager | null = null;

  private sprites: Map<string, SpriteAsset> = new Map();
  private audio: Map<string, HTMLAudioElement> = new Map();
  private loadingProgress: number = 0;
  private totalAssets: number = 0;
  private loadedAssets: number = 0;
  private onProgressCallback: ((progress: number) => void) | null = null;

  // Asset paths
  private readonly SPRITE_BASE = '/src/assets/sprites/';
  private readonly AUDIO_BASE = '/src/assets/audio/';
  private readonly BG_BASE = '/src/assets/backgrounds/';
  private readonly UI_BASE = '/src/assets/ui/';

  private constructor() {}

  static getInstance(): AssetManager {
    if (!AssetManager.instance) {
      AssetManager.instance = new AssetManager();
    }
    return AssetManager.instance;
  }

  /**
   * Set progress callback
   */
  setProgressCallback(callback: (progress: number) => void): void {
    this.onProgressCallback = callback;
  }

  /**
   * Load all game assets
   */
  async loadAll(): Promise<void> {
    console.log('[AssetManager] Starting asset loading...');

    const assetList = this.getAssetList();
    this.totalAssets = assetList.sprites.length + assetList.sfx.length + assetList.music.length;
    this.loadedAssets = 0;

    // Load all sprites
    const spritePromises = assetList.sprites.map(sprite =>
      this.loadSprite(sprite.key, sprite.path)
    );

    // Load all SFX
    const sfxPromises = assetList.sfx.map(sfx =>
      this.loadAudio(sfx.key, sfx.path)
    );

    // Load all music
    const musicPromises = assetList.music.map(music =>
      this.loadAudio(music.key, music.path)
    );

    await Promise.all([...spritePromises, ...sfxPromises, ...musicPromises]);

    console.log(`[AssetManager] Loaded ${this.loadedAssets}/${this.totalAssets} assets`);
  }

  /**
   * Get list of all assets to load
   */
  private getAssetList() {
    return {
      sprites: [
        // Player
        { key: 'player_idle', path: this.SPRITE_BASE + 'player/player_idle.png' },
        { key: 'player_walk_1', path: this.SPRITE_BASE + 'player/player_walk_1.png' },
        { key: 'player_walk_2', path: this.SPRITE_BASE + 'player/player_walk_2.png' },

        // Enemies
        { key: 'enemy_shambler', path: this.SPRITE_BASE + 'enemies/shambler.png' },
        { key: 'enemy_runner', path: this.SPRITE_BASE + 'enemies/runner.png' },
        { key: 'enemy_tank', path: this.SPRITE_BASE + 'enemies/tank.png' },
        { key: 'enemy_exploder', path: this.SPRITE_BASE + 'enemies/exploder.png' },
        { key: 'enemy_spitter', path: this.SPRITE_BASE + 'enemies/spitter.png' },
        { key: 'enemy_swarm', path: this.SPRITE_BASE + 'enemies/swarm.png' },
        { key: 'enemy_brute', path: this.SPRITE_BASE + 'enemies/brute.png' },
        { key: 'enemy_phantom', path: this.SPRITE_BASE + 'enemies/phantom.png' },
        { key: 'enemy_necromancer', path: this.SPRITE_BASE + 'enemies/necromancer.png' },

        // Loot
        { key: 'loot_chest_closed', path: this.SPRITE_BASE + 'loot/chest_closed.png' },
        { key: 'loot_chest_open', path: this.SPRITE_BASE + 'loot/chest_open.png' },
        { key: 'loot_coin', path: this.SPRITE_BASE + 'loot/coin.png' },
        { key: 'loot_health_pack', path: this.SPRITE_BASE + 'loot/health_pack.png' },
        { key: 'loot_ammo_box', path: this.SPRITE_BASE + 'loot/ammo_box.png' },
        { key: 'loot_gear_upgrade', path: this.SPRITE_BASE + 'loot/gear_upgrade.png' },

        // Weapon effects
        { key: 'effect_bullet', path: this.SPRITE_BASE + 'effects/bullet.png' },
        { key: 'effect_shotgun', path: this.SPRITE_BASE + 'effects/shotgun_pellets.png' },
        { key: 'effect_laser', path: this.SPRITE_BASE + 'effects/laser_beam.png' },
        { key: 'effect_lightning', path: this.SPRITE_BASE + 'effects/lightning_bolt.png' },
        { key: 'effect_missile', path: this.SPRITE_BASE + 'effects/missile.png' },
        { key: 'effect_flame', path: this.SPRITE_BASE + 'effects/flame_burst.png' },
        { key: 'effect_ice', path: this.SPRITE_BASE + 'effects/ice_shard.png' },
        { key: 'effect_poison', path: this.SPRITE_BASE + 'effects/poison_cloud.png' },
        { key: 'effect_energy', path: this.SPRITE_BASE + 'effects/energy_orb.png' },
        { key: 'effect_tesla', path: this.SPRITE_BASE + 'effects/tesla_arc.png' },

        // Obstacles
        { key: 'obstacle_rock', path: this.SPRITE_BASE + 'obstacles/rock_large.png' },
        { key: 'obstacle_barrel', path: this.SPRITE_BASE + 'obstacles/barrel.png' },
        { key: 'obstacle_car_wreck', path: this.SPRITE_BASE + 'obstacles/car_wreck.png' },
        { key: 'obstacle_crate', path: this.SPRITE_BASE + 'obstacles/crate.png' },
        { key: 'obstacle_barrier', path: this.SPRITE_BASE + 'obstacles/barrier.png' },

        // Backgrounds
        { key: 'bg_wasteland', path: this.BG_BASE + 'wasteland_ground.png' },
        { key: 'bg_ruins', path: this.BG_BASE + 'ruins_tile.png' },

        // UI
        { key: 'ui_health_frame', path: this.UI_BASE + 'health_bar_frame.png' },
        { key: 'ui_xp_frame', path: this.UI_BASE + 'xp_bar_frame.png' },
      ],
      sfx: [
        { key: 'sfx_pistol', path: this.AUDIO_BASE + 'sfx/pistol_fire.mp3' },
        { key: 'sfx_shotgun', path: this.AUDIO_BASE + 'sfx/shotgun_fire.mp3' },
        { key: 'sfx_laser', path: this.AUDIO_BASE + 'sfx/laser_fire.mp3' },
        { key: 'sfx_lightning', path: this.AUDIO_BASE + 'sfx/lightning_zap.mp3' },
        { key: 'sfx_missile', path: this.AUDIO_BASE + 'sfx/missile_launch.mp3' },
        { key: 'sfx_flamethrower', path: this.AUDIO_BASE + 'sfx/flamethrower.mp3' },
        { key: 'sfx_ice', path: this.AUDIO_BASE + 'sfx/ice_freeze.mp3' },
        { key: 'sfx_poison', path: this.AUDIO_BASE + 'sfx/poison_bubble.mp3' },
        { key: 'sfx_zombie_moan', path: this.AUDIO_BASE + 'sfx/zombie_moan.mp3' },
        { key: 'sfx_zombie_death', path: this.AUDIO_BASE + 'sfx/zombie_death.mp3' },
        { key: 'sfx_explosion', path: this.AUDIO_BASE + 'sfx/explosion.mp3' },
        { key: 'sfx_mutant_roar', path: this.AUDIO_BASE + 'sfx/mutant_roar.mp3' },
        { key: 'sfx_player_hurt', path: this.AUDIO_BASE + 'sfx/player_hurt.mp3' },
        { key: 'sfx_player_death', path: this.AUDIO_BASE + 'sfx/player_death.mp3' },
        { key: 'sfx_level_up', path: this.AUDIO_BASE + 'sfx/level_up.mp3' },
        { key: 'sfx_xp_pickup', path: this.AUDIO_BASE + 'sfx/xp_pickup.mp3' },
        { key: 'sfx_chest_open', path: this.AUDIO_BASE + 'sfx/chest_open.mp3' },
      ],
      music: [
        { key: 'music_main', path: this.AUDIO_BASE + 'music/main_theme.mp3' },
        { key: 'music_combat', path: this.AUDIO_BASE + 'music/combat_intense.mp3' },
        { key: 'music_ambient', path: this.AUDIO_BASE + 'music/ambient_wasteland.mp3' },
      ]
    };
  }

  /**
   * Load a sprite image
   */
  private loadSprite(key: string, path: string): Promise<void> {
    return new Promise((resolve) => {
      const img = new Image();

      img.onload = () => {
        this.sprites.set(key, {
          image: img,
          loaded: true,
          width: img.width,
          height: img.height
        });
        this.updateProgress();
        resolve();
      };

      img.onerror = () => {
        console.warn(`[AssetManager] Failed to load sprite: ${path}`);
        this.sprites.set(key, {
          image: img,
          loaded: false,
          width: 0,
          height: 0
        });
        this.updateProgress();
        resolve();
      };

      img.src = path;
    });
  }

  /**
   * Load an audio file
   */
  private loadAudio(key: string, path: string): Promise<void> {
    return new Promise((resolve) => {
      const audio = new Audio();

      audio.oncanplaythrough = () => {
        this.audio.set(key, audio);
        this.updateProgress();
        resolve();
      };

      audio.onerror = () => {
        console.warn(`[AssetManager] Failed to load audio: ${path}`);
        this.updateProgress();
        resolve();
      };

      audio.src = path;
      audio.load();
    });
  }

  /**
   * Update loading progress
   */
  private updateProgress(): void {
    this.loadedAssets++;
    this.loadingProgress = this.loadedAssets / this.totalAssets;

    if (this.onProgressCallback) {
      this.onProgressCallback(this.loadingProgress);
    }
  }

  /**
   * Get a sprite by key
   */
  getSprite(key: string): SpriteAsset | undefined {
    return this.sprites.get(key);
  }

  /**
   * Get sprite image directly
   */
  getSpriteImage(key: string): HTMLImageElement | null {
    const sprite = this.sprites.get(key);
    return sprite?.loaded ? sprite.image : null;
  }

  /**
   * Draw a sprite to canvas
   */
  drawSprite(
    ctx: CanvasRenderingContext2D,
    key: string,
    x: number,
    y: number,
    width?: number,
    height?: number,
    rotation?: number
  ): boolean {
    const sprite = this.sprites.get(key);
    if (!sprite?.loaded) return false;

    const w = width ?? sprite.width;
    const h = height ?? sprite.height;

    ctx.save();

    if (rotation) {
      ctx.translate(x + w / 2, y + h / 2);
      ctx.rotate(rotation);
      ctx.drawImage(sprite.image, -w / 2, -h / 2, w, h);
    } else {
      ctx.drawImage(sprite.image, x, y, w, h);
    }

    ctx.restore();
    return true;
  }

  /**
   * Draw a sprite centered at position
   */
  drawSpriteCentered(
    ctx: CanvasRenderingContext2D,
    key: string,
    x: number,
    y: number,
    scale: number = 1,
    rotation?: number
  ): boolean {
    const sprite = this.sprites.get(key);
    if (!sprite?.loaded) return false;

    const w = sprite.width * scale;
    const h = sprite.height * scale;

    ctx.save();
    ctx.translate(x, y);

    if (rotation) {
      ctx.rotate(rotation);
    }

    ctx.drawImage(sprite.image, -w / 2, -h / 2, w, h);
    ctx.restore();

    return true;
  }

  /**
   * Play a sound effect
   */
  playSFX(key: string, volume: number = 1): void {
    const audio = this.audio.get(key);
    if (audio) {
      const clone = audio.cloneNode() as HTMLAudioElement;
      clone.volume = Math.max(0, Math.min(1, volume));
      clone.play().catch(() => {});
    }
  }

  /**
   * Play music track
   */
  playMusic(key: string, volume: number = 0.5, loop: boolean = true): HTMLAudioElement | null {
    const audio = this.audio.get(key);
    if (audio) {
      audio.volume = Math.max(0, Math.min(1, volume));
      audio.loop = loop;
      audio.play().catch(() => {});
      return audio;
    }
    return null;
  }

  /**
   * Stop music
   */
  stopMusic(key: string): void {
    const audio = this.audio.get(key);
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
  }

  /**
   * Get loading progress (0-1)
   */
  getProgress(): number {
    return this.loadingProgress;
  }

  /**
   * Check if all assets are loaded
   */
  isLoaded(): boolean {
    return this.loadedAssets >= this.totalAssets;
  }

  /**
   * Get enemy sprite key from zombie type
   */
  getEnemySpriteKey(zombieType: string): string {
    const typeMap: Record<string, string> = {
      'Shambler': 'enemy_shambler',
      'Runner': 'enemy_runner',
      'Tank': 'enemy_tank',
      'Exploder': 'enemy_exploder',
      'Spitter': 'enemy_spitter',
      'Swarm': 'enemy_swarm',
      'Brute': 'enemy_brute',
      'Phantom': 'enemy_phantom',
      'Necromancer': 'enemy_necromancer',
    };
    return typeMap[zombieType] || 'enemy_shambler';
  }

  /**
   * Get weapon effect sprite key
   */
  getWeaponEffectKey(weaponName: string): string {
    const effectMap: Record<string, string> = {
      'Pistol': 'effect_bullet',
      'Shotgun': 'effect_shotgun',
      'Laser': 'effect_laser',
      'Lightning': 'effect_lightning',
      'Missiles': 'effect_missile',
      'Flamethrower': 'effect_flame',
      'Ice': 'effect_ice',
      'Poison': 'effect_poison',
      'Orbital': 'effect_energy',
      'Tesla': 'effect_tesla',
    };
    return effectMap[weaponName] || 'effect_bullet';
  }

  /**
   * Get weapon SFX key
   */
  getWeaponSFXKey(weaponName: string): string {
    const sfxMap: Record<string, string> = {
      'Pistol': 'sfx_pistol',
      'Shotgun': 'sfx_shotgun',
      'Laser': 'sfx_laser',
      'Lightning': 'sfx_lightning',
      'Missiles': 'sfx_missile',
      'Flamethrower': 'sfx_flamethrower',
      'Ice': 'sfx_ice',
      'Poison': 'sfx_poison',
    };
    return sfxMap[weaponName] || 'sfx_pistol';
  }
}

// Export singleton getter
export const getAssetManager = () => AssetManager.getInstance();
