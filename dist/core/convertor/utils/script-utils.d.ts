import { ExecutionStep } from "../../execution/ExecutionStep";
import { ScriptProcessorHelper } from "../../processor/ScriptProcessor";
import { Script } from "../../scripts/Script";
import { ConvertorSet } from "../Convertor";
export declare function spreadScripts<T>(scripts?: Script<T>[], results?: Script<T>[]): Script<T>[];
export declare function convertScripts<T>(scripts: Script<T>[], external: Record<string, any>, convertorSet: ConvertorSet, processorHelper: ScriptProcessorHelper): Promise<Map<Script<T>, ExecutionStep[]>>;
