import { DEFAULT_EXTERNALS } from "../convertor/default-externals";
import { ExecutionParameters, ExecutionStep } from "../execution/ExecutionStep";
import { ObjectPool } from "./ObjectPool";
export interface ExecutionWithParams {
    steps: ExecutionStep[];
    parameters: ExecutionParameters;
}
export declare class Context<E = {}> {
    parameters: ExecutionParameters[];
    objectPool: ObjectPool<ExecutionParameters>;
    external: (E | {}) & typeof DEFAULT_EXTERNALS;
    locked: boolean;
    private postActionListener;
    private cleanupActions;
    constructor({ parameters, cleanupActions, objectPool, postActionListener, external }?: {
        parameters?: ExecutionParameters[];
        cleanupActions?: (() => void)[];
        objectPool?: ObjectPool<ExecutionParameters>;
        postActionListener?: Set<ExecutionWithParams>;
        external?: E | {};
    });
    addCleanup(cleanup: () => void): void;
    addPostAction(postAction: ExecutionWithParams): void;
    deletePostAction(postAction: ExecutionWithParams): void;
    executePostActions(parameters: ExecutionParameters): void;
    cleanup(): void;
    clear(): void;
}
export declare function createContext<E>({ parameters, cleanupActions, objectPool, postActionListener, external, }?: {
    parameters?: ExecutionParameters[];
    cleanupActions?: (() => void)[];
    objectPool?: ObjectPool<ExecutionParameters>;
    postActionListener?: Set<ExecutionWithParams>;
    external?: E | {};
}): Context<E | {}>;
