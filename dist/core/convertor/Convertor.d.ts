import { ExecutionStep } from "../execution/ExecutionStep";
import { RefreshBehavior } from "../processor/ScriptProcessor";
import { ScriptFilter } from "../scripts/Script";
import { ActionConvertorList } from "./convert-action";
export declare type GetSteps = (filter: ScriptFilter) => ExecutionStep[];
export declare enum ConvertBehavior {
    NONE = 0,
    SKIP_REMAINING_CONVERTORS = 1,
    SKIP_REMAINING_ACTIONS = 2
}
export interface Utils<T> {
    refreshSteps(steps: ExecutionStep[], loopBehavior?: RefreshBehavior, processId?: string): void;
    stopRefresh(processId?: string): void;
    getSteps: GetSteps;
    getRemainingActions: () => T[];
}
export declare type Convertor<T> = (action: T, results: ExecutionStep[], utils: Utils<T>, external: Record<string, any>, actionConversionMap: ActionConvertorList) => Promise<ConvertBehavior | void>;
