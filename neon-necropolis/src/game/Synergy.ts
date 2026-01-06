/**
 * Synergy system for weapon combinations
 */
import { Weapon } from './Weapon';

export interface Synergy {
    name: string;
    weapons: string[];
    description: string;
    effect: string;
}

export const SYNERGIES: Synergy[] = [
    {
        name: 'Elemental Fury',
        weapons: ['Ice', 'Flamethrower', 'Lightning'],
        description: 'All elemental weapons deal +50% damage',
        effect: 'damage_boost_50'
    },
    {
        name: 'Tech Arsenal',
        weapons: ['Laser', 'Tesla', 'Orbital'],
        description: 'Tech weapons fire 30% faster',
        effect: 'fire_rate_boost_30'
    },
    {
        name: 'Heavy Artillery',
        weapons: ['Missiles', 'Shotgun'],
        description: 'Explosive weapons have +2 projectiles',
        effect: 'projectile_boost_2'
    },
    {
        name: 'Rapid Assault',
        weapons: ['Pistol', 'Lightning', 'Poison'],
        description: 'Fast weapons get +1 pierce',
        effect: 'pierce_boost_1'
    },
    {
        name: 'Death Blossom',
        weapons: ['Orbital', 'Tesla', 'Missiles'],
        description: 'AoE weapons have larger radius',
        effect: 'aoe_boost'
    }
];

export class SynergySystem {
    private activeSynergies: Set<string> = new Set();

    /**
     * Check and update active synergies based on owned weapons
     */
    update(weapons: Weapon[]): void {
        const weaponNames = new Set(weapons.map(w => w.name));
        this.activeSynergies.clear();

        for (const synergy of SYNERGIES) {
            const hasAll = synergy.weapons.every(w => weaponNames.has(w));
            if (hasAll) {
                this.activeSynergies.add(synergy.name);
                this.applySynergy(synergy, weapons);
            }
        }
    }

    /**
     * Apply synergy effects to weapons
     */
    private applySynergy(synergy: Synergy, weapons: Weapon[]): void {
        const affectedWeapons = weapons.filter(w => synergy.weapons.includes(w.name));

        for (const weapon of affectedWeapons) {
            switch (synergy.effect) {
                case 'damage_boost_50':
                    // Applied as multiplier in damage calculation
                    break;
                case 'fire_rate_boost_30':
                    // Applied as multiplier in fire rate
                    break;
                case 'projectile_boost_2':
                    // Applied as addition to projectile count
                    break;
                case 'pierce_boost_1':
                    // Applied as addition to pierce count
                    break;
                case 'aoe_boost':
                    // Applied to AoE radius
                    break;
            }
        }
    }

    /**
     * Get active synergies
     */
    getActiveSynergies(): Synergy[] {
        return SYNERGIES.filter(s => this.activeSynergies.has(s.name));
    }

    /**
     * Check if a specific synergy is active
     */
    hasSynergy(name: string): boolean {
        return this.activeSynergies.has(name);
    }

    /**
     * Get damage multiplier for weapon from synergies
     */
    getDamageMultiplier(weaponName: string): number {
        let multiplier = 1.0;

        if (this.hasSynergy('Elemental Fury')) {
            if (['Ice', 'Flamethrower', 'Lightning'].includes(weaponName)) {
                multiplier *= 1.5;
            }
        }

        return multiplier;
    }

    /**
     * Get fire rate multiplier for weapon from synergies
     */
    getFireRateMultiplier(weaponName: string): number {
        let multiplier = 1.0;

        if (this.hasSynergy('Tech Arsenal')) {
            if (['Laser', 'Tesla', 'Orbital'].includes(weaponName)) {
                multiplier *= 1.3;
            }
        }

        return multiplier;
    }

    /**
     * Get projectile count bonus for weapon from synergies
     */
    getProjectileBonus(weaponName: string): number {
        let bonus = 0;

        if (this.hasSynergy('Heavy Artillery')) {
            if (['Missiles', 'Shotgun'].includes(weaponName)) {
                bonus += 2;
            }
        }

        return bonus;
    }

    /**
     * Get pierce bonus for weapon from synergies
     */
    getPierceBonus(weaponName: string): number {
        let bonus = 0;

        if (this.hasSynergy('Rapid Assault')) {
            if (['Pistol', 'Lightning', 'Poison'].includes(weaponName)) {
                bonus += 1;
            }
        }

        return bonus;
    }
}
