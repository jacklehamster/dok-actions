import { ExecutionStep } from "../execution/ExecutionStep";
import { ScriptFilter } from "../scripts/Script";
import { ActionConvertorList } from "./convert-action";

export type GetSteps = (filter: ScriptFilter) => ExecutionStep[];

export enum ConvertBehavior {
    NONE,
    SKIP_REMAINING_CONVERTORS,
    SKIP_REMAINING_ACTIONS,
}

export interface Utils<T> {
    getSteps: GetSteps;
    getRemainingActions: () => T[]; 
}

export type Convertor<T> = (action: T, results: ExecutionStep[], utils: Utils<T>, external: Record<string, any>, actionConversionMap: ActionConvertorList) => ConvertBehavior | void;

export const DEFAULT_EXTERNALS = {
    log: console.log,
    setTimeout,
    clearTimeout,
};
