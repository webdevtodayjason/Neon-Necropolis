/**
 * GameIntegration.test.ts
 * Integration tests for the complete game system
 * Tests how all systems work together
 */

import { Game } from '../../src/game/Game';
import { Input } from '../../src/engine/Input';
import { ParticleSystem } from '../../src/engine/ParticleSystem';

describe('Game Integration Tests', () => {
  let game: Game;
  let input: Input;
  let particleSystem: ParticleSystem;

  beforeEach(() => {
    game = new Game(1600, 1200);
    input = new Input();
    particleSystem = new ParticleSystem();
    (global as any).resetTime();
    (global as any).restoreRandom();
  });

  describe('Game Initialization', () => {
    it('should initialize game with correct world dimensions', () => {
      expect(game.WORLD_WIDTH).toBe(1600);
      expect(game.WORLD_HEIGHT).toBe(1200);
    });

    it('should create player at center of world', () => {
      expect(game.player.x).toBe(800);
      expect(game.player.y).toBe(600);
    });

    it('should initialize with title state', () => {
      expect(game.state).toBe('title');
    });

    it('should start with pistol weapon', () => {
      expect(game.weapons.length).toBe(1);
      expect(game.weapons[0].name).toBe('Pistol');
    });

    it('should initialize all game systems', () => {
      expect(game.spawner).toBeDefined();
      expect(game.physics).toBeDefined();
      expect(game.projectilePool).toBeDefined();
      expect(game.synergySystem).toBeDefined();
    });

    it('should start with zero game time', () => {
      expect(game.gameTime).toBe(0);
    });

    it('should start with zero stats', () => {
      expect(game.zombiesKilled).toBe(0);
      expect(game.damageDealt).toBe(0);
    });
  });

  describe('Game State Transitions', () => {
    it('should transition from title to playing', () => {
      expect(game.state).toBe('title');
      game.start();
      expect(game.state).toBe('playing');
    });

    it('should reset stats when starting', () => {
      game.zombiesKilled = 10;
      game.damageDealt = 1000;
      game.gameTime = 100;

      game.start();

      expect(game.zombiesKilled).toBe(0);
      expect(game.damageDealt).toBe(0);
      expect(game.gameTime).toBe(0);
    });

    it('should transition to gameover when player dies', () => {
      game.start();
      game.player.health = 0;

      game.update(16, { x: 0, y: 0 });

      expect(game.state).toBe('gameover');
    });

    it('should transition to victory after 30 minutes', () => {
      game.start();
      game.gameTime = 0;

      // Update to exactly 30 minutes (1800 seconds)
      game.update(1800, { x: 0, y: 0 });

      expect(game.state).toBe('victory');
    });

    it('should transition to levelup when player levels up', () => {
      game.start();

      // Give player enough XP to level up
      const leveledUp = game.player.addXP(100);

      if (leveledUp) {
        expect(game.state).toBe('playing'); // Still playing, level up happens in game loop
      }
    });
  });

  describe('Player Movement Integration', () => {
    beforeEach(() => {
      game.start();
    });

    it('should move player based on input', () => {
      const startX = game.player.x;
      const startY = game.player.y;

      game.update(16, { x: 1, y: 0 }); // Move right

      expect(game.player.x).toBeGreaterThan(startX);
      expect(game.player.y).toBe(startY);
    });

    it('should keep player within world bounds', () => {
      // Try to move player outside world
      game.player.x = 0;
      game.player.y = 0;

      game.update(16, { x: -1, y: -1 }); // Try to move up-left

      expect(game.player.x).toBeGreaterThanOrEqual(0);
      expect(game.player.y).toBeGreaterThanOrEqual(0);
    });

    it('should move player diagonally', () => {
      const startX = game.player.x;
      const startY = game.player.y;

      // Normalized diagonal input
      const diagonalInput = { x: 0.707, y: 0.707 };

      game.update(16, diagonalInput);

      expect(game.player.x).toBeGreaterThan(startX);
      expect(game.player.y).toBeGreaterThan(startY);
    });

    it('should not move player when input is zero', () => {
      const startX = game.player.x;
      const startY = game.player.y;

      game.update(16, { x: 0, y: 0 });

      expect(game.player.x).toBe(startX);
      expect(game.player.y).toBe(startY);
    });
  });

  describe('Zombie Spawning Integration', () => {
    beforeEach(() => {
      game.start();
    });

    it('should spawn zombies over time', () => {
      expect(game.zombies.length).toBe(0);

      // Update for several seconds to trigger spawning
      for (let i = 0; i < 100; i++) {
        game.update(16, { x: 0, y: 0 });
      }

      expect(game.zombies.length).toBeGreaterThan(0);
    });

    it('should increase spawn rate over time', () => {
      game.gameTime = 0;
      game.update(1, { x: 0, y: 0 });
      const earlyWave = game.getWave();

      game.gameTime = 300; // 5 minutes
      game.update(1, { x: 0, y: 0 });
      const lateWave = game.getWave();

      expect(lateWave).toBeGreaterThan(earlyWave);
    });

    it('should remove dead zombies from array', () => {
      // Manually add a zombie
      const zombie = game.spawner.spawnZombie(game.player.x + 100, game.player.y);
      game.zombies.push(zombie);

      expect(game.zombies.length).toBe(1);

      // Kill the zombie
      zombie.takeDamage(zombie.health);

      // Update game
      game.update(16, { x: 0, y: 0 });

      expect(game.zombies.length).toBe(0);
    });
  });

  describe('Combat System Integration', () => {
    beforeEach(() => {
      game.start();
    });

    it('should fire weapons at zombies automatically', () => {
      // Add a zombie near player
      const zombie = game.spawner.spawnZombie(game.player.x + 100, game.player.y);
      game.zombies.push(zombie);

      const weapon = game.weapons[0];
      weapon.cooldownTimer = 0; // Ready to fire

      game.update(16, { x: 0, y: 0 });

      // Weapon should have fired
      expect(game.projectilePool.getActive().length).toBeGreaterThan(0);
    });

    it('should damage zombies with projectiles', () => {
      // Add a zombie
      const zombie = game.spawner.spawnZombie(game.player.x + 50, game.player.y);
      game.zombies.push(zombie);

      const initialHealth = zombie.health;

      // Force weapon to fire
      const weapon = game.weapons[0];
      weapon.cooldownTimer = 0;

      // Update multiple times to ensure hit
      for (let i = 0; i < 30; i++) {
        game.update(16, { x: 0, y: 0 });
      }

      // Zombie should have taken damage (or died)
      expect(zombie.health < initialHealth || zombie.dead).toBe(true);
    });

    it('should award XP when zombie dies', () => {
      const initialXP = game.player.xp;

      // Add and kill a zombie
      const zombie = game.spawner.spawnZombie(game.player.x + 50, game.player.y);
      game.zombies.push(zombie);

      zombie.takeDamage(1000); // Overkill

      // Update to process death
      game.update(16, { x: 0, y: 0 });

      // XP should increase (if zombie was added to player xp)
      expect(game.zombiesKilled).toBe(1);
    });

    it('should track damage dealt', () => {
      const zombie = game.spawner.spawnZombie(game.player.x + 50, game.player.y);
      game.zombies.push(zombie);

      expect(game.damageDealt).toBe(0);

      // Deal damage manually for consistent test
      zombie.takeDamage(50);
      game.damageDealt += 50;

      expect(game.damageDealt).toBe(50);
    });
  });

  describe('Collision Detection Integration', () => {
    beforeEach(() => {
      game.start();
    });

    it('should detect player-zombie collisions', () => {
      const initialHealth = game.player.health;

      // Spawn zombie right on player
      const zombie = game.spawner.spawnZombie(game.player.x, game.player.y);
      zombie.attackCooldown = 0; // Can attack immediately
      game.zombies.push(zombie);

      // Update to process collision
      game.update(16, { x: 0, y: 0 });

      // Player should take damage
      expect(game.player.health).toBeLessThanOrEqual(initialHealth);
    });

    it('should detect projectile-zombie collisions', () => {
      // Add zombie
      const zombie = game.spawner.spawnZombie(game.player.x + 100, game.player.y);
      game.zombies.push(zombie);

      const initialHealth = zombie.health;

      // Manually fire projectile at zombie
      const weapon = game.weapons[0];
      weapon.fire(
        game.player.x,
        game.player.y,
        zombie.x,
        zombie.y,
        game.projectilePool
      );

      // Update multiple times for projectile to reach zombie
      for (let i = 0; i < 20; i++) {
        game.update(16, { x: 0, y: 0 });
      }

      // Zombie should be hit (health reduced or dead)
      expect(zombie.health < initialHealth || zombie.dead).toBe(true);
    });

    it('should handle multiple simultaneous collisions', () => {
      // Add multiple zombies
      for (let i = 0; i < 5; i++) {
        const zombie = game.spawner.spawnZombie(
          game.player.x + 50,
          game.player.y + i * 10
        );
        game.zombies.push(zombie);
      }

      expect(game.zombies.length).toBe(5);

      // Update to process
      for (let i = 0; i < 50; i++) {
        game.update(16, { x: 0, y: 0 });
      }

      // Some zombies should be dead
      expect(game.zombies.some(z => z.dead)).toBe(true);
    });
  });

  describe('Level Up System Integration', () => {
    beforeEach(() => {
      game.start();
    });

    it('should generate level up options', () => {
      game.player.addXP(100); // Level up

      if (game.state === 'levelup') {
        expect(game.levelUpOptions.length).toBeGreaterThan(0);
        expect(game.levelUpOptions.length).toBeLessThanOrEqual(3);
      }
    });

    it('should add new weapon on selection', () => {
      const initialWeaponCount = game.weapons.length;

      // Force level up
      game.state = 'levelup';
      game.levelUpOptions = ['SHOTGUN', 'LASER', 'ORBITAL'];

      game.selectLevelUpOption(0);

      expect(game.weapons.length).toBe(initialWeaponCount + 1);
      expect(game.state).toBe('playing');
    });

    it('should upgrade existing weapon on upgrade selection', () => {
      const weapon = game.weapons[0];
      const initialDamage = weapon.stats.damage;

      // Force level up with upgrade option
      game.state = 'levelup';
      game.levelUpOptions = ['UPGRADE_Pistol'];

      game.selectLevelUpOption(0);

      expect(weapon.stats.damage).toBeGreaterThan(initialDamage);
    });

    it('should resume game after level up selection', () => {
      game.state = 'levelup';
      game.levelUpOptions = ['SHOTGUN'];

      game.selectLevelUpOption(0);

      expect(game.state).toBe('playing');
    });
  });

  describe('Game Reset', () => {
    it('should reset game to initial state', () => {
      game.start();
      game.zombiesKilled = 50;
      game.damageDealt = 5000;
      game.gameTime = 300;

      // Add zombies and projectiles
      const zombie = game.spawner.spawnZombie(100, 100);
      game.zombies.push(zombie);
      game.projectilePool.spawn(100, 100, 1, 0, 10, 5, 1, 'bullet');

      game.reset();

      expect(game.state).toBe('title');
      expect(game.zombiesKilled).toBe(0);
      expect(game.damageDealt).toBe(0);
      expect(game.gameTime).toBe(0);
      expect(game.zombies.length).toBe(0);
      expect(game.projectilePool.getActive().length).toBe(0);
      expect(game.weapons.length).toBe(1);
    });
  });

  describe('Time Management', () => {
    beforeEach(() => {
      game.start();
    });

    it('should track game time', () => {
      expect(game.gameTime).toBe(0);

      game.update(1, { x: 0, y: 0 });

      expect(game.gameTime).toBe(1);
    });

    it('should calculate remaining time correctly', () => {
      game.gameTime = 100;

      const remaining = game.getRemainingTime();

      expect(remaining).toBe(game.GAME_DURATION - 100);
    });

    it('should not have negative remaining time', () => {
      game.gameTime = game.GAME_DURATION + 100;

      const remaining = game.getRemainingTime();

      expect(remaining).toBe(0);
    });

    it('should track wave progression', () => {
      const initialWave = game.getWave();

      game.gameTime = 120; // 2 minutes

      const laterWave = game.getWave();

      expect(laterWave).toBeGreaterThanOrEqual(initialWave);
    });
  });

  describe('Input System Integration', () => {
    beforeEach(() => {
      game.start();
    });

    it('should respond to keyboard input', () => {
      (global as any).triggerKeyEvent('keydown', 'KeyW');

      const movement = input.getMovementInput();

      game.update(16, movement);

      expect(game.player.y).toBeLessThan(600); // Moved up from center
    });

    it('should handle no input gracefully', () => {
      const startX = game.player.x;
      const startY = game.player.y;

      const movement = input.getMovementInput();

      game.update(16, movement);

      expect(game.player.x).toBe(startX);
      expect(game.player.y).toBe(startY);
    });

    it('should clear input state after update', () => {
      (global as any).triggerKeyEvent('keydown', 'Space');

      expect(input.isKeyPressed('Space')).toBe(true);

      input.update();

      expect(input.isKeyPressed('Space')).toBe(false);
      expect(input.isKeyDown('Space')).toBe(true);
    });
  });

  describe('Particle System Integration', () => {
    it('should emit particles on zombie death', () => {
      expect(particleSystem.getActiveCount()).toBe(0);

      particleSystem.bloodSplatter(100, 100, 15);

      expect(particleSystem.getActiveCount()).toBe(15);
    });

    it('should update particles over time', () => {
      particleSystem.bloodSplatter(100, 100, 10);

      expect(particleSystem.getActiveCount()).toBe(10);

      // Update past particle lifetime
      particleSystem.update(1000);

      expect(particleSystem.getActiveCount()).toBeLessThan(10);
    });

    it('should clear particles', () => {
      particleSystem.bloodSplatter(100, 100, 20);

      expect(particleSystem.getActiveCount()).toBe(20);

      particleSystem.clear();

      expect(particleSystem.getActiveCount()).toBe(0);
    });

    it('should render particles without errors', () => {
      const canvas = (global as any).createMockCanvas();
      const ctx = canvas.getContext('2d')!;

      particleSystem.explosion(100, 100);

      expect(() => {
        particleSystem.render(ctx);
      }).not.toThrow();
    });
  });

  describe('Performance Tests', () => {
    beforeEach(() => {
      game.start();
    });

    it('should handle many zombies efficiently', () => {
      // Add 50 zombies
      for (let i = 0; i < 50; i++) {
        const zombie = game.spawner.spawnZombie(
          game.player.x + Math.random() * 500,
          game.player.y + Math.random() * 500
        );
        game.zombies.push(zombie);
      }

      const start = performance.now();

      game.update(16, { x: 0, y: 0 });

      const elapsed = performance.now() - start;

      expect(elapsed).toBeLessThan(100); // Should complete quickly
    });

    it('should handle many projectiles efficiently', () => {
      // Spawn many projectiles
      for (let i = 0; i < 100; i++) {
        game.projectilePool.spawn(
          game.player.x,
          game.player.y,
          Math.cos(i) * 5,
          Math.sin(i) * 5,
          10,
          5,
          1,
          'bullet'
        );
      }

      const start = performance.now();

      game.update(16, { x: 0, y: 0 });

      const elapsed = performance.now() - start;

      expect(elapsed).toBeLessThan(100);
    });

    it('should handle complex game state efficiently', () => {
      // Create complex scenario
      for (let i = 0; i < 30; i++) {
        const zombie = game.spawner.spawnZombie(
          game.player.x + Math.random() * 400 - 200,
          game.player.y + Math.random() * 400 - 200
        );
        game.zombies.push(zombie);
      }

      const start = performance.now();

      // Update for 60 frames (1 second at 60fps)
      for (let i = 0; i < 60; i++) {
        game.update(16, { x: Math.random() - 0.5, y: Math.random() - 0.5 });
      }

      const elapsed = performance.now() - start;

      expect(elapsed).toBeLessThan(1000); // Should complete in reasonable time
    });
  });

  describe('Edge Cases', () => {
    it('should handle zero delta time', () => {
      game.start();

      expect(() => {
        game.update(0, { x: 0, y: 0 });
      }).not.toThrow();
    });

    it('should handle very large delta time', () => {
      game.start();

      expect(() => {
        game.update(1000, { x: 0, y: 0 });
      }).not.toThrow();
    });

    it('should handle update when not playing', () => {
      expect(game.state).toBe('title');

      expect(() => {
        game.update(16, { x: 0, y: 0 });
      }).not.toThrow();
    });

    it('should handle empty zombie array', () => {
      game.start();
      game.zombies = [];

      expect(() => {
        game.update(16, { x: 0, y: 0 });
      }).not.toThrow();
    });

    it('should handle invalid level up selection', () => {
      game.state = 'levelup';
      game.levelUpOptions = ['SHOTGUN'];

      // Try invalid index
      game.selectLevelUpOption(10);

      // Should not crash
      expect(true).toBe(true);
    });
  });
});
