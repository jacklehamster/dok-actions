import { ExecutionStep } from "../execution/ExecutionStep";
import { ActionConvertorList } from "./convert-action";

export enum ConvertBehavior {
    NONE,
    SKIP_REMAINING,
}

export type Convertor<T> = (action: T, results: ExecutionStep[], getSteps: (name?: string) => ExecutionStep[], external?: Record<string, any>, actionConversionMap?: ActionConvertorList) => ConvertBehavior | void;

export const DEFAULT_EXTERNALS = {
    log: console.log,
};
