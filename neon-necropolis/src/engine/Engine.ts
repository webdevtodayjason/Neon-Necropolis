/**
 * Core game engine with fixed timestep game loop
 */
export class Engine {
    private lastTime: number = 0;
    private accumulator: number = 0;
    private readonly targetFPS: number = 60;
    private readonly fixedDeltaTime: number = 1000 / this.targetFPS; // ms per frame
    private animationFrameId: number | null = null;
    private running: boolean = false;

    constructor(
        private updateCallback: (deltaTime: number) => void,
        private renderCallback: () => void
    ) {}

    /**
     * Start the game loop
     */
    start(): void {
        if (this.running) return;
        this.running = true;
        this.lastTime = performance.now();
        this.accumulator = 0;
        this.loop(this.lastTime);
    }

    /**
     * Stop the game loop
     */
    stop(): void {
        this.running = false;
        if (this.animationFrameId !== null) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
    }

    /**
     * Main game loop with fixed timestep
     */
    private loop = (currentTime: number): void => {
        if (!this.running) return;

        const frameTime = currentTime - this.lastTime;
        this.lastTime = currentTime;

        // Add frame time to accumulator (cap to prevent spiral of death)
        this.accumulator += Math.min(frameTime, 250);

        // Update game logic at fixed timestep
        while (this.accumulator >= this.fixedDeltaTime) {
            this.updateCallback(this.fixedDeltaTime / 1000); // Convert to seconds
            this.accumulator -= this.fixedDeltaTime;
        }

        // Render
        this.renderCallback();

        // Request next frame
        this.animationFrameId = requestAnimationFrame(this.loop);
    };

    isRunning(): boolean {
        return this.running;
    }

    getTargetFPS(): number {
        return this.targetFPS;
    }
}
