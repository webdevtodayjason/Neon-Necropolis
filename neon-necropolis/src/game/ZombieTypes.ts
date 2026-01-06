/**
 * All 9 zombie types for NEON NECROPOLIS
 */
import { ZombieConfig } from './Zombie';

export const ZOMBIE_TYPES: Record<string, ZombieConfig> = {
    SHAMBLER: {
        type: 'Shambler',
        health: 30,
        speed: 40,
        damage: 5,
        xpValue: 10,
        color: '#0f0',
        radius: 12,
        attackCooldown: 1.5
    },

    RUNNER: {
        type: 'Runner',
        health: 20,
        speed: 120,
        damage: 8,
        xpValue: 15,
        color: '#ff0',
        radius: 10,
        attackCooldown: 1.0
    },

    TANK: {
        type: 'Tank',
        health: 150,
        speed: 30,
        damage: 15,
        xpValue: 50,
        color: '#f00',
        radius: 20,
        attackCooldown: 2.0
    },

    EXPLODER: {
        type: 'Exploder',
        health: 25,
        speed: 60,
        damage: 30,
        xpValue: 25,
        color: '#f80',
        radius: 14,
        attackCooldown: 0.5,
        specialAbility: 'explode'
    },

    SPITTER: {
        type: 'Spitter',
        health: 40,
        speed: 50,
        damage: 12,
        xpValue: 20,
        color: '#0f8',
        radius: 13,
        attackCooldown: 2.0,
        specialAbility: 'ranged'
    },

    SWARM: {
        type: 'Swarm',
        health: 15,
        speed: 80,
        damage: 3,
        xpValue: 5,
        color: '#f0f',
        radius: 8,
        attackCooldown: 0.8
    },

    BRUTE: {
        type: 'Brute',
        health: 200,
        speed: 40,
        damage: 25,
        xpValue: 75,
        color: '#800',
        radius: 25,
        attackCooldown: 2.5
    },

    PHANTOM: {
        type: 'Phantom',
        health: 35,
        speed: 90,
        damage: 10,
        xpValue: 30,
        color: '#88f',
        radius: 12,
        attackCooldown: 1.2,
        specialAbility: 'teleport'
    },

    NECROMANCER: {
        type: 'Necromancer',
        health: 100,
        speed: 35,
        damage: 5,
        xpValue: 100,
        color: '#808',
        radius: 16,
        attackCooldown: 3.0,
        specialAbility: 'summon'
    }
};

/**
 * Get zombie config by type name
 */
export function getZombieConfig(type: string): ZombieConfig {
    return ZOMBIE_TYPES[type] || ZOMBIE_TYPES.SHAMBLER;
}

/**
 * Get random zombie type based on wave
 */
export function getRandomZombieType(wave: number): string {
    const types: string[] = ['SHAMBLER'];

    if (wave >= 2) types.push('RUNNER');
    if (wave >= 3) types.push('TANK');
    if (wave >= 5) types.push('EXPLODER', 'SPITTER');
    if (wave >= 8) types.push('SWARM');
    if (wave >= 10) types.push('BRUTE');
    if (wave >= 12) types.push('PHANTOM');
    if (wave >= 15) types.push('NECROMANCER');

    return types[Math.floor(Math.random() * types.length)];
}
