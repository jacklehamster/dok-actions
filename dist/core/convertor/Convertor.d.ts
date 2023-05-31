import { ExecutionStep } from "../execution/ExecutionStep";
import { ActionConvertorList } from "./convert-action";
export declare enum ConvertBehavior {
    NONE = 0,
    SKIP_REMAINING = 1
}
export declare type Convertor<T> = (action: T, results: ExecutionStep[], getSteps: (name?: string) => ExecutionStep[], external: Record<string, any>, actionConversionMap: ActionConvertorList) => ConvertBehavior | void;
export declare const DEFAULT_EXTERNALS: {
    log: {
        (...data: any[]): void;
        (message?: any, ...optionalParams: any[]): void;
    };
};
