import { Context } from "../context/Context";
import { ExecutionParameters, ExecutionStep } from "../execution/ExecutionStep";
import { RefreshBehavior } from "../processor/ScriptProcessor";
import { ScriptFilter } from "../scripts/Script";

export type ActionConvertorList = Convertor<any>[];

export interface ConvertorSet {
    actionsConvertor: ActionConvertorList,
}

export type GetSteps = (filter: ScriptFilter) => StepScript;

export enum ConvertBehavior {
    NONE,
    SKIP_REMAINING_CONVERTORS,
    SKIP_REMAINING_ACTIONS,
}

export interface Utils<T> {
    refreshSteps(steps: StepScript, loopBehavior?: RefreshBehavior, processId?: string): { cleanup: () => void; processId: string };
    stopRefresh(processId?: string): void;
    getSteps: GetSteps;
    getRemainingActions: () => T[];
    executeCallback?: Record<string, (context: Context, additionalParameters: ExecutionParameters) => void>;
}

export class StepScript {
    private steps: ExecutionStep[] = [];

    constructor(steps?: ExecutionStep[]) {
        steps?.forEach(step => this.add(step));
    }

    add(step: ExecutionStep) {
        this.steps.push(step);
    }

    getSteps() {
        return this.steps;
    }
}

export type Convertor<T> = (action: T, results: StepScript, utils: Utils<T>, external: Record<string, any>, convertorSet: ConvertorSet) => Promise<ConvertBehavior | void>;
