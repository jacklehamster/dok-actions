import { DokAction } from "../actions/Action";
import { ExecutionStep } from "../execution/ExecutionStep";
import { ActionConversionMap } from "./convert-action";
export declare enum ConvertBehavior {
    NONE = 0,
    SKIP_REMAINING = 1
}
export declare type Convertor = (action: DokAction, results: ExecutionStep[], getSteps: (name?: string) => ExecutionStep[], external?: Record<string, any>, actionConversionMap?: ActionConversionMap) => ConvertBehavior | void;
export declare const DEFAULT_EXTERNALS: {
    log: {
        (...data: any[]): void;
        (message?: any, ...optionalParams: any[]): void;
    };
};
