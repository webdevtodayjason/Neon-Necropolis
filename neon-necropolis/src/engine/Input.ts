/**
 * Input manager for keyboard controls
 */
export class Input {
    private keys: Set<string> = new Set();
    private keysPressed: Set<string> = new Set();
    private keysReleased: Set<string> = new Set();

    constructor() {
        this.setupEventListeners();
    }

    private setupEventListeners(): void {
        window.addEventListener('keydown', (e) => {
            if (!this.keys.has(e.code)) {
                this.keysPressed.add(e.code);
            }
            this.keys.add(e.code);
        });

        window.addEventListener('keyup', (e) => {
            this.keys.delete(e.code);
            this.keysReleased.add(e.code);
        });

        // Prevent default behavior for game keys
        window.addEventListener('keydown', (e) => {
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
                e.preventDefault();
            }
        });
    }

    /**
     * Check if a key is currently held down
     */
    isKeyDown(key: string): boolean {
        return this.keys.has(key);
    }

    /**
     * Check if a key was just pressed this frame
     */
    isKeyPressed(key: string): boolean {
        return this.keysPressed.has(key);
    }

    /**
     * Check if a key was just released this frame
     */
    isKeyReleased(key: string): boolean {
        return this.keysReleased.has(key);
    }

    /**
     * Get movement input as normalized vector
     */
    getMovementInput(): { x: number; y: number } {
        let x = 0;
        let y = 0;

        // WASD
        if (this.isKeyDown('KeyW')) y -= 1;
        if (this.isKeyDown('KeyS')) y += 1;
        if (this.isKeyDown('KeyA')) x -= 1;
        if (this.isKeyDown('KeyD')) x += 1;

        // Arrow keys
        if (this.isKeyDown('ArrowUp')) y -= 1;
        if (this.isKeyDown('ArrowDown')) y += 1;
        if (this.isKeyDown('ArrowLeft')) x -= 1;
        if (this.isKeyDown('ArrowRight')) x += 1;

        // Normalize diagonal movement
        if (x !== 0 && y !== 0) {
            const length = Math.sqrt(x * x + y * y);
            x /= length;
            y /= length;
        }

        return { x, y };
    }

    /**
     * Clear one-frame input states (call at end of update)
     */
    update(): void {
        this.keysPressed.clear();
        this.keysReleased.clear();
    }
}
