/**
 * All 10 weapon types for NEON NECROPOLIS
 */
import { WeaponStats } from './Weapon';

export const WEAPON_TYPES: Record<string, WeaponStats> = {
    PISTOL: {
        name: 'Pistol',
        damage: 10,
        fireRate: 3,
        projectileSpeed: 400,
        projectileCount: 1,
        piercing: 0,
        spread: 0,
        color: '#fff',
        projectileRadius: 4
    },

    SHOTGUN: {
        name: 'Shotgun',
        damage: 8,
        fireRate: 1.5,
        projectileSpeed: 350,
        projectileCount: 5,
        piercing: 0,
        spread: Math.PI / 6, // 30 degrees
        color: '#f80',
        projectileRadius: 5
    },

    LASER: {
        name: 'Laser',
        damage: 15,
        fireRate: 5,
        projectileSpeed: 600,
        projectileCount: 1,
        piercing: 3,
        spread: 0,
        color: '#f00',
        projectileRadius: 3
    },

    ORBITAL: {
        name: 'Orbital',
        damage: 25,
        fireRate: 2,
        projectileSpeed: 300,
        projectileCount: 3,
        piercing: 1,
        spread: Math.PI * 2 / 3, // 120 degrees between shots
        color: '#0ff',
        projectileRadius: 6,
        special: 'orbital'
    },

    LIGHTNING: {
        name: 'Lightning',
        damage: 20,
        fireRate: 4,
        projectileSpeed: 500,
        projectileCount: 1,
        piercing: 5,
        spread: 0,
        color: '#ff0',
        projectileRadius: 4,
        special: 'chain'
    },

    MISSILES: {
        name: 'Missiles',
        damage: 40,
        fireRate: 1,
        projectileSpeed: 250,
        projectileCount: 2,
        piercing: 0,
        spread: Math.PI / 8,
        color: '#f0f',
        projectileRadius: 7,
        special: 'explosive'
    },

    FLAMETHROWER: {
        name: 'Flamethrower',
        damage: 5,
        fireRate: 10,
        projectileSpeed: 200,
        projectileCount: 3,
        piercing: 2,
        spread: Math.PI / 4,
        color: '#f50',
        projectileRadius: 6,
        range: 300,
        special: 'dot'
    },

    TESLA: {
        name: 'Tesla',
        damage: 30,
        fireRate: 2,
        projectileSpeed: 400,
        projectileCount: 1,
        piercing: 8,
        spread: 0,
        color: '#08f',
        projectileRadius: 5,
        special: 'aoe'
    },

    ICE: {
        name: 'Ice',
        damage: 12,
        fireRate: 3,
        projectileSpeed: 350,
        projectileCount: 1,
        piercing: 1,
        spread: 0,
        color: '#0af',
        projectileRadius: 5,
        special: 'slow'
    },

    POISON: {
        name: 'Poison',
        damage: 8,
        fireRate: 4,
        projectileSpeed: 300,
        projectileCount: 2,
        piercing: 2,
        spread: Math.PI / 12,
        color: '#0f0',
        projectileRadius: 4,
        special: 'poison'
    }
};

/**
 * Get weapon stats by name
 */
export function getWeaponStats(name: string): WeaponStats {
    return WEAPON_TYPES[name] || WEAPON_TYPES.PISTOL;
}

/**
 * Get all weapon names
 */
export function getAllWeaponNames(): string[] {
    return Object.keys(WEAPON_TYPES);
}

/**
 * Get random weapon name (excluding ones already owned)
 */
export function getRandomWeaponName(exclude: string[] = []): string {
    const available = getAllWeaponNames().filter(name => !exclude.includes(name));
    if (available.length === 0) return 'PISTOL';
    return available[Math.floor(Math.random() * available.length)];
}
