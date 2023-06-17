import { ExecutionStep } from "../execution/ExecutionStep";
import { RefreshBehavior } from "../processor/ScriptProcessor";
import { ScriptFilter } from "../scripts/Script";
import { ActionConvertorList } from "./convert-action";

export type GetSteps = (filter: ScriptFilter) => ExecutionStep[];

export enum ConvertBehavior {
    NONE,
    SKIP_REMAINING_CONVERTORS,
    SKIP_REMAINING_ACTIONS,
}

export interface Utils<T> {
    refreshSteps(steps: ExecutionStep[], loopBehavior?: RefreshBehavior, processId?: string): () => void;
    stopRefresh(processId?: string): void;
    getSteps: GetSteps;
    getRemainingActions: () => T[];
}

export type Convertor<T> = (action: T, results: ExecutionStep[], utils: Utils<T>, external: Record<string, any>, actionConversionMap: ActionConvertorList) => Promise<ConvertBehavior | void>;
