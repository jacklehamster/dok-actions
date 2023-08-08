import { Context } from "../../context/Context";
import { ExecutionParameters } from "../../execution/ExecutionStep";
import { ScriptProcessorHelper } from "../../processor/ScriptProcessor";
import { Script } from "../../scripts/Script";
import { ConvertBehavior, ConvertorSet, StepScript, Utils } from "./../Convertor";
export declare function convertAction<T>(action: T, stepResults: StepScript, utils: Utils<T>, external: Record<string, any>, convertorSet: ConvertorSet): Promise<ConvertBehavior | void>;
export declare function executeScript<T>(scriptName: string, parameters: Record<string, import("../../resolutions/SupportedTypes").SupportedTypes> | undefined, scripts: Script<T>[], external: Record<string, any>, convertorSet: ConvertorSet, processorHelper: ScriptProcessorHelper): Promise<() => void>;
export declare function executeAction<T>(action: T, parameters: ExecutionParameters, context: Context, utils: Utils<T>, convertorSet: ConvertorSet): Promise<void>;
