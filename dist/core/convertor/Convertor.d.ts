import { Context } from "../context/Context";
import { ExecutionParameters, ExecutionStep } from "../execution/ExecutionStep";
import { RefreshBehavior } from "../processor/ScriptProcessor";
import { ScriptFilter } from "../scripts/Script";
export declare type ActionConvertorList = Convertor<any>[];
export interface ConvertorSet {
    actionsConvertor: ActionConvertorList;
}
export declare type GetSteps = (filter: ScriptFilter) => StepScript;
export declare enum ConvertBehavior {
    NONE = 0,
    SKIP_REMAINING_CONVERTORS = 1,
    SKIP_REMAINING_ACTIONS = 2
}
export interface Utils<T> {
    refreshSteps(steps: StepScript, loopBehavior?: RefreshBehavior, processId?: string): {
        cleanup: () => void;
        processId: string;
    };
    stopRefresh(processId?: string): void;
    getSteps: GetSteps;
    getRemainingActions: () => T[];
    executeCallback?: Record<string, (context: Context, additionalParameters: ExecutionParameters) => void>;
}
export declare class StepScript {
    private steps;
    constructor(steps?: ExecutionStep[]);
    add(step: ExecutionStep): void;
    getSteps(): ExecutionStep[];
}
export declare type Convertor<T> = (action: T, results: StepScript, utils: Utils<T>, external: Record<string, any>, convertorSet: ConvertorSet) => Promise<ConvertBehavior | void>;
