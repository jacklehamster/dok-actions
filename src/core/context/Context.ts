import { DEFAULT_EXTERNALS } from "../convertor/default-externals";
import { ExecutionParameters, ExecutionStep } from "../execution/ExecutionStep";
import { ObjectPool } from "./ObjectPool";

export interface ExecutionWithParams {
    steps: ExecutionStep[];
    parameters: ExecutionParameters;
}

export interface Context<E = {}> {
    parameters: ExecutionParameters[];
    cleanupActions:(() => void)[];
    objectPool: ObjectPool<ExecutionParameters>;
    postActionListener: Set<ExecutionWithParams>;
    external: (E|{}) & typeof DEFAULT_EXTERNALS;
    locked: boolean;
}

export function createContext<E>({
        parameters = [],
        cleanupActions = [],
        objectPool = new ObjectPool<ExecutionParameters>(() => ({}), value => {
            for (let k in value) {
                delete value[k];
            }
        }),
        postActionListener = new Set(),
        external = {},
}: {
    parameters?: ExecutionParameters[];
    cleanupActions?:(() => void)[];
    objectPool?: ObjectPool<ExecutionParameters>;
    postActionListener?: Set<ExecutionWithParams>;
    external?: E | {};
} = {}): Context<E|{}> {
    return {
        parameters,
        cleanupActions,
        objectPool,
        postActionListener,
        external: {...DEFAULT_EXTERNALS, ...external},
        locked: false,
    };
}