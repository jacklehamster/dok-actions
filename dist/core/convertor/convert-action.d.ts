import { ExecutionStep } from "../execution/ExecutionStep";
import { Script } from "../scripts/Script";
import { ConvertBehavior, Convertor } from "./Convertor";
export declare type ActionConvertorList = Convertor<any>[];
export declare const DEFAULT_CONVERTORS: ActionConvertorList;
export declare function convertAction<T>(action: T, stepResults: ExecutionStep[], getSteps: (name?: string) => ExecutionStep[], external: Record<string, any> | undefined, actionConversionMap: ActionConvertorList): ConvertBehavior | undefined;
export declare function convertScripts<T>(scripts: Script<T>[], external?: Record<string, any>, actionConversionMap?: ActionConvertorList): Map<Script<T>, ExecutionStep[]>;
export declare function executeScript<T>(scriptName: string, parameters: Record<string, import("../resolutions/SupportedTypes").SupportedTypes> | undefined, scripts: Script<T>[], external?: Record<string, any>, actionConversionMap?: ActionConvertorList): () => void;
