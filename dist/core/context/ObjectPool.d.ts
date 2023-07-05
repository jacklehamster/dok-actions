export declare class ObjectPool<T> {
    private factory;
    private cleanup;
    private pool;
    constructor(factory: () => T, cleanup: (value: T) => void);
    generate(): T;
    recycle(value: T): void;
}
