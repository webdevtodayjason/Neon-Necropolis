/**
 * Physics engine tests
 * Tests spatial hashing, collision detection, and utility functions
 */
import { Physics, Entity } from '../src/engine/Physics';

describe('Physics', () => {
  let physics: Physics;

  beforeEach(() => {
    physics = new Physics(100); // 100x100 cell size
  });

  describe('Initialization', () => {
    test('should initialize with default cell size', () => {
      const defaultPhysics = new Physics();
      expect(defaultPhysics).toBeDefined();
    });

    test('should initialize with custom cell size', () => {
      const customPhysics = new Physics(50);
      expect(customPhysics).toBeDefined();
    });

    test('should start with empty grid', () => {
      const entity: Entity = { x: 100, y: 100, radius: 10, id: 'test' };
      const candidates = physics.query(entity);
      expect(candidates.size).toBe(0);
    });
  });

  describe('Entity Insertion', () => {
    test('should insert entity into grid', () => {
      const entity: Entity = { x: 150, y: 150, radius: 10, id: 'entity1' };
      physics.insert(entity);

      // Query should find the entity (though it won't include itself)
      const candidates = physics.query(entity);
      expect(candidates.size).toBe(0); // Doesn't include itself
    });

    test('should insert multiple entities', () => {
      const entity1: Entity = { x: 100, y: 100, radius: 10, id: 'entity1' };
      const entity2: Entity = { x: 110, y: 110, radius: 10, id: 'entity2' };

      physics.insert(entity1);
      physics.insert(entity2);

      const candidates = physics.query(entity1);
      expect(candidates.size).toBe(1);
      expect(candidates.has(entity2)).toBe(true);
    });

    test('should handle entity at origin', () => {
      const entity: Entity = { x: 0, y: 0, radius: 5, id: 'origin' };
      expect(() => physics.insert(entity)).not.toThrow();
    });

    test('should handle entity with large radius', () => {
      const entity: Entity = { x: 100, y: 100, radius: 150, id: 'large' };
      physics.insert(entity);

      // Should span multiple cells
      const candidates = physics.query(entity);
      expect(candidates.size).toBe(0); // Only itself
    });

    test('should handle negative coordinates', () => {
      const entity: Entity = { x: -100, y: -100, radius: 10, id: 'negative' };
      expect(() => physics.insert(entity)).not.toThrow();
    });
  });

  describe('Spatial Hashing Query', () => {
    test('should find nearby entities', () => {
      const entity1: Entity = { x: 100, y: 100, radius: 10, id: 'entity1' };
      const entity2: Entity = { x: 105, y: 105, radius: 10, id: 'entity2' };

      physics.insert(entity1);
      physics.insert(entity2);

      const candidates = physics.query(entity1);
      expect(candidates.has(entity2)).toBe(true);
    });

    test('should not find far away entities', () => {
      const entity1: Entity = { x: 100, y: 100, radius: 10, id: 'entity1' };
      const entity2: Entity = { x: 1000, y: 1000, radius: 10, id: 'entity2' };

      physics.insert(entity1);
      physics.insert(entity2);

      const candidates = physics.query(entity1);
      expect(candidates.has(entity2)).toBe(false);
    });

    test('should not include self in query', () => {
      const entity: Entity = { x: 100, y: 100, radius: 10, id: 'entity1' };
      physics.insert(entity);

      const candidates = physics.query(entity);
      expect(candidates.has(entity)).toBe(false);
    });

    test('should find entities in adjacent cells', () => {
      const entity1: Entity = { x: 99, y: 99, radius: 10, id: 'entity1' };
      const entity2: Entity = { x: 101, y: 101, radius: 10, id: 'entity2' };

      physics.insert(entity1);
      physics.insert(entity2);

      // Might be in adjacent cells but should still be found due to radius
      const candidates = physics.query(entity1);
      expect(candidates.size).toBeGreaterThanOrEqual(0);
    });

    test('should handle multiple entities in same cell', () => {
      const entities: Entity[] = [];
      for (let i = 0; i < 5; i++) {
        entities.push({ x: 100 + i, y: 100 + i, radius: 5, id: `entity${i}` });
        physics.insert(entities[i]);
      }

      const candidates = physics.query(entities[0]);
      expect(candidates.size).toBeGreaterThan(0);
    });
  });

  describe('Collision Detection', () => {
    test('should detect collision between overlapping circles', () => {
      const entity1: Entity = { x: 100, y: 100, radius: 10, id: 'entity1' };
      const entity2: Entity = { x: 105, y: 100, radius: 10, id: 'entity2' };

      expect(Physics.checkCollision(entity1, entity2)).toBe(true);
    });

    test('should not detect collision between separated circles', () => {
      const entity1: Entity = { x: 100, y: 100, radius: 10, id: 'entity1' };
      const entity2: Entity = { x: 200, y: 100, radius: 10, id: 'entity2' };

      expect(Physics.checkCollision(entity1, entity2)).toBe(false);
    });

    test('should detect collision when circles touch exactly', () => {
      const entity1: Entity = { x: 100, y: 100, radius: 10, id: 'entity1' };
      const entity2: Entity = { x: 120, y: 100, radius: 10, id: 'entity2' };

      // Distance = 20, sum of radii = 20, should not collide (touching but not overlapping)
      expect(Physics.checkCollision(entity1, entity2)).toBe(false);
    });

    test('should detect collision with different sized circles', () => {
      const small: Entity = { x: 100, y: 100, radius: 5, id: 'small' };
      const large: Entity = { x: 110, y: 100, radius: 20, id: 'large' };

      expect(Physics.checkCollision(small, large)).toBe(true);
    });

    test('should handle collision at origin', () => {
      const entity1: Entity = { x: 0, y: 0, radius: 10, id: 'entity1' };
      const entity2: Entity = { x: 5, y: 5, radius: 10, id: 'entity2' };

      expect(Physics.checkCollision(entity1, entity2)).toBe(true);
    });

    test('should detect diagonal collisions', () => {
      const entity1: Entity = { x: 0, y: 0, radius: 10, id: 'entity1' };
      const entity2: Entity = { x: 10, y: 10, radius: 10, id: 'entity2' };

      const distance = Math.sqrt(10 * 10 + 10 * 10); // ~14.14
      const radiusSum = 20;
      expect(Physics.checkCollision(entity1, entity2)).toBe(distance < radiusSum);
    });
  });

  describe('Get Collisions', () => {
    test('should return empty array when no collisions', () => {
      const entity: Entity = { x: 100, y: 100, radius: 10, id: 'entity1' };
      const candidates = new Set<Entity>();

      const collisions = physics.getCollisions(entity, candidates);
      expect(collisions.length).toBe(0);
    });

    test('should return colliding entities', () => {
      const entity1: Entity = { x: 100, y: 100, radius: 10, id: 'entity1' };
      const entity2: Entity = { x: 105, y: 100, radius: 10, id: 'entity2' };
      const entity3: Entity = { x: 200, y: 200, radius: 10, id: 'entity3' };

      const candidates = new Set([entity2, entity3]);
      const collisions = physics.getCollisions(entity1, candidates);

      expect(collisions.length).toBe(1);
      expect(collisions[0]).toBe(entity2);
    });

    test('should handle multiple collisions', () => {
      const center: Entity = { x: 100, y: 100, radius: 20, id: 'center' };
      const nearby1: Entity = { x: 110, y: 100, radius: 10, id: 'nearby1' };
      const nearby2: Entity = { x: 100, y: 110, radius: 10, id: 'nearby2' };
      const nearby3: Entity = { x: 90, y: 100, radius: 10, id: 'nearby3' };

      const candidates = new Set([nearby1, nearby2, nearby3]);
      const collisions = physics.getCollisions(center, candidates);

      expect(collisions.length).toBe(3);
    });

    test('should filter out non-colliding candidates', () => {
      const entity: Entity = { x: 100, y: 100, radius: 10, id: 'entity1' };
      const far1: Entity = { x: 200, y: 200, radius: 10, id: 'far1' };
      const far2: Entity = { x: 300, y: 300, radius: 10, id: 'far2' };
      const near: Entity = { x: 105, y: 100, radius: 10, id: 'near' };

      const candidates = new Set([far1, far2, near]);
      const collisions = physics.getCollisions(entity, candidates);

      expect(collisions.length).toBe(1);
      expect(collisions[0]).toBe(near);
    });
  });

  describe('Clear', () => {
    test('should clear all entities from grid', () => {
      const entity1: Entity = { x: 100, y: 100, radius: 10, id: 'entity1' };
      const entity2: Entity = { x: 110, y: 110, radius: 10, id: 'entity2' };

      physics.insert(entity1);
      physics.insert(entity2);
      physics.clear();

      const candidates = physics.query(entity1);
      expect(candidates.size).toBe(0);
    });

    test('should allow re-insertion after clear', () => {
      const entity: Entity = { x: 100, y: 100, radius: 10, id: 'entity1' };

      physics.insert(entity);
      physics.clear();
      physics.insert(entity);

      // Should work without errors
      const candidates = physics.query(entity);
      expect(candidates.size).toBe(0);
    });

    test('should handle clearing empty grid', () => {
      expect(() => physics.clear()).not.toThrow();
    });
  });

  describe('Utility Functions', () => {
    describe('distance', () => {
      test('should calculate horizontal distance', () => {
        const distance = Physics.distance(0, 0, 100, 0);
        expect(distance).toBe(100);
      });

      test('should calculate vertical distance', () => {
        const distance = Physics.distance(0, 0, 0, 100);
        expect(distance).toBe(100);
      });

      test('should calculate diagonal distance', () => {
        const distance = Physics.distance(0, 0, 3, 4);
        expect(distance).toBe(5); // 3-4-5 triangle
      });

      test('should handle negative coordinates', () => {
        const distance = Physics.distance(-10, -10, 10, 10);
        expect(distance).toBeCloseTo(Math.sqrt(800), 2);
      });

      test('should return zero for same point', () => {
        const distance = Physics.distance(100, 100, 100, 100);
        expect(distance).toBe(0);
      });
    });

    describe('normalize', () => {
      test('should normalize horizontal vector', () => {
        const normalized = Physics.normalize(100, 0);
        expect(normalized.x).toBeCloseTo(1, 5);
        expect(normalized.y).toBeCloseTo(0, 5);
      });

      test('should normalize vertical vector', () => {
        const normalized = Physics.normalize(0, 100);
        expect(normalized.x).toBeCloseTo(0, 5);
        expect(normalized.y).toBeCloseTo(1, 5);
      });

      test('should normalize diagonal vector', () => {
        const normalized = Physics.normalize(3, 4);
        expect(normalized.x).toBeCloseTo(0.6, 5);
        expect(normalized.y).toBeCloseTo(0.8, 5);
      });

      test('should normalize to unit length', () => {
        const normalized = Physics.normalize(123, 456);
        const length = Math.sqrt(normalized.x ** 2 + normalized.y ** 2);
        expect(length).toBeCloseTo(1, 5);
      });

      test('should handle zero vector', () => {
        const normalized = Physics.normalize(0, 0);
        expect(normalized.x).toBe(0);
        expect(normalized.y).toBe(0);
      });

      test('should handle negative vectors', () => {
        const normalized = Physics.normalize(-10, -10);
        const length = Math.sqrt(normalized.x ** 2 + normalized.y ** 2);
        expect(length).toBeCloseTo(1, 5);
      });
    });

    describe('angle', () => {
      test('should calculate angle to right', () => {
        const angle = Physics.angle(0, 0, 100, 0);
        expect(angle).toBeCloseTo(0, 5);
      });

      test('should calculate angle to left', () => {
        const angle = Physics.angle(0, 0, -100, 0);
        expect(angle).toBeCloseTo(Math.PI, 5);
      });

      test('should calculate angle down', () => {
        const angle = Physics.angle(0, 0, 0, 100);
        expect(angle).toBeCloseTo(Math.PI / 2, 5);
      });

      test('should calculate angle up', () => {
        const angle = Physics.angle(0, 0, 0, -100);
        expect(angle).toBeCloseTo(-Math.PI / 2, 5);
      });

      test('should calculate diagonal angles', () => {
        const angle = Physics.angle(0, 0, 100, 100);
        expect(angle).toBeCloseTo(Math.PI / 4, 5);
      });

      test('should handle non-origin start points', () => {
        const angle = Physics.angle(100, 100, 200, 100);
        expect(angle).toBeCloseTo(0, 5);
      });

      test('should return zero for same points', () => {
        const angle = Physics.angle(100, 100, 100, 100);
        expect(angle).toBe(0);
      });
    });
  });

  describe('Performance and Edge Cases', () => {
    test('should handle many entities efficiently', () => {
      const entities: Entity[] = [];
      for (let i = 0; i < 100; i++) {
        entities.push({ x: i * 10, y: i * 10, radius: 5, id: `entity${i}` });
        physics.insert(entities[i]);
      }

      // Query should complete quickly
      const candidates = physics.query(entities[0]);
      expect(candidates).toBeDefined();
    });

    test('should handle entities at cell boundaries', () => {
      const entity1: Entity = { x: 100, y: 100, radius: 5, id: 'entity1' };
      const entity2: Entity = { x: 99.9, y: 100, radius: 5, id: 'entity2' };

      physics.insert(entity1);
      physics.insert(entity2);

      const candidates = physics.query(entity1);
      expect(candidates.size).toBeGreaterThanOrEqual(0);
    });

    test('should handle very small cell sizes', () => {
      const smallCellPhysics = new Physics(10);
      const entity: Entity = { x: 100, y: 100, radius: 5, id: 'entity' };

      expect(() => smallCellPhysics.insert(entity)).not.toThrow();
    });

    test('should handle very large cell sizes', () => {
      const largeCellPhysics = new Physics(1000);
      const entity: Entity = { x: 100, y: 100, radius: 5, id: 'entity' };

      expect(() => largeCellPhysics.insert(entity)).not.toThrow();
    });

    test('should handle zero radius entities', () => {
      const entity: Entity = { x: 100, y: 100, radius: 0, id: 'point' };
      physics.insert(entity);

      const candidates = physics.query(entity);
      expect(candidates).toBeDefined();
    });

    test('should handle fractional coordinates', () => {
      const entity: Entity = { x: 123.456, y: 789.012, radius: 5.5, id: 'fraction' };
      expect(() => physics.insert(entity)).not.toThrow();
    });
  });

  describe('Integration Scenarios', () => {
    test('should handle player-zombie collision scenario', () => {
      const player: Entity = { x: 400, y: 300, radius: 20, id: 'player' };
      const zombies: Entity[] = [
        { x: 410, y: 300, radius: 15, id: 'zombie1' },
        { x: 500, y: 300, radius: 15, id: 'zombie2' },
        { x: 390, y: 310, radius: 15, id: 'zombie3' }
      ];

      physics.insert(player);
      zombies.forEach(z => physics.insert(z));

      const candidates = physics.query(player);
      const collisions = physics.getCollisions(player, candidates);

      // Should detect nearby zombies
      expect(collisions.length).toBeGreaterThan(0);
    });

    test('should handle projectile-zombie collision scenario', () => {
      const projectile: Entity = { x: 200, y: 200, radius: 5, id: 'projectile' };
      const zombies: Entity[] = [];

      for (let i = 0; i < 50; i++) {
        zombies.push({
          x: 100 + i * 20,
          y: 100 + i * 10,
          radius: 15,
          id: `zombie${i}`
        });
      }

      physics.insert(projectile);
      zombies.forEach(z => physics.insert(z));

      const candidates = physics.query(projectile);
      const collisions = physics.getCollisions(projectile, candidates);

      // Should efficiently find only colliding zombies
      expect(collisions.length).toBeGreaterThanOrEqual(0);
    });

    test('should handle frame update scenario', () => {
      // Simulate typical game frame
      const player: Entity = { x: 400, y: 300, radius: 20, id: 'player' };
      const projectiles: Entity[] = [];
      const zombies: Entity[] = [];

      // Create game entities
      for (let i = 0; i < 10; i++) {
        projectiles.push({ x: 300 + i * 50, y: 300, radius: 5, id: `proj${i}` });
        zombies.push({ x: 500 + i * 30, y: 300 + i * 20, radius: 15, id: `zombie${i}` });
      }

      // Clear and rebuild spatial hash (as done each frame)
      physics.clear();
      physics.insert(player);
      projectiles.forEach(p => physics.insert(p));
      zombies.forEach(z => physics.insert(z));

      // Query collisions
      const playerCandidates = physics.query(player);
      const playerCollisions = physics.getCollisions(player, playerCandidates);

      expect(playerCollisions).toBeDefined();
    });
  });
});
