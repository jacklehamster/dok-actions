import { ExecutionParameters } from "../execution/ExecutionStep";
export declare type ValueOf<T> = {
    valueOf(parameters?: ExecutionParameters): T;
};
export declare function convertValueOf<T, U>(val: ValueOf<T>, convertor: (value: T) => U): ValueOf<U>;
