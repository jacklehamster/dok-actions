import { ActionConvertorList } from "../convertor/convert-action";
import { ExecutionParameters, ExecutionStep } from "../execution/ExecutionStep";
import { Script, ScriptFilter, Tag } from "../scripts/Script";
export interface RefreshBehavior {
    frameRate?: number;
    cleanupAfterRefresh?: boolean;
    parameters?: ExecutionParameters;
}
export interface ScriptProcessorHelper {
    refreshSteps(steps: ExecutionStep[], behavior?: RefreshBehavior, processId?: string): () => void;
    stopRefresh(processId: string): void;
}
export declare class ScriptProcessor<T, E = {}> {
    private scripts;
    private scriptMap?;
    private external;
    private actionConversionMap;
    private refreshCleanups;
    constructor(scripts: Script<T>[], external?: {}, actionConversionMap?: ActionConvertorList);
    clear(): void;
    private fetchScripts;
    private createRefreshCleanup;
    getSteps(filter: ScriptFilter): Promise<ExecutionStep[]>;
    runByName(name: string, parameters?: ExecutionParameters): Promise<() => void>;
    runByTags(tags: Tag[], parameters?: ExecutionParameters): Promise<() => void>;
    private refreshWithFilter;
    private stopRefresh;
    private refreshSteps;
    refreshByName(name: string, behavior?: RefreshBehavior): Promise<() => void>;
    refreshByTags(tags: string[], behavior?: RefreshBehavior): Promise<() => void>;
}
