import { ExecutionParameters } from "../execution/ExecutionStep";
export interface Context {
    parameters?: ExecutionParameters[];
    cleanupActions?: (() => void)[];
    objectPool?: ExecutionParameters[];
}
