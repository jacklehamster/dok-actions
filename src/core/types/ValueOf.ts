import { ExecutionParameters } from "../execution/ExecutionStep";

export type ValueOf<T> = {
    valueOf(parameters?: ExecutionParameters): T;
}

export function convertValueOf<T, U>(val: ValueOf<T>, convertor: (value: T) => U): ValueOf<U> {
    return {
        valueOf(parameters: ExecutionParameters) {
            return convertor(val.valueOf(parameters));
        }
    };
}