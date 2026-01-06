/**
 * Input.test.ts
 * Comprehensive tests for the input management system
 */

import { Input } from '../../src/engine/Input';

describe('Input', () => {
  let input: Input;

  beforeEach(() => {
    input = new Input();
  });

  describe('Initialization', () => {
    it('should create input manager', () => {
      expect(input).toBeDefined();
    });

    it('should setup event listeners', () => {
      expect(window.addEventListener).toHaveBeenCalled();
    });

    it('should have no keys pressed initially', () => {
      expect(input.isKeyDown('KeyW')).toBe(false);
      expect(input.isKeyDown('KeyA')).toBe(false);
      expect(input.isKeyDown('KeyS')).toBe(false);
      expect(input.isKeyDown('KeyD')).toBe(false);
    });

    it('should return zero movement initially', () => {
      const movement = input.getMovementInput();
      expect(movement.x).toBe(0);
      expect(movement.y).toBe(0);
    });
  });

  describe('Key Down Detection', () => {
    it('should detect key down', () => {
      (global as any).triggerKeyEvent('keydown', 'KeyW');
      expect(input.isKeyDown('KeyW')).toBe(true);
    });

    it('should detect multiple keys down', () => {
      (global as any).triggerKeyEvent('keydown', 'KeyW');
      (global as any).triggerKeyEvent('keydown', 'KeyA');

      expect(input.isKeyDown('KeyW')).toBe(true);
      expect(input.isKeyDown('KeyA')).toBe(true);
    });

    it('should not detect unpressed keys', () => {
      (global as any).triggerKeyEvent('keydown', 'KeyW');

      expect(input.isKeyDown('KeyW')).toBe(true);
      expect(input.isKeyDown('KeyS')).toBe(false);
    });

    it('should handle all WASD keys', () => {
      (global as any).triggerKeyEvent('keydown', 'KeyW');
      (global as any).triggerKeyEvent('keydown', 'KeyA');
      (global as any).triggerKeyEvent('keydown', 'KeyS');
      (global as any).triggerKeyEvent('keydown', 'KeyD');

      expect(input.isKeyDown('KeyW')).toBe(true);
      expect(input.isKeyDown('KeyA')).toBe(true);
      expect(input.isKeyDown('KeyS')).toBe(true);
      expect(input.isKeyDown('KeyD')).toBe(true);
    });

    it('should handle arrow keys', () => {
      (global as any).triggerKeyEvent('keydown', 'ArrowUp');
      (global as any).triggerKeyEvent('keydown', 'ArrowDown');
      (global as any).triggerKeyEvent('keydown', 'ArrowLeft');
      (global as any).triggerKeyEvent('keydown', 'ArrowRight');

      expect(input.isKeyDown('ArrowUp')).toBe(true);
      expect(input.isKeyDown('ArrowDown')).toBe(true);
      expect(input.isKeyDown('ArrowLeft')).toBe(true);
      expect(input.isKeyDown('ArrowRight')).toBe(true);
    });
  });

  describe('Key Up Detection', () => {
    it('should detect key release', () => {
      (global as any).triggerKeyEvent('keydown', 'KeyW');
      expect(input.isKeyDown('KeyW')).toBe(true);

      (global as any).triggerKeyEvent('keyup', 'KeyW');
      expect(input.isKeyDown('KeyW')).toBe(false);
    });

    it('should handle multiple key releases', () => {
      (global as any).triggerKeyEvent('keydown', 'KeyW');
      (global as any).triggerKeyEvent('keydown', 'KeyA');

      (global as any).triggerKeyEvent('keyup', 'KeyW');

      expect(input.isKeyDown('KeyW')).toBe(false);
      expect(input.isKeyDown('KeyA')).toBe(true);

      (global as any).triggerKeyEvent('keyup', 'KeyA');

      expect(input.isKeyDown('KeyA')).toBe(false);
    });
  });

  describe('Key Pressed Detection (One Frame)', () => {
    it('should detect key just pressed', () => {
      (global as any).triggerKeyEvent('keydown', 'KeyW');
      expect(input.isKeyPressed('KeyW')).toBe(true);
    });

    it('should clear pressed state after update', () => {
      (global as any).triggerKeyEvent('keydown', 'KeyW');
      expect(input.isKeyPressed('KeyW')).toBe(true);

      input.update();

      expect(input.isKeyPressed('KeyW')).toBe(false);
      expect(input.isKeyDown('KeyW')).toBe(true); // Still held
    });

    it('should not detect pressed for already held keys', () => {
      (global as any).triggerKeyEvent('keydown', 'KeyW');
      input.update();

      // Key is still down but not "just pressed"
      expect(input.isKeyDown('KeyW')).toBe(true);
      expect(input.isKeyPressed('KeyW')).toBe(false);
    });

    it('should detect pressed again after release and repress', () => {
      (global as any).triggerKeyEvent('keydown', 'KeyW');
      input.update();

      (global as any).triggerKeyEvent('keyup', 'KeyW');
      input.update();

      (global as any).triggerKeyEvent('keydown', 'KeyW');

      expect(input.isKeyPressed('KeyW')).toBe(true);
    });
  });

  describe('Key Released Detection (One Frame)', () => {
    it('should detect key just released', () => {
      (global as any).triggerKeyEvent('keydown', 'KeyW');
      input.update();

      (global as any).triggerKeyEvent('keyup', 'KeyW');

      expect(input.isKeyReleased('KeyW')).toBe(true);
    });

    it('should clear released state after update', () => {
      (global as any).triggerKeyEvent('keydown', 'KeyW');
      input.update();

      (global as any).triggerKeyEvent('keyup', 'KeyW');
      expect(input.isKeyReleased('KeyW')).toBe(true);

      input.update();

      expect(input.isKeyReleased('KeyW')).toBe(false);
    });

    it('should not detect released for keys that were never pressed', () => {
      expect(input.isKeyReleased('KeyW')).toBe(false);
    });
  });

  describe('Movement Input - WASD', () => {
    it('should detect W key as up movement', () => {
      (global as any).triggerKeyEvent('keydown', 'KeyW');

      const movement = input.getMovementInput();
      expect(movement.x).toBe(0);
      expect(movement.y).toBe(-1);
    });

    it('should detect S key as down movement', () => {
      (global as any).triggerKeyEvent('keydown', 'KeyS');

      const movement = input.getMovementInput();
      expect(movement.x).toBe(0);
      expect(movement.y).toBe(1);
    });

    it('should detect A key as left movement', () => {
      (global as any).triggerKeyEvent('keydown', 'KeyA');

      const movement = input.getMovementInput();
      expect(movement.x).toBe(-1);
      expect(movement.y).toBe(0);
    });

    it('should detect D key as right movement', () => {
      (global as any).triggerKeyEvent('keydown', 'KeyD');

      const movement = input.getMovementInput();
      expect(movement.x).toBe(1);
      expect(movement.y).toBe(0);
    });
  });

  describe('Movement Input - Arrow Keys', () => {
    it('should detect ArrowUp as up movement', () => {
      (global as any).triggerKeyEvent('keydown', 'ArrowUp');

      const movement = input.getMovementInput();
      expect(movement.x).toBe(0);
      expect(movement.y).toBe(-1);
    });

    it('should detect ArrowDown as down movement', () => {
      (global as any).triggerKeyEvent('keydown', 'ArrowDown');

      const movement = input.getMovementInput();
      expect(movement.x).toBe(0);
      expect(movement.y).toBe(1);
    });

    it('should detect ArrowLeft as left movement', () => {
      (global as any).triggerKeyEvent('keydown', 'ArrowLeft');

      const movement = input.getMovementInput();
      expect(movement.x).toBe(-1);
      expect(movement.y).toBe(0);
    });

    it('should detect ArrowRight as right movement', () => {
      (global as any).triggerKeyEvent('keydown', 'ArrowRight');

      const movement = input.getMovementInput();
      expect(movement.x).toBe(1);
      expect(movement.y).toBe(0);
    });
  });

  describe('Diagonal Movement', () => {
    it('should normalize diagonal movement (up-right)', () => {
      (global as any).triggerKeyEvent('keydown', 'KeyW');
      (global as any).triggerKeyEvent('keydown', 'KeyD');

      const movement = input.getMovementInput();

      // Should be normalized (length = 1)
      const length = Math.sqrt(movement.x * movement.x + movement.y * movement.y);
      expect(length).toBeCloseTo(1, 5);

      expect(movement.x).toBeGreaterThan(0);
      expect(movement.y).toBeLessThan(0);
    });

    it('should normalize diagonal movement (up-left)', () => {
      (global as any).triggerKeyEvent('keydown', 'KeyW');
      (global as any).triggerKeyEvent('keydown', 'KeyA');

      const movement = input.getMovementInput();

      const length = Math.sqrt(movement.x * movement.x + movement.y * movement.y);
      expect(length).toBeCloseTo(1, 5);

      expect(movement.x).toBeLessThan(0);
      expect(movement.y).toBeLessThan(0);
    });

    it('should normalize diagonal movement (down-right)', () => {
      (global as any).triggerKeyEvent('keydown', 'KeyS');
      (global as any).triggerKeyEvent('keydown', 'KeyD');

      const movement = input.getMovementInput();

      const length = Math.sqrt(movement.x * movement.x + movement.y * movement.y);
      expect(length).toBeCloseTo(1, 5);

      expect(movement.x).toBeGreaterThan(0);
      expect(movement.y).toBeGreaterThan(0);
    });

    it('should normalize diagonal movement (down-left)', () => {
      (global as any).triggerKeyEvent('keydown', 'KeyS');
      (global as any).triggerKeyEvent('keydown', 'KeyA');

      const movement = input.getMovementInput();

      const length = Math.sqrt(movement.x * movement.x + movement.y * movement.y);
      expect(length).toBeCloseTo(1, 5);

      expect(movement.x).toBeLessThan(0);
      expect(movement.y).toBeGreaterThan(0);
    });
  });

  describe('Opposite Key Cancellation', () => {
    it('should cancel W and S keys', () => {
      (global as any).triggerKeyEvent('keydown', 'KeyW');
      (global as any).triggerKeyEvent('keydown', 'KeyS');

      const movement = input.getMovementInput();
      expect(movement.x).toBe(0);
      expect(movement.y).toBe(0);
    });

    it('should cancel A and D keys', () => {
      (global as any).triggerKeyEvent('keydown', 'KeyA');
      (global as any).triggerKeyEvent('keydown', 'KeyD');

      const movement = input.getMovementInput();
      expect(movement.x).toBe(0);
      expect(movement.y).toBe(0);
    });

    it('should cancel ArrowUp and ArrowDown', () => {
      (global as any).triggerKeyEvent('keydown', 'ArrowUp');
      (global as any).triggerKeyEvent('keydown', 'ArrowDown');

      const movement = input.getMovementInput();
      expect(movement.x).toBe(0);
      expect(movement.y).toBe(0);
    });

    it('should cancel ArrowLeft and ArrowRight', () => {
      (global as any).triggerKeyEvent('keydown', 'ArrowLeft');
      (global as any).triggerKeyEvent('keydown', 'ArrowRight');

      const movement = input.getMovementInput();
      expect(movement.x).toBe(0);
      expect(movement.y).toBe(0);
    });
  });

  describe('Mixed Input (WASD + Arrows)', () => {
    it('should combine W and ArrowUp', () => {
      (global as any).triggerKeyEvent('keydown', 'KeyW');
      (global as any).triggerKeyEvent('keydown', 'ArrowUp');

      const movement = input.getMovementInput();
      expect(movement.x).toBe(0);
      expect(movement.y).toBe(-1);
    });

    it('should combine A and ArrowLeft', () => {
      (global as any).triggerKeyEvent('keydown', 'KeyA');
      (global as any).triggerKeyEvent('keydown', 'ArrowLeft');

      const movement = input.getMovementInput();
      expect(movement.x).toBe(-1);
      expect(movement.y).toBe(0);
    });

    it('should handle mixed WASD and arrow diagonal', () => {
      (global as any).triggerKeyEvent('keydown', 'KeyW');
      (global as any).triggerKeyEvent('keydown', 'ArrowRight');

      const movement = input.getMovementInput();

      const length = Math.sqrt(movement.x * movement.x + movement.y * movement.y);
      expect(length).toBeCloseTo(1, 5);

      expect(movement.x).toBeGreaterThan(0);
      expect(movement.y).toBeLessThan(0);
    });
  });

  describe('Update Cycle', () => {
    it('should clear pressed keys after update', () => {
      (global as any).triggerKeyEvent('keydown', 'KeyW');
      expect(input.isKeyPressed('KeyW')).toBe(true);

      input.update();

      expect(input.isKeyPressed('KeyW')).toBe(false);
    });

    it('should clear released keys after update', () => {
      (global as any).triggerKeyEvent('keydown', 'KeyW');
      input.update();

      (global as any).triggerKeyEvent('keyup', 'KeyW');
      expect(input.isKeyReleased('KeyW')).toBe(true);

      input.update();

      expect(input.isKeyReleased('KeyW')).toBe(false);
    });

    it('should maintain held keys across updates', () => {
      (global as any).triggerKeyEvent('keydown', 'KeyW');
      input.update();

      expect(input.isKeyDown('KeyW')).toBe(true);

      input.update();

      expect(input.isKeyDown('KeyW')).toBe(true);
    });

    it('should handle multiple update cycles', () => {
      (global as any).triggerKeyEvent('keydown', 'KeyW');

      for (let i = 0; i < 10; i++) {
        input.update();
        expect(input.isKeyDown('KeyW')).toBe(true);
        expect(input.isKeyPressed('KeyW')).toBe(false);
      }
    });
  });

  describe('Event Prevention', () => {
    it('should prevent default for arrow keys', () => {
      const event = (global as any).triggerKeyEvent('keydown', 'ArrowUp');
      expect(event.defaultPrevented).toBe(true);
    });

    it('should prevent default for Space key', () => {
      const event = (global as any).triggerKeyEvent('keydown', 'Space');
      expect(event.defaultPrevented).toBe(true);
    });

    it('should not prevent default for non-game keys', () => {
      const event = (global as any).triggerKeyEvent('keydown', 'KeyZ');
      expect(event.defaultPrevented).toBe(false);
    });
  });

  describe('Edge Cases', () => {
    it('should handle rapid key presses', () => {
      for (let i = 0; i < 100; i++) {
        (global as any).triggerKeyEvent('keydown', 'KeyW');
        input.update();
        (global as any).triggerKeyEvent('keyup', 'KeyW');
        input.update();
      }

      expect(input.isKeyDown('KeyW')).toBe(false);
    });

    it('should handle all keys pressed simultaneously', () => {
      (global as any).triggerKeyEvent('keydown', 'KeyW');
      (global as any).triggerKeyEvent('keydown', 'KeyA');
      (global as any).triggerKeyEvent('keydown', 'KeyS');
      (global as any).triggerKeyEvent('keydown', 'KeyD');
      (global as any).triggerKeyEvent('keydown', 'ArrowUp');
      (global as any).triggerKeyEvent('keydown', 'ArrowDown');
      (global as any).triggerKeyEvent('keydown', 'ArrowLeft');
      (global as any).triggerKeyEvent('keydown', 'ArrowRight');

      const movement = input.getMovementInput();

      // Opposite keys should cancel
      expect(movement.x).toBe(0);
      expect(movement.y).toBe(0);
    });

    it('should handle key release without keydown', () => {
      expect(() => {
        (global as any).triggerKeyEvent('keyup', 'KeyW');
      }).not.toThrow();

      expect(input.isKeyDown('KeyW')).toBe(false);
    });

    it('should handle unknown key codes', () => {
      (global as any).triggerKeyEvent('keydown', 'UnknownKey');

      expect(input.isKeyDown('UnknownKey')).toBe(true);
      expect(input.getMovementInput()).toEqual({ x: 0, y: 0 });
    });
  });

  describe('Multiple Input Instances', () => {
    it('should handle multiple input managers independently', () => {
      const input2 = new Input();

      (global as any).triggerKeyEvent('keydown', 'KeyW');

      // Both should detect the key
      expect(input.isKeyDown('KeyW')).toBe(true);
      expect(input2.isKeyDown('KeyW')).toBe(true);
    });
  });

  describe('Performance', () => {
    it('should handle high-frequency updates', () => {
      (global as any).triggerKeyEvent('keydown', 'KeyW');

      const start = performance.now();

      for (let i = 0; i < 1000; i++) {
        input.getMovementInput();
        input.update();
      }

      const elapsed = performance.now() - start;

      expect(elapsed).toBeLessThan(100); // Should be very fast
    });

    it('should handle many simultaneous key states', () => {
      // Press many keys
      for (let i = 0; i < 26; i++) {
        const keyCode = `Key${String.fromCharCode(65 + i)}`;
        (global as any).triggerKeyEvent('keydown', keyCode);
      }

      const movement = input.getMovementInput();

      expect(movement).toBeDefined();
    });
  });
});
