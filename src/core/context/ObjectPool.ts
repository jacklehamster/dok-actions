export class ObjectPool<T> {
    private factory: () => T;
    private cleanup: (value: T) => void;
    private pool: T[] = [];
    constructor(factory: () => T, cleanup: (value: T) => void) {
        this.factory = factory;
        this.cleanup = cleanup;
    }

    generate(): T {
        return this.pool.pop() ?? this.factory();
    }

    recycle(value: T) {
        this.cleanup(value);
        this.pool.push(value);
    }
}