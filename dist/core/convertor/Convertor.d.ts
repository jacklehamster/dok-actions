import { ExecutionStep } from "../execution/ExecutionStep";
import { ScriptFilter } from "../scripts/Script";
import { ActionConvertorList } from "./convert-action";
export declare type GetSteps = (filter: ScriptFilter) => ExecutionStep[];
export declare enum ConvertBehavior {
    NONE = 0,
    SKIP_REMAINING_CONVERTORS = 1,
    SKIP_REMAINING_ACTIONS = 2
}
export interface Utils<T> {
    getSteps: GetSteps;
    getRemainingActions: () => T[];
}
export declare type Convertor<T> = (action: T, results: ExecutionStep[], utils: Utils<T>, external: Record<string, any>, actionConversionMap: ActionConvertorList) => ConvertBehavior | void;
export declare const DEFAULT_EXTERNALS: {
    log: {
        (...data: any[]): void;
        (message?: any, ...optionalParams: any[]): void;
    };
    setTimeout: typeof setTimeout;
    clearTimeout: typeof clearTimeout;
};
