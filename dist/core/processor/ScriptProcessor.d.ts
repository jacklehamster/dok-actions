import { ActionConvertorList } from "../convertor/convert-action";
import { ExecutionStep } from "../execution/ExecutionStep";
import { Script, ScriptFilter, Tag } from "../scripts/Script";
export interface LoopBehavior {
    cleanupAfterLoop?: boolean;
}
export declare class ScriptProcessor<T> {
    scripts: Script<T>[];
    scriptMap: Map<Script<T>, ExecutionStep[]>;
    external: Record<string, any>;
    constructor(scripts: Script<T>[], external?: Record<string, any>, actionConversionMap?: ActionConvertorList);
    private createContext;
    private createLoopCleanup;
    getSteps(filter: ScriptFilter): ExecutionStep[];
    runByName(name: string): () => void;
    runByTags(tags: Tag[]): () => void;
    private loopWithFilter;
    loopByName(name: string, behavior?: LoopBehavior): () => void;
    loopByTags(tags: string[], behavior?: LoopBehavior): () => void;
}
