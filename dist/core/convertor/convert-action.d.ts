import { DokAction } from "../actions/Action";
import { ExecutionStep } from "../execution/ExecutionStep";
import { Script } from "../scripts/Script";
import { Convertor } from "./Convertor";
export declare type ActionConvertorList = Convertor<Record<string, any>>[];
export declare const DEFAULT_CONVERTORS: ActionConvertorList;
export declare const convertAction: Convertor<DokAction>;
export declare function convertScripts(scripts: Script[], external?: Record<string, any>, actionConversionMap?: ActionConvertorList): Record<string, ExecutionStep[]>;
export declare function executeScript(scriptName: string, parameters: Record<string, import("../resolutions/supportedTypes").SupportedTypes> | undefined, scripts: Script[], external?: Record<string, any>, actionConversionMap?: ActionConvertorList): () => void;
