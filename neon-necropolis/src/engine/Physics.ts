/**
 * Physics engine with spatial hashing for efficient collision detection
 */

export interface Entity {
    x: number;
    y: number;
    radius: number;
    id: string;
}

export class Physics {
    private cellSize: number;
    private grid: Map<string, Set<Entity>>;

    constructor(cellSize: number = 100) {
        this.cellSize = cellSize;
        this.grid = new Map();
    }

    /**
     * Clear the spatial hash grid
     */
    clear(): void {
        this.grid.clear();
    }

    /**
     * Get grid cell key for a position
     */
    private getCellKey(x: number, y: number): string {
        const cellX = Math.floor(x / this.cellSize);
        const cellY = Math.floor(y / this.cellSize);
        return `${cellX},${cellY}`;
    }

    /**
     * Get all cell keys that an entity occupies
     */
    private getEntityCells(entity: Entity): string[] {
        const cells: string[] = [];
        const minX = entity.x - entity.radius;
        const maxX = entity.x + entity.radius;
        const minY = entity.y - entity.radius;
        const maxY = entity.y + entity.radius;

        const minCellX = Math.floor(minX / this.cellSize);
        const maxCellX = Math.floor(maxX / this.cellSize);
        const minCellY = Math.floor(minY / this.cellSize);
        const maxCellY = Math.floor(maxY / this.cellSize);

        for (let x = minCellX; x <= maxCellX; x++) {
            for (let y = minCellY; y <= maxCellY; y++) {
                cells.push(`${x},${y}`);
            }
        }

        return cells;
    }

    /**
     * Insert an entity into the spatial hash
     */
    insert(entity: Entity): void {
        const cells = this.getEntityCells(entity);
        for (const cell of cells) {
            if (!this.grid.has(cell)) {
                this.grid.set(cell, new Set());
            }
            this.grid.get(cell)!.add(entity);
        }
    }

    /**
     * Get potential collision candidates for an entity
     */
    query(entity: Entity): Set<Entity> {
        const candidates = new Set<Entity>();
        const cells = this.getEntityCells(entity);

        for (const cell of cells) {
            const cellEntities = this.grid.get(cell);
            if (cellEntities) {
                cellEntities.forEach(e => {
                    if (e.id !== entity.id) {
                        candidates.add(e);
                    }
                });
            }
        }

        return candidates;
    }

    /**
     * Check if two entities are colliding (circle collision)
     */
    static checkCollision(a: Entity, b: Entity): boolean {
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const distanceSquared = dx * dx + dy * dy;
        const radiusSum = a.radius + b.radius;
        return distanceSquared < radiusSum * radiusSum;
    }

    /**
     * Get actual collisions from candidates
     */
    getCollisions(entity: Entity, candidates: Set<Entity>): Entity[] {
        const collisions: Entity[] = [];
        candidates.forEach(candidate => {
            if (Physics.checkCollision(entity, candidate)) {
                collisions.push(candidate);
            }
        });
        return collisions;
    }

    /**
     * Calculate distance between two points
     */
    static distance(x1: number, y1: number, x2: number, y2: number): number {
        const dx = x2 - x1;
        const dy = y2 - y1;
        return Math.sqrt(dx * dx + dy * dy);
    }

    /**
     * Normalize a vector
     */
    static normalize(x: number, y: number): { x: number; y: number } {
        const length = Math.sqrt(x * x + y * y);
        if (length === 0) return { x: 0, y: 0 };
        return { x: x / length, y: y / length };
    }

    /**
     * Get angle between two points
     */
    static angle(x1: number, y1: number, x2: number, y2: number): number {
        return Math.atan2(y2 - y1, x2 - x1);
    }
}
