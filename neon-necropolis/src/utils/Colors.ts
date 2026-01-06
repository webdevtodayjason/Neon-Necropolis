/**
 * NEON NECROPOLIS - Color Palette
 * Cyberpunk color definitions with neon glow values
 */

export const Colors = {
  // Primary neon colors
  cyan: '#00ffff',
  magenta: '#ff00ff',
  yellow: '#ffff00',

  // Extended palette
  electricBlue: '#0080ff',
  hotPink: '#ff0080',
  acidGreen: '#00ff80',
  purple: '#8800ff',
  orange: '#ff8800',

  // Weapon colors (matching WeaponTypes.ts)
  weapon: {
    pistol: '#00ffff',        // Cyan
    shotgun: '#ff8800',       // Orange
    laser: '#ff0000',         // Red
    orbital: '#00ffff',       // Cyan
    lightning: '#ffff00',     // Yellow
    missiles: '#ff00ff',      // Magenta
    flamethrower: '#ffff00',  // Yellow/Orange
    tesla: '#0080ff',         // Electric Blue
    ice: '#00ccff',           // Light Blue
    poison: '#00ff00'         // Green
  },

  // Zombie/enemy colors
  enemy: {
    basic: '#ff00ff',         // Magenta
    fast: '#ff0080',          // Hot Pink
    tank: '#ff8800',          // Orange
    exploder: '#ffff00',      // Yellow
    boss: '#ff0000'           // Red
  },

  // Effect colors
  effects: {
    blood: '#ff00ff',         // Magenta
    explosion: '#ff8800',     // Orange
    xp: '#00ffff',            // Cyan
    levelUp: '#ffff00',       // Yellow
    damage: '#ff0080',        // Hot Pink
    heal: '#00ff80',          // Acid Green
    muzzle: '#ffff00',        // Yellow
    trail: '#0080ff',         // Electric Blue
    sparkle: '#00ff80',       // Acid Green
    smoke: '#8800ff'          // Purple
  },

  // UI colors
  ui: {
    primary: '#00ffff',       // Cyan
    secondary: '#ff00ff',     // Magenta
    success: '#00ff80',       // Acid Green
    warning: '#ffff00',       // Yellow
    danger: '#ff0080',        // Hot Pink
    text: '#ffffff',          // White
    textDim: '#8888aa',       // Dim gray-blue
    background: '#0a0015',    // Dark purple-black
    backgroundDark: '#000000',// Black
    border: '#0080ff',        // Electric Blue
    glow: '#00ffff'           // Cyan glow
  },

  // Background colors
  background: {
    base: '#0a0015',          // Dark purple-black
    gradient1: '#0a0015',     // Top
    gradient2: '#1a0033',     // Bottom
    grid: '#00ffff',          // Cyan grid
    gridAlpha: 'rgba(0, 255, 255, 0.1)'
  },

  // Glow intensities (for shadowBlur)
  glow: {
    none: 0,
    subtle: 5,
    low: 10,
    medium: 15,
    high: 20,
    intense: 30,
    extreme: 50
  },

  // Standard colors
  white: '#ffffff',
  black: '#000000',
  transparent: 'rgba(0, 0, 0, 0)',

  /**
   * Get a color with alpha transparency
   */
  withAlpha(color: string, alpha: number): string {
    // Convert hex to rgba
    const hex = color.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  },

  /**
   * Get a random neon color
   */
  randomNeon(): string {
    const neonColors = [
      this.cyan,
      this.magenta,
      this.yellow,
      this.electricBlue,
      this.hotPink,
      this.acidGreen,
      this.purple,
      this.orange
    ];
    return neonColors[Math.floor(Math.random() * neonColors.length)];
  },

  /**
   * Get a random weapon color
   */
  randomWeapon(): string {
    const weaponColors = Object.values(this.weapon);
    return weaponColors[Math.floor(Math.random() * weaponColors.length)];
  },

  /**
   * Interpolate between two colors
   */
  lerp(color1: string, color2: string, t: number): string {
    const hex1 = color1.replace('#', '');
    const hex2 = color2.replace('#', '');

    const r1 = parseInt(hex1.substring(0, 2), 16);
    const g1 = parseInt(hex1.substring(2, 4), 16);
    const b1 = parseInt(hex1.substring(4, 6), 16);

    const r2 = parseInt(hex2.substring(0, 2), 16);
    const g2 = parseInt(hex2.substring(2, 4), 16);
    const b2 = parseInt(hex2.substring(4, 6), 16);

    const r = Math.round(r1 + (r2 - r1) * t);
    const g = Math.round(g1 + (g2 - g1) * t);
    const b = Math.round(b1 + (b2 - b1) * t);

    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  },

  /**
   * Get health color (green to red gradient)
   */
  getHealthColor(healthPercent: number): string {
    if (healthPercent > 0.5) {
      // Green to yellow
      return this.lerp(this.acidGreen, this.yellow, (1 - healthPercent) * 2);
    } else {
      // Yellow to red
      return this.lerp(this.yellow, this.hotPink, (0.5 - healthPercent) * 2);
    }
  }
};

// Export for convenient access
export default Colors;
