import { Context } from "../context/Context";
import { ExecutionParameters, ExecutionStep } from "../execution/ExecutionStep";
import { RefreshBehavior } from "../processor/ScriptProcessor";
import { ScriptFilter } from "../scripts/Script";

export type ActionConvertorList = Convertor<any>[];

export interface ConvertorSet {
    actionsConvertor: ActionConvertorList,
}

export type GetSteps = (filter: ScriptFilter) => ExecutionStep[];

export enum ConvertBehavior {
    NONE,
    SKIP_REMAINING_CONVERTORS,
    SKIP_REMAINING_ACTIONS,
}

export interface Utils<T> {
    refreshSteps(steps: ExecutionStep[], loopBehavior?: RefreshBehavior, processId?: string): { cleanup: () => void; processId: string };
    stopRefresh(processId?: string): void;
    getSteps: GetSteps;
    getRemainingActions: () => T[];
    executeCallback?: Record<string, (context: Context, additionalParameters: ExecutionParameters) => void>;
}

export type Convertor<T> = (action: T, results: ExecutionStep[], utils: Utils<T>, external: Record<string, any>, convertorSet: ConvertorSet) => Promise<ConvertBehavior | void>;
