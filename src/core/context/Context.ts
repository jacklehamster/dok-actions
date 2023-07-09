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

export function addPostAction(postAction: ExecutionWithParams, context: Context): void {
    if (!context.postActionListener.has(postAction)) {
        context.postActionListener.add(postAction);
        context.cleanupActions.push(() => {
            postAction.steps.forEach(step => step(postAction.parameters, context));
        });    
    }
}

export function deletePostAction(postAction: ExecutionWithParams, context: Context): void {
    context.postActionListener.delete(postAction);
}

export function executePostActions(parameters: ExecutionParameters, context: Context): void {
    context.postActionListener.forEach(listener => {
        for (let i in parameters) {
            listener.parameters[i] = parameters[i];
        }
        listener.steps.forEach(step => step(listener.parameters, context));
    });
}