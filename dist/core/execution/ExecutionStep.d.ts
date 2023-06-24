import { Context } from "../context/Context";
import { SupportedTypes } from "../resolutions/SupportedTypes";
export declare type ExecutionParameters = Record<string, SupportedTypes>;
export declare type ExecutionStep = (parameters: ExecutionParameters, context: Context) => void;
export declare function execute(steps?: ExecutionStep[], parameters?: ExecutionParameters, context?: Context): void;
