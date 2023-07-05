import { DEFAULT_EXTERNALS } from "../convertor/default-externals";
import { ExecutionParameters, ExecutionStep } from "../execution/ExecutionStep";
import { ObjectPool } from "./ObjectPool";
export interface ExecutionWithParams {
    steps: ExecutionStep[];
    parameters: ExecutionParameters;
}
export interface Context<E = {}> {
    parameters: ExecutionParameters[];
    cleanupActions: (() => void)[];
    objectPool: ObjectPool<ExecutionParameters>;
    postActionListener: Set<ExecutionWithParams>;
    external: (E | {}) & typeof DEFAULT_EXTERNALS;
    locked: boolean;
}
export declare function createContext<E>({ parameters, cleanupActions, objectPool, postActionListener, external, }?: {
    parameters?: ExecutionParameters[];
    cleanupActions?: (() => void)[];
    objectPool?: ObjectPool<ExecutionParameters>;
    postActionListener?: Set<ExecutionWithParams>;
    external?: E | {};
}): Context<E | {}>;
