import { ExecutionParameters } from "../execution/ExecutionStep";
export declare type ValueOf<T> = {
    valueOf(parameters?: ExecutionParameters): T;
};
