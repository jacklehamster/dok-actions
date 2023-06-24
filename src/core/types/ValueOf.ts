import { ExecutionParameters } from "../execution/ExecutionStep";

export type ValueOf<T> = {
    valueOf(parameters?: ExecutionParameters): T;
}
