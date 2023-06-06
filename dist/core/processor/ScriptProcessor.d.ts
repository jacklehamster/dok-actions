import { ActionConvertorList } from "../convertor/convert-action";
import { ExecutionStep } from "../execution/ExecutionStep";
import { Script, ScriptFilter, Tag } from "../scripts/Script";
export interface LoopBehavior {
    cleanupAfterLoop?: boolean;
}
export declare class ScriptProcessor<T, E = {}> {
    private scripts;
    private scriptMap?;
    private external;
    private actionConversionMap;
    constructor(scripts: Script<T>[], external?: {}, actionConversionMap?: ActionConvertorList);
    private fetchScripts;
    private createLoopCleanup;
    getSteps(filter: ScriptFilter): Promise<ExecutionStep[]>;
    runByName(name: string): Promise<() => void>;
    runByTags(tags: Tag[]): Promise<() => void>;
    private loopWithFilter;
    loopByName(name: string, behavior?: LoopBehavior): Promise<() => void>;
    loopByTags(tags: string[], behavior?: LoopBehavior): Promise<() => void>;
}
