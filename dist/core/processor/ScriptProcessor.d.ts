import { ConvertorSet, StepScript } from "../convertor/Convertor";
import { ExecutionParameters } from "../execution/ExecutionStep";
import { Script, ScriptFilter, Tag } from "../scripts/Script";
export interface RefreshBehavior {
    frameRate?: number;
    cleanupAfterRefresh?: boolean;
    parameters?: ExecutionParameters;
}
export interface ScriptProcessorHelper {
    refreshSteps(steps: StepScript, behavior?: RefreshBehavior, processId?: string): {
        cleanup: () => void;
        processId: string;
    };
    stopRefresh(processId: string): void;
}
export declare class ScriptProcessor<T, E = {}> {
    private scripts;
    private scriptMap?;
    private external;
    private convertorSet;
    private refreshCleanups;
    constructor(scripts: Script<T>[], external?: {}, convertorSet?: ConvertorSet);
    updateScripts(scripts: Script<T>[]): void;
    clear(): void;
    private fetchScripts;
    private createRefreshCleanup;
    getSteps(filter: ScriptFilter): Promise<StepScript>;
    runByName(name: string, parameters?: ExecutionParameters): Promise<() => void>;
    runByTags(tags: Tag[], parameters?: ExecutionParameters): Promise<() => void>;
    private refreshWithFilter;
    private stopRefresh;
    private refreshSteps;
    refreshByName(name: string, behavior?: RefreshBehavior): Promise<{
        processId: string;
        cleanup: () => void;
    }>;
    refreshByTags(tags: string[], behavior?: RefreshBehavior): Promise<{
        processId: string;
        cleanup: () => void;
    }>;
}
