/**
 * Synergy system tests
 * Tests weapon synergies, combinations, and bonus calculations
 */
import { SynergySystem, SYNERGIES } from '../src/game/Synergy';
import { Weapon } from '../src/game/Weapon';
import { getWeaponStats } from '../src/game/WeaponTypes';

describe('SynergySystem', () => {
  let synergySystem: SynergySystem;

  beforeEach(() => {
    synergySystem = new SynergySystem();
  });

  describe('Initialization', () => {
    test('should initialize with no active synergies', () => {
      expect(synergySystem.getActiveSynergies()).toHaveLength(0);
    });

    test('should have defined synergies list', () => {
      expect(SYNERGIES).toBeDefined();
      expect(SYNERGIES.length).toBeGreaterThan(0);
    });

    test('should have Elemental Fury synergy', () => {
      const synergy = SYNERGIES.find(s => s.name === 'Elemental Fury');
      expect(synergy).toBeDefined();
      expect(synergy?.weapons).toContain('Ice');
      expect(synergy?.weapons).toContain('Flamethrower');
      expect(synergy?.weapons).toContain('Lightning');
    });

    test('should have Tech Arsenal synergy', () => {
      const synergy = SYNERGIES.find(s => s.name === 'Tech Arsenal');
      expect(synergy).toBeDefined();
      expect(synergy?.weapons).toContain('Laser');
      expect(synergy?.weapons).toContain('Tesla');
      expect(synergy?.weapons).toContain('Orbital');
    });

    test('should have Heavy Artillery synergy', () => {
      const synergy = SYNERGIES.find(s => s.name === 'Heavy Artillery');
      expect(synergy).toBeDefined();
      expect(synergy?.weapons).toContain('Missiles');
      expect(synergy?.weapons).toContain('Shotgun');
    });

    test('should have Rapid Assault synergy', () => {
      const synergy = SYNERGIES.find(s => s.name === 'Rapid Assault');
      expect(synergy).toBeDefined();
      expect(synergy?.weapons).toContain('Pistol');
      expect(synergy?.weapons).toContain('Lightning');
      expect(synergy?.weapons).toContain('Poison');
    });

    test('should have Death Blossom synergy', () => {
      const synergy = SYNERGIES.find(s => s.name === 'Death Blossom');
      expect(synergy).toBeDefined();
      expect(synergy?.weapons).toContain('Orbital');
      expect(synergy?.weapons).toContain('Tesla');
      expect(synergy?.weapons).toContain('Missiles');
    });
  });

  describe('Synergy Detection', () => {
    test('should not activate synergy with no weapons', () => {
      synergySystem.update([]);
      expect(synergySystem.getActiveSynergies()).toHaveLength(0);
    });

    test('should not activate synergy with only one weapon', () => {
      const weapons = [new Weapon(getWeaponStats('PISTOL'))];
      synergySystem.update(weapons);
      expect(synergySystem.getActiveSynergies()).toHaveLength(0);
    });

    test('should not activate synergy with partial weapon set', () => {
      const weapons = [
        new Weapon(getWeaponStats('ICE')),
        new Weapon(getWeaponStats('FLAMETHROWER'))
      ];
      synergySystem.update(weapons);
      expect(synergySystem.hasSynergy('Elemental Fury')).toBe(false);
    });

    test('should activate Elemental Fury with all elemental weapons', () => {
      const weapons = [
        new Weapon(getWeaponStats('ICE')),
        new Weapon(getWeaponStats('FLAMETHROWER')),
        new Weapon(getWeaponStats('LIGHTNING'))
      ];
      synergySystem.update(weapons);
      expect(synergySystem.hasSynergy('Elemental Fury')).toBe(true);
    });

    test('should activate Tech Arsenal with all tech weapons', () => {
      const weapons = [
        new Weapon(getWeaponStats('LASER')),
        new Weapon(getWeaponStats('TESLA')),
        new Weapon(getWeaponStats('ORBITAL'))
      ];
      synergySystem.update(weapons);
      expect(synergySystem.hasSynergy('Tech Arsenal')).toBe(true);
    });

    test('should activate Heavy Artillery with required weapons', () => {
      const weapons = [
        new Weapon(getWeaponStats('MISSILES')),
        new Weapon(getWeaponStats('SHOTGUN'))
      ];
      synergySystem.update(weapons);
      expect(synergySystem.hasSynergy('Heavy Artillery')).toBe(true);
    });

    test('should activate Rapid Assault with required weapons', () => {
      const weapons = [
        new Weapon(getWeaponStats('PISTOL')),
        new Weapon(getWeaponStats('LIGHTNING')),
        new Weapon(getWeaponStats('POISON'))
      ];
      synergySystem.update(weapons);
      expect(synergySystem.hasSynergy('Rapid Assault')).toBe(true);
    });

    test('should activate Death Blossom with required weapons', () => {
      const weapons = [
        new Weapon(getWeaponStats('ORBITAL')),
        new Weapon(getWeaponStats('TESLA')),
        new Weapon(getWeaponStats('MISSILES'))
      ];
      synergySystem.update(weapons);
      expect(synergySystem.hasSynergy('Death Blossom')).toBe(true);
    });

    test('should activate multiple synergies simultaneously', () => {
      const weapons = [
        new Weapon(getWeaponStats('LASER')),
        new Weapon(getWeaponStats('TESLA')),
        new Weapon(getWeaponStats('ORBITAL')),
        new Weapon(getWeaponStats('MISSILES'))
      ];
      synergySystem.update(weapons);

      expect(synergySystem.hasSynergy('Tech Arsenal')).toBe(true);
      expect(synergySystem.hasSynergy('Death Blossom')).toBe(true);
    });

    test('should deactivate synergy when weapon is removed', () => {
      const weapons = [
        new Weapon(getWeaponStats('ICE')),
        new Weapon(getWeaponStats('FLAMETHROWER')),
        new Weapon(getWeaponStats('LIGHTNING'))
      ];
      synergySystem.update(weapons);
      expect(synergySystem.hasSynergy('Elemental Fury')).toBe(true);

      // Remove one weapon
      weapons.pop();
      synergySystem.update(weapons);
      expect(synergySystem.hasSynergy('Elemental Fury')).toBe(false);
    });
  });

  describe('Damage Multiplier', () => {
    test('should return 1.0 multiplier with no synergies', () => {
      expect(synergySystem.getDamageMultiplier('Pistol')).toBe(1.0);
    });

    test('should return 1.5 multiplier for Ice with Elemental Fury', () => {
      const weapons = [
        new Weapon(getWeaponStats('ICE')),
        new Weapon(getWeaponStats('FLAMETHROWER')),
        new Weapon(getWeaponStats('LIGHTNING'))
      ];
      synergySystem.update(weapons);
      expect(synergySystem.getDamageMultiplier('Ice')).toBe(1.5);
    });

    test('should return 1.5 multiplier for Flamethrower with Elemental Fury', () => {
      const weapons = [
        new Weapon(getWeaponStats('ICE')),
        new Weapon(getWeaponStats('FLAMETHROWER')),
        new Weapon(getWeaponStats('LIGHTNING'))
      ];
      synergySystem.update(weapons);
      expect(synergySystem.getDamageMultiplier('Flamethrower')).toBe(1.5);
    });

    test('should return 1.5 multiplier for Lightning with Elemental Fury', () => {
      const weapons = [
        new Weapon(getWeaponStats('ICE')),
        new Weapon(getWeaponStats('FLAMETHROWER')),
        new Weapon(getWeaponStats('LIGHTNING'))
      ];
      synergySystem.update(weapons);
      expect(synergySystem.getDamageMultiplier('Lightning')).toBe(1.5);
    });

    test('should return 1.0 for non-elemental weapons with Elemental Fury', () => {
      const weapons = [
        new Weapon(getWeaponStats('ICE')),
        new Weapon(getWeaponStats('FLAMETHROWER')),
        new Weapon(getWeaponStats('LIGHTNING'))
      ];
      synergySystem.update(weapons);
      expect(synergySystem.getDamageMultiplier('Pistol')).toBe(1.0);
    });
  });

  describe('Fire Rate Multiplier', () => {
    test('should return 1.0 multiplier with no synergies', () => {
      expect(synergySystem.getFireRateMultiplier('Laser')).toBe(1.0);
    });

    test('should return 1.3 multiplier for Laser with Tech Arsenal', () => {
      const weapons = [
        new Weapon(getWeaponStats('LASER')),
        new Weapon(getWeaponStats('TESLA')),
        new Weapon(getWeaponStats('ORBITAL'))
      ];
      synergySystem.update(weapons);
      expect(synergySystem.getFireRateMultiplier('Laser')).toBe(1.3);
    });

    test('should return 1.3 multiplier for Tesla with Tech Arsenal', () => {
      const weapons = [
        new Weapon(getWeaponStats('LASER')),
        new Weapon(getWeaponStats('TESLA')),
        new Weapon(getWeaponStats('ORBITAL'))
      ];
      synergySystem.update(weapons);
      expect(synergySystem.getFireRateMultiplier('Tesla')).toBe(1.3);
    });

    test('should return 1.3 multiplier for Orbital with Tech Arsenal', () => {
      const weapons = [
        new Weapon(getWeaponStats('LASER')),
        new Weapon(getWeaponStats('TESLA')),
        new Weapon(getWeaponStats('ORBITAL'))
      ];
      synergySystem.update(weapons);
      expect(synergySystem.getFireRateMultiplier('Orbital')).toBe(1.3);
    });

    test('should return 1.0 for non-tech weapons with Tech Arsenal', () => {
      const weapons = [
        new Weapon(getWeaponStats('LASER')),
        new Weapon(getWeaponStats('TESLA')),
        new Weapon(getWeaponStats('ORBITAL'))
      ];
      synergySystem.update(weapons);
      expect(synergySystem.getFireRateMultiplier('Pistol')).toBe(1.0);
    });
  });

  describe('Projectile Bonus', () => {
    test('should return 0 bonus with no synergies', () => {
      expect(synergySystem.getProjectileBonus('Missiles')).toBe(0);
    });

    test('should return 2 bonus for Missiles with Heavy Artillery', () => {
      const weapons = [
        new Weapon(getWeaponStats('MISSILES')),
        new Weapon(getWeaponStats('SHOTGUN'))
      ];
      synergySystem.update(weapons);
      expect(synergySystem.getProjectileBonus('Missiles')).toBe(2);
    });

    test('should return 2 bonus for Shotgun with Heavy Artillery', () => {
      const weapons = [
        new Weapon(getWeaponStats('MISSILES')),
        new Weapon(getWeaponStats('SHOTGUN'))
      ];
      synergySystem.update(weapons);
      expect(synergySystem.getProjectileBonus('Shotgun')).toBe(2);
    });

    test('should return 0 for other weapons with Heavy Artillery', () => {
      const weapons = [
        new Weapon(getWeaponStats('MISSILES')),
        new Weapon(getWeaponStats('SHOTGUN'))
      ];
      synergySystem.update(weapons);
      expect(synergySystem.getProjectileBonus('Pistol')).toBe(0);
    });
  });

  describe('Pierce Bonus', () => {
    test('should return 0 bonus with no synergies', () => {
      expect(synergySystem.getPierceBonus('Pistol')).toBe(0);
    });

    test('should return 1 bonus for Pistol with Rapid Assault', () => {
      const weapons = [
        new Weapon(getWeaponStats('PISTOL')),
        new Weapon(getWeaponStats('LIGHTNING')),
        new Weapon(getWeaponStats('POISON'))
      ];
      synergySystem.update(weapons);
      expect(synergySystem.getPierceBonus('Pistol')).toBe(1);
    });

    test('should return 1 bonus for Lightning with Rapid Assault', () => {
      const weapons = [
        new Weapon(getWeaponStats('PISTOL')),
        new Weapon(getWeaponStats('LIGHTNING')),
        new Weapon(getWeaponStats('POISON'))
      ];
      synergySystem.update(weapons);
      expect(synergySystem.getPierceBonus('Lightning')).toBe(1);
    });

    test('should return 1 bonus for Poison with Rapid Assault', () => {
      const weapons = [
        new Weapon(getWeaponStats('PISTOL')),
        new Weapon(getWeaponStats('LIGHTNING')),
        new Weapon(getWeaponStats('POISON'))
      ];
      synergySystem.update(weapons);
      expect(synergySystem.getPierceBonus('Poison')).toBe(1);
    });

    test('should return 0 for other weapons with Rapid Assault', () => {
      const weapons = [
        new Weapon(getWeaponStats('PISTOL')),
        new Weapon(getWeaponStats('LIGHTNING')),
        new Weapon(getWeaponStats('POISON'))
      ];
      synergySystem.update(weapons);
      expect(synergySystem.getPierceBonus('Shotgun')).toBe(0);
    });
  });

  describe('Get Active Synergies', () => {
    test('should return empty array with no synergies', () => {
      const weapons = [new Weapon(getWeaponStats('PISTOL'))];
      synergySystem.update(weapons);
      expect(synergySystem.getActiveSynergies()).toHaveLength(0);
    });

    test('should return active synergy objects', () => {
      const weapons = [
        new Weapon(getWeaponStats('MISSILES')),
        new Weapon(getWeaponStats('SHOTGUN'))
      ];
      synergySystem.update(weapons);

      const active = synergySystem.getActiveSynergies();
      expect(active).toHaveLength(1);
      expect(active[0].name).toBe('Heavy Artillery');
    });

    test('should return multiple active synergies', () => {
      const weapons = [
        new Weapon(getWeaponStats('PISTOL')),
        new Weapon(getWeaponStats('LIGHTNING')),
        new Weapon(getWeaponStats('POISON')),
        new Weapon(getWeaponStats('ICE')),
        new Weapon(getWeaponStats('FLAMETHROWER'))
      ];
      synergySystem.update(weapons);

      const active = synergySystem.getActiveSynergies();
      expect(active.length).toBeGreaterThan(0);
    });
  });

  describe('Has Synergy Check', () => {
    test('should return false for non-existent synergy', () => {
      expect(synergySystem.hasSynergy('Non Existent')).toBe(false);
    });

    test('should return false for inactive synergy', () => {
      const weapons = [new Weapon(getWeaponStats('PISTOL'))];
      synergySystem.update(weapons);
      expect(synergySystem.hasSynergy('Elemental Fury')).toBe(false);
    });

    test('should return true for active synergy', () => {
      const weapons = [
        new Weapon(getWeaponStats('MISSILES')),
        new Weapon(getWeaponStats('SHOTGUN'))
      ];
      synergySystem.update(weapons);
      expect(synergySystem.hasSynergy('Heavy Artillery')).toBe(true);
    });
  });

  describe('Update Behavior', () => {
    test('should clear previous synergies on update', () => {
      const weapons1 = [
        new Weapon(getWeaponStats('MISSILES')),
        new Weapon(getWeaponStats('SHOTGUN'))
      ];
      synergySystem.update(weapons1);
      expect(synergySystem.hasSynergy('Heavy Artillery')).toBe(true);

      const weapons2 = [
        new Weapon(getWeaponStats('PISTOL'))
      ];
      synergySystem.update(weapons2);
      expect(synergySystem.hasSynergy('Heavy Artillery')).toBe(false);
    });

    test('should handle empty weapon array', () => {
      synergySystem.update([]);
      expect(synergySystem.getActiveSynergies()).toHaveLength(0);
    });

    test('should handle weapons with extra weapons beyond synergy requirements', () => {
      const weapons = [
        new Weapon(getWeaponStats('ICE')),
        new Weapon(getWeaponStats('FLAMETHROWER')),
        new Weapon(getWeaponStats('LIGHTNING')),
        new Weapon(getWeaponStats('PISTOL')),
        new Weapon(getWeaponStats('SHOTGUN'))
      ];
      synergySystem.update(weapons);
      expect(synergySystem.hasSynergy('Elemental Fury')).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    test('should handle duplicate weapons', () => {
      const weapons = [
        new Weapon(getWeaponStats('PISTOL')),
        new Weapon(getWeaponStats('PISTOL')),
        new Weapon(getWeaponStats('LIGHTNING')),
        new Weapon(getWeaponStats('POISON'))
      ];
      synergySystem.update(weapons);
      expect(synergySystem.hasSynergy('Rapid Assault')).toBe(true);
    });

    test('should handle weapon name case sensitivity', () => {
      const weapons = [
        new Weapon(getWeaponStats('MISSILES')),
        new Weapon(getWeaponStats('SHOTGUN'))
      ];
      synergySystem.update(weapons);

      // Synergy uses proper case weapon names
      expect(synergySystem.getDamageMultiplier('Missiles')).toBeDefined();
    });

    test('should handle all weapons collection', () => {
      const allWeaponTypes = ['PISTOL', 'SHOTGUN', 'LASER', 'ORBITAL', 'LIGHTNING',
                             'MISSILES', 'FLAMETHROWER', 'TESLA', 'ICE', 'POISON'];
      const weapons = allWeaponTypes.map(type => new Weapon(getWeaponStats(type)));

      synergySystem.update(weapons);

      // Should activate multiple synergies
      const active = synergySystem.getActiveSynergies();
      expect(active.length).toBeGreaterThan(0);
    });

    test('should handle rapid updates', () => {
      for (let i = 0; i < 100; i++) {
        const weapons = [
          new Weapon(getWeaponStats('MISSILES')),
          new Weapon(getWeaponStats('SHOTGUN'))
        ];
        synergySystem.update(weapons);
      }

      expect(synergySystem.hasSynergy('Heavy Artillery')).toBe(true);
    });

    test('should handle weapons array mutation after update', () => {
      const weapons = [
        new Weapon(getWeaponStats('MISSILES')),
        new Weapon(getWeaponStats('SHOTGUN'))
      ];
      synergySystem.update(weapons);
      expect(synergySystem.hasSynergy('Heavy Artillery')).toBe(true);

      // Mutate original array (should not affect synergy system)
      weapons.pop();
      expect(synergySystem.hasSynergy('Heavy Artillery')).toBe(true);
    });
  });

  describe('Synergy Definitions', () => {
    test('all synergies should have required properties', () => {
      SYNERGIES.forEach(synergy => {
        expect(synergy.name).toBeDefined();
        expect(synergy.weapons).toBeDefined();
        expect(synergy.description).toBeDefined();
        expect(synergy.effect).toBeDefined();
        expect(Array.isArray(synergy.weapons)).toBe(true);
        expect(synergy.weapons.length).toBeGreaterThan(0);
      });
    });

    test('all synergy effects should be valid', () => {
      const validEffects = [
        'damage_boost_50',
        'fire_rate_boost_30',
        'projectile_boost_2',
        'pierce_boost_1',
        'aoe_boost'
      ];

      SYNERGIES.forEach(synergy => {
        expect(validEffects).toContain(synergy.effect);
      });
    });

    test('synergy weapon requirements should be achievable', () => {
      SYNERGIES.forEach(synergy => {
        // Each synergy should require 2-4 weapons
        expect(synergy.weapons.length).toBeGreaterThanOrEqual(2);
        expect(synergy.weapons.length).toBeLessThanOrEqual(4);
      });
    });
  });
});
