import { DEFAULT_EXTERNALS } from "../convertor/Convertor";
import { ExecutionParameters, ExecutionStep } from "../execution/ExecutionStep";

export interface Context<E = {}> {
    parameters: ExecutionParameters[];
    cleanupActions:(() => void)[];
    objectPool: ExecutionParameters[];
    postActionListener: Set<ExecutionStep>;
    external: (E|{}) & typeof DEFAULT_EXTERNALS;
    locked: boolean;
}

export function createContext<E>({
        parameters = [],
        cleanupActions = [],
        objectPool = [],
        postActionListener = new Set(),
        external = {},
}: {
    parameters?: ExecutionParameters[];
    cleanupActions?:(() => void)[];
    objectPool?: ExecutionParameters[];
    postActionListener?: Set<ExecutionStep>;
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