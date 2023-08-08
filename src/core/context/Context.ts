import { DEFAULT_EXTERNALS } from "../convertor/default-externals";
import { ExecutionParameters, ExecutionStep } from "../execution/ExecutionStep";
import { ObjectPool } from "./ObjectPool";

export interface ExecutionWithParams {
    steps: ExecutionStep[];
    parameters: ExecutionParameters;
}

export class Context<E = {}> {
    parameters: ExecutionParameters[];
    objectPool: ObjectPool<ExecutionParameters>;
    external: (E|{}) & typeof DEFAULT_EXTERNALS;
    locked: Set<string>;
    private postActionListener: Set<ExecutionWithParams>;
    private cleanupActions:(() => void)[];

    constructor({
        parameters = [],
        cleanupActions = [],
        objectPool = new ObjectPool<ExecutionParameters>(() => ({}), value => {
            for (let k in value) {
                delete value[k];
            }
        }),
        postActionListener = new Set(),
        external = {}
    }: {
        parameters?: ExecutionParameters[];
        cleanupActions?:(() => void)[];
        objectPool?: ObjectPool<ExecutionParameters>;
        postActionListener?: Set<ExecutionWithParams>;
        external?: E | {}
    } = {}) {
        this.parameters = parameters;
        this.cleanupActions = cleanupActions;
        this.objectPool = objectPool;
        this.postActionListener = postActionListener;
        this.external = {...DEFAULT_EXTERNALS, ...external};
        this.locked = new Set();
    }

    addCleanup(cleanup: () => void) {
        this.cleanupActions.push(cleanup);        
    }

    addPostAction(postAction: ExecutionWithParams) {
        if (!this.postActionListener.has(postAction)) {
            postAction.parameters.postAction = postAction;
            this.postActionListener.add(postAction);
        }
    }

    deletePostAction(postAction: ExecutionWithParams): void {
        this.postActionListener.delete(postAction);
    }

    executePostActions(parameters: ExecutionParameters): void {
        this.postActionListener.forEach(listener => {
            for (let i in parameters) {
                listener.parameters[i] = parameters[i];
            }
            listener.steps.forEach(step => step(listener.parameters, this));
        });
    }

    cleanup() {
        this.cleanupActions.forEach(action => action());
        this.cleanupActions.length = 0;
    }

    clear() {
        this.cleanup();
        this.postActionListener.clear();
    }
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
    return new Context({parameters, cleanupActions, objectPool, postActionListener, external});
}
