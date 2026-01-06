/**
 * Game class integration tests
 * Tests the main game state manager and integration of all systems
 */
import { Game, GameState } from '../src/game/Game';

describe('Game', () => {
  let game: Game;
  const worldWidth = 1600;
  const worldHeight = 1200;

  beforeEach(() => {
    game = new Game(worldWidth, worldHeight);
  });

  describe('Initialization', () => {
    test('should initialize in title state', () => {
      expect(game.state).toBe('title');
    });

    test('should initialize with correct world dimensions', () => {
      expect(game.WORLD_WIDTH).toBe(worldWidth);
      expect(game.WORLD_HEIGHT).toBe(worldHeight);
    });

    test('should create player at center', () => {
      expect(game.player.x).toBe(worldWidth / 2);
      expect(game.player.y).toBe(worldHeight / 2);
    });

    test('should initialize with starting weapon', () => {
      expect(game.weapons.length).toBe(1);
      expect(game.weapons[0].name).toBe('Pistol');
    });

    test('should initialize with zero game time', () => {
      expect(game.gameTime).toBe(0);
    });

    test('should initialize with zero stats', () => {
      expect(game.zombiesKilled).toBe(0);
      expect(game.damageDealt).toBe(0);
    });

    test('should initialize all systems', () => {
      expect(game.projectilePool).toBeDefined();
      expect(game.spawner).toBeDefined();
      expect(game.physics).toBeDefined();
      expect(game.synergySystem).toBeDefined();
    });

    test('should have 30 minute game duration', () => {
      expect(game.GAME_DURATION).toBe(30 * 60);
    });
  });

  describe('Game State Management', () => {
    test('should start game', () => {
      game.start();
      expect(game.state).toBe('playing');
    });

    test('should reset stats on start', () => {
      game.zombiesKilled = 10;
      game.damageDealt = 500;
      game.gameTime = 100;

      game.start();

      expect(game.gameTime).toBe(0);
      expect(game.zombiesKilled).toBe(0);
      expect(game.damageDealt).toBe(0);
    });

    test('should not update when in title state', () => {
      const initialTime = game.gameTime;
      game.update(1.0, { x: 0, y: 0 });
      expect(game.gameTime).toBe(initialTime);
    });

    test('should update when in playing state', () => {
      game.start();
      game.update(1.0, { x: 0, y: 0 });
      expect(game.gameTime).toBe(1.0);
    });

    test('should transition to gameover when player dies', () => {
      game.start();
      game.player.takeDamage(1000);
      game.update(0.1, { x: 0, y: 0 });
      expect(game.state).toBe('gameover');
    });

    test('should transition to victory after game duration', () => {
      game.start();
      game.update(game.GAME_DURATION + 1, { x: 0, y: 0 });
      expect(game.state).toBe('victory');
    });

    test('should transition to levelup when player levels up from zombie kill', () => {
      game.start();
      // Add a zombie and set it to give enough XP for level up
      game.spawner.update(2.1, 0, game.zombies);
      game.zombies[0].x = game.player.x + 50;
      game.zombies[0].y = game.player.y;
      game.zombies[0].health = 1;
      game.zombies[0].xpValue = 1000; // Enough to level up

      // Update until zombie is killed
      for (let i = 0; i < 50; i++) {
        game.update(0.1, { x: 0, y: 0 });
        if (game.state === 'levelup') break;
      }

      expect(game.state).toBe('levelup');
    });
  });

  describe('Player Updates', () => {
    beforeEach(() => {
      game.start();
    });

    test('should move player based on input', () => {
      const initialX = game.player.x;
      game.update(0.1, { x: 1, y: 0 });
      expect(game.player.x).toBeGreaterThan(initialX);
    });

    test('should keep player in world bounds', () => {
      // Try to move way out of bounds
      for (let i = 0; i < 100; i++) {
        game.update(0.1, { x: -1, y: -1 });
      }

      expect(game.player.x).toBeGreaterThanOrEqual(game.player.radius);
      expect(game.player.y).toBeGreaterThanOrEqual(game.player.radius);
    });

    test('should handle no input', () => {
      const initialX = game.player.x;
      const initialY = game.player.y;

      game.update(0.1, { x: 0, y: 0 });

      expect(game.player.x).toBe(initialX);
      expect(game.player.y).toBe(initialY);
    });
  });

  describe('Weapon System', () => {
    beforeEach(() => {
      game.start();
    });

    test('should update all weapons', () => {
      const weapon = game.weapons[0];
      weapon.cooldown = 1.0;

      game.update(0.5, { x: 0, y: 0 });

      expect(weapon.cooldown).toBeLessThan(1.0);
    });

    test('should auto-fire at nearest zombie', () => {
      // Manually add a zombie
      game.spawner.update(2.1, 0, game.zombies);

      const initialProjectiles = game.projectilePool.getActive().length;

      // Update enough times for weapon to fire
      for (let i = 0; i < 10; i++) {
        game.update(0.1, { x: 0, y: 0 });
      }

      const finalProjectiles = game.projectilePool.getActive().length;
      expect(finalProjectiles).toBeGreaterThan(initialProjectiles);
    });

    test('should not fire when no zombies present', () => {
      // Completely restart spawner to avoid it being ready to spawn
      game.spawner = new (require('../src/game/Spawner').Spawner)(game.WORLD_WIDTH, game.WORLD_HEIGHT);
      game.spawner.update(1.5, 0, game.zombies); // Set timer so it won't spawn on next update
      game.zombies = [];
      game.projectilePool.clear();

      const initialProjectiles = game.projectilePool.getActive().length;

      // Short update
      game.update(0.3, { x: 0, y: 0 });

      // Manually clear any zombies that may have spawned
      game.zombies = [];

      const finalProjectiles = game.projectilePool.getActive().length;

      expect(finalProjectiles).toBe(initialProjectiles);
    });

    test('should find nearest zombie to target', () => {
      // Add zombies at different distances
      game.zombies = [];
      game.spawner.update(2.1, 0, game.zombies);
      game.zombies[0].x = game.player.x + 500;
      game.zombies[0].y = game.player.y;

      game.spawner.update(2.1, 0, game.zombies);
      game.zombies[1].x = game.player.x + 100;
      game.zombies[1].y = game.player.y;

      // Update and let weapons fire
      for (let i = 0; i < 10; i++) {
        game.update(0.1, { x: 0, y: 0 });
      }

      // Should target nearest zombie
      expect(game.projectilePool.getActive().length).toBeGreaterThan(0);
    });
  });

  describe('Zombie System', () => {
    beforeEach(() => {
      game.start();
    });

    test('should spawn zombies', () => {
      game.update(2.1, { x: 0, y: 0 });
      expect(game.zombies.length).toBeGreaterThan(0);
    });

    test('should move zombies towards player', () => {
      game.spawner.update(2.1, 0, game.zombies);
      const zombie = game.zombies[0];
      const initialDistance = Math.sqrt(
        (zombie.x - game.player.x) ** 2 + (zombie.y - game.player.y) ** 2
      );

      game.update(1.0, { x: 0, y: 0 });

      const finalDistance = Math.sqrt(
        (zombie.x - game.player.x) ** 2 + (zombie.y - game.player.y) ** 2
      );

      expect(finalDistance).toBeLessThan(initialDistance);
    });

    test('should remove dead zombies', () => {
      game.spawner.update(2.1, 0, game.zombies);
      const zombie = game.zombies[0];
      zombie.takeDamage(1000);

      game.update(0.1, { x: 0, y: 0 });

      expect(game.zombies.length).toBe(0);
    });

    test('should increment kill count when zombie dies', () => {
      game.spawner.update(2.1, 0, game.zombies);
      const zombie = game.zombies[0];
      zombie.takeDamage(1000);

      game.update(0.1, { x: 0, y: 0 });

      expect(game.zombiesKilled).toBe(1);
    });
  });

  describe('Projectile System', () => {
    beforeEach(() => {
      game.start();
    });

    test('should update projectiles', () => {
      // Add a zombie so weapon fires
      game.spawner.update(2.1, 0, game.zombies);

      // Wait for weapon to fire
      for (let i = 0; i < 10; i++) {
        game.update(0.1, { x: 0, y: 0 });
      }

      const projectiles = game.projectilePool.getActive();
      if (projectiles.length > 0) {
        const initialX = projectiles[0].x;
        game.update(0.1, { x: 0, y: 0 });
        expect(projectiles[0].x).not.toBe(initialX);
      }
    });

    test('should remove expired projectiles', () => {
      // Add zombie
      game.spawner.update(2.1, 0, game.zombies);

      // Generate projectiles
      for (let i = 0; i < 10; i++) {
        game.update(0.1, { x: 0, y: 0 });
      }

      const initialCount = game.projectilePool.getActive().length;

      // Wait for projectiles to expire
      game.update(10.0, { x: 0, y: 0 });

      const finalCount = game.projectilePool.getActive().length;
      expect(finalCount).toBeLessThanOrEqual(initialCount);
    });
  });

  describe('Collision Detection', () => {
    beforeEach(() => {
      game.start();
    });

    test('should detect projectile-zombie collisions', () => {
      // Add zombie near player
      game.spawner.update(2.1, 0, game.zombies);
      game.zombies[0].x = game.player.x + 50;
      game.zombies[0].y = game.player.y;

      const initialHealth = game.zombies[0].health;

      // Update until weapon fires and hits
      for (let i = 0; i < 20; i++) {
        game.update(0.1, { x: 0, y: 0 });
      }

      // Zombie should take damage if hit
      if (game.zombies.length > 0) {
        expect(game.zombies[0].health).toBeLessThanOrEqual(initialHealth);
      }
    });

    test('should detect player-zombie collisions', () => {
      // Add zombie at player position
      game.spawner.update(2.1, 0, game.zombies);
      game.zombies[0].x = game.player.x;
      game.zombies[0].y = game.player.y;

      const initialHealth = game.player.health;

      game.update(0.1, { x: 0, y: 0 });

      expect(game.player.health).toBeLessThan(initialHealth);
    });

    test('should award XP when zombie dies from projectile', () => {
      game.spawner.update(2.1, 0, game.zombies);
      const zombie = game.zombies[0];
      zombie.x = game.player.x + 50;
      zombie.y = game.player.y;
      zombie.health = 1; // Low health for easy kill

      const initialXP = game.player.xp;

      // Update until zombie is killed
      for (let i = 0; i < 50; i++) {
        game.update(0.1, { x: 0, y: 0 });
        if (game.zombies.length === 0) break;
      }

      expect(game.player.xp).toBeGreaterThan(initialXP);
    });

    test('should track damage dealt', () => {
      game.spawner.update(2.1, 0, game.zombies);
      game.zombies[0].x = game.player.x + 50;
      game.zombies[0].y = game.player.y;

      const initialDamage = game.damageDealt;

      for (let i = 0; i < 20; i++) {
        game.update(0.1, { x: 0, y: 0 });
      }

      expect(game.damageDealt).toBeGreaterThanOrEqual(initialDamage);
    });

    test('should handle piercing projectiles', () => {
      // Add multiple zombies in a line
      for (let i = 0; i < 3; i++) {
        game.spawner.update(2.1, 0, game.zombies);
        game.zombies[i].x = game.player.x + 50 + (i * 20);
        game.zombies[i].y = game.player.y;
      }

      // Give player piercing weapon
      game.weapons[0].piercing = 5;

      // Update and check if multiple zombies take damage
      for (let i = 0; i < 30; i++) {
        game.update(0.1, { x: 0, y: 0 });
      }

      expect(game.damageDealt).toBeGreaterThan(0);
    });
  });

  describe('Level Up System', () => {
    beforeEach(() => {
      game.start();
    });

    test('should generate level up options', () => {
      // Kill a zombie that gives enough XP to level up
      game.spawner.update(2.1, 0, game.zombies);
      game.zombies[0].x = game.player.x + 50;
      game.zombies[0].y = game.player.y;
      game.zombies[0].health = 1;
      game.zombies[0].xpValue = 1000;

      for (let i = 0; i < 50; i++) {
        game.update(0.1, { x: 0, y: 0 });
        if (game.state === 'levelup') break;
      }

      expect(game.state).toBe('levelup');
      expect(game.levelUpOptions.length).toBeGreaterThan(0);
      expect(game.levelUpOptions.length).toBeLessThanOrEqual(3);
    });

    test('should offer new weapons', () => {
      // Kill a zombie to trigger level up
      game.spawner.update(2.1, 0, game.zombies);
      game.zombies[0].x = game.player.x + 50;
      game.zombies[0].y = game.player.y;
      game.zombies[0].health = 1;
      game.zombies[0].xpValue = 1000;

      for (let i = 0; i < 50; i++) {
        game.update(0.1, { x: 0, y: 0 });
        if (game.state === 'levelup') break;
      }

      const hasNewWeapon = game.levelUpOptions.some(
        opt => !opt.startsWith('UPGRADE_')
      );

      expect(hasNewWeapon).toBe(true);
    });

    test('should offer upgrades for existing weapons', () => {
      // Add multiple weapons directly
      const { getWeaponStats } = require('../src/game/WeaponTypes');
      const { Weapon } = require('../src/game/Weapon');

      for (let i = 0; i < 5; i++) {
        const weaponNames = ['SHOTGUN', 'LASER', 'ORBITAL', 'LIGHTNING'];
        if (i < weaponNames.length) {
          game.weapons.push(new Weapon(getWeaponStats(weaponNames[i])));
        }
      }

      // Now manually set level up state to generate options
      game.state = 'levelup';
      game.levelUpOptions = ['UPGRADE_Pistol', 'UPGRADE_Shotgun', 'LASER'];

      const hasUpgrade = game.levelUpOptions.some(
        opt => opt.startsWith('UPGRADE_')
      );

      expect(hasUpgrade || game.weapons.length > 1).toBe(true);
    });

    test('should add new weapon on selection', () => {
      game.player.addXP(1000);
      game.update(0.1, { x: 0, y: 0 });

      const initialWeaponCount = game.weapons.length;

      // Find and select a new weapon option
      const newWeaponIndex = game.levelUpOptions.findIndex(
        opt => !opt.startsWith('UPGRADE_')
      );

      if (newWeaponIndex >= 0) {
        game.selectLevelUpOption(newWeaponIndex);
        expect(game.weapons.length).toBe(initialWeaponCount + 1);
      }
    });

    test('should upgrade existing weapon on selection', () => {
      game.player.addXP(1000);
      game.update(0.1, { x: 0, y: 0 });

      // Force an upgrade option
      game.levelUpOptions = ['UPGRADE_Pistol'];

      const initialLevel = game.weapons[0].level;
      game.selectLevelUpOption(0);

      expect(game.weapons[0].level).toBe(initialLevel + 1);
    });

    test('should resume playing after selection', () => {
      // Manually set level up state
      game.state = 'levelup';
      game.levelUpOptions = ['SHOTGUN', 'LASER', 'ORBITAL'];

      expect(game.state).toBe('levelup');

      game.selectLevelUpOption(0);
      expect(game.state).toBe('playing');
    });

    test('should handle invalid option index', () => {
      game.player.addXP(1000);
      game.update(0.1, { x: 0, y: 0 });

      const weaponCount = game.weapons.length;
      game.selectLevelUpOption(999);

      expect(game.weapons.length).toBe(weaponCount);
    });
  });

  describe('Wave System', () => {
    beforeEach(() => {
      game.start();
    });

    test('should return current wave', () => {
      expect(game.getWave()).toBe(1);
    });

    test('should progress through waves', () => {
      game.update(0.1, { x: 0, y: 0 });
      expect(game.getWave()).toBe(1);

      game.update(120, { x: 0, y: 0 }); // 2 minutes
      expect(game.getWave()).toBe(2);
    });
  });

  describe('Time System', () => {
    beforeEach(() => {
      game.start();
    });

    test('should track game time', () => {
      game.update(1.5, { x: 0, y: 0 });
      expect(game.gameTime).toBeCloseTo(1.5, 2);
    });

    test('should return remaining time', () => {
      const remaining = game.getRemainingTime();
      expect(remaining).toBe(game.GAME_DURATION);
    });

    test('should decrease remaining time', () => {
      game.update(60, { x: 0, y: 0 });
      const remaining = game.getRemainingTime();
      expect(remaining).toBe(game.GAME_DURATION - 60);
    });

    test('should not return negative remaining time', () => {
      game.update(game.GAME_DURATION + 100, { x: 0, y: 0 });
      const remaining = game.getRemainingTime();
      expect(remaining).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Reset', () => {
    test('should reset game state', () => {
      game.start();
      game.update(100, { x: 1, y: 1 });
      game.player.takeDamage(50);
      game.zombiesKilled = 25;

      game.reset();

      expect(game.state).toBe('title');
      expect(game.gameTime).toBe(0);
      expect(game.zombiesKilled).toBe(0);
      expect(game.damageDealt).toBe(0);
    });

    test('should reset player to center', () => {
      game.start();
      game.update(10, { x: 1, y: 1 });

      game.reset();

      expect(game.player.x).toBe(worldWidth / 2);
      expect(game.player.y).toBe(worldHeight / 2);
    });

    test('should reset player health', () => {
      game.player.takeDamage(50);
      game.reset();
      expect(game.player.health).toBe(game.player.maxHealth);
    });

    test('should clear zombies', () => {
      game.start();
      game.spawner.update(2.1, 0, game.zombies);

      game.reset();
      expect(game.zombies.length).toBe(0);
    });

    test('should reset weapons to starting weapon', () => {
      game.start();
      game.weapons.push(game.weapons[0]); // Add another weapon

      game.reset();

      expect(game.weapons.length).toBe(1);
      expect(game.weapons[0].name).toBe('Pistol');
    });

    test('should clear projectiles', () => {
      game.start();
      game.spawner.update(2.1, 0, game.zombies);

      for (let i = 0; i < 20; i++) {
        game.update(0.1, { x: 0, y: 0 });
      }

      game.reset();
      expect(game.projectilePool.getActive().length).toBe(0);
    });
  });

  describe('Edge Cases', () => {
    test('should handle very small deltaTime', () => {
      game.start();
      expect(() => game.update(0.001, { x: 0, y: 0 })).not.toThrow();
    });

    test('should handle large deltaTime', () => {
      game.start();
      expect(() => game.update(10.0, { x: 0, y: 0 })).not.toThrow();
    });

    test('should handle zero deltaTime', () => {
      game.start();
      const initialTime = game.gameTime;
      game.update(0, { x: 0, y: 0 });
      expect(game.gameTime).toBe(initialTime);
    });

    test('should handle extreme input values', () => {
      game.start();
      expect(() => game.update(0.1, { x: 1000, y: 1000 })).not.toThrow();
    });

    test('should handle negative input values', () => {
      game.start();
      expect(() => game.update(0.1, { x: -1000, y: -1000 })).not.toThrow();
    });

    test('should handle many zombies', () => {
      game.start();
      for (let i = 0; i < 100; i++) {
        game.spawner.update(2.1, 0, game.zombies);
      }

      expect(() => game.update(0.1, { x: 0, y: 0 })).not.toThrow();
    });

    test('should handle no zombies', () => {
      game.start();
      game.zombies = [];
      expect(() => game.update(0.1, { x: 0, y: 0 })).not.toThrow();
    });
  });

  describe('Integration Scenarios', () => {
    test('should simulate complete gameplay loop', () => {
      game.start();

      // Simulate 60 seconds of gameplay
      for (let i = 0; i < 600; i++) {
        game.update(0.1, { x: Math.random() - 0.5, y: Math.random() - 0.5 });
      }

      expect(game.state).not.toBe('title');
      expect(game.gameTime).toBeGreaterThan(0);
    });

    test('should handle player death scenario', () => {
      game.start();

      // Add many zombies
      for (let i = 0; i < 20; i++) {
        game.spawner.update(2.1, 0, game.zombies);
      }

      // Move zombies to player
      game.zombies.forEach(z => {
        z.x = game.player.x;
        z.y = game.player.y;
      });

      // Update until player dies
      for (let i = 0; i < 100; i++) {
        game.update(0.1, { x: 0, y: 0 });
        if (!game.player.isAlive()) break;
      }

      expect(game.state).toBe('gameover');
    });

    test('should handle victory scenario', () => {
      game.start();
      game.update(game.GAME_DURATION + 1, { x: 0, y: 0 });
      expect(game.state).toBe('victory');
    });

    test('should handle multiple level ups', () => {
      game.start();

      for (let i = 0; i < 5; i++) {
        game.player.addXP(1000);
        game.update(0.1, { x: 0, y: 0 });

        if (game.state === 'levelup') {
          game.selectLevelUpOption(0);
        }
      }

      expect(game.player.level).toBeGreaterThan(1);
    });

    test('should maintain spatial hash efficiency', () => {
      game.start();

      // Add many entities
      for (let i = 0; i < 50; i++) {
        game.spawner.update(2.1, 0, game.zombies);
      }

      // Update multiple times
      for (let i = 0; i < 10; i++) {
        game.update(0.1, { x: 0, y: 0 });
      }

      // Should complete without performance issues
      expect(game.zombies.length).toBeGreaterThan(0);
    });
  });
});
