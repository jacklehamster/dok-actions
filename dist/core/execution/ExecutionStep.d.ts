import { Context } from "../context/Context";
import { SupportedTypes } from "../resolutions/SupportedTypes";
import { ScriptFilter } from "../scripts/Script";
export declare type ExecutionParameters = Record<string, SupportedTypes>;
export declare type ExecutionStep = (context: Context, parameters: ExecutionParameters) => void;
export declare type GetSteps = (filter: ScriptFilter) => ExecutionStep[];
export declare function execute(steps: ExecutionStep[], parameters?: ExecutionParameters, context?: Context): void;
