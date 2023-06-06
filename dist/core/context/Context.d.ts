import { DEFAULT_EXTERNALS } from "../convertor/default-externals";
import { ExecutionParameters, ExecutionStep } from "../execution/ExecutionStep";
export interface Context<E = {}> {
    parameters: ExecutionParameters[];
    cleanupActions: (() => void)[];
    objectPool: ExecutionParameters[];
    postActionListener: Set<ExecutionStep>;
    external: (E | {}) & typeof DEFAULT_EXTERNALS;
    locked: boolean;
}
export declare function createContext<E>({ parameters, cleanupActions, objectPool, postActionListener, external, }?: {
    parameters?: ExecutionParameters[];
    cleanupActions?: (() => void)[];
    objectPool?: ExecutionParameters[];
    postActionListener?: Set<ExecutionStep>;
    external?: E | {};
}): Context<E | {}>;
