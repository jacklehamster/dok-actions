import { Context } from "../context/Context";
import { ExecutionParameters, ExecutionStep } from "../execution/ExecutionStep";
import { Script } from "../scripts/Script";
import { ConvertBehavior, Convertor, Utils } from "./Convertor";
export declare type ActionConvertorList = Convertor<any>[];
export declare function convertAction<T>(action: T, stepResults: ExecutionStep[], utils: Utils<T>, external: Record<string, any>, actionConversionMap: ActionConvertorList): ConvertBehavior | undefined;
export declare function convertScripts<T>(scripts: Script<T>[], external: Record<string, any>, actionConversionMap: ActionConvertorList): Map<Script<T>, ExecutionStep[]>;
export declare function executeScript<T>(scriptName: string, parameters: Record<string, import("../resolutions/SupportedTypes").SupportedTypes> | undefined, scripts: Script<T>[], external: Record<string, any>, actionConversionMap: ActionConvertorList): () => void;
export declare function executeAction<T>(action: T, parameters: ExecutionParameters, context: Context, utils: Utils<T>, external: Record<string, any> | undefined, actionConversionMap: ActionConvertorList): void;
