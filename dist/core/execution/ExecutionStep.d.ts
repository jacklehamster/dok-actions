import { Context } from "../context/Context";
import { StepScript } from "../convertor/Convertor";
import { SupportedTypes } from "../resolutions/SupportedTypes";
export declare type ExecutionParameters = Record<string, SupportedTypes | any>;
export declare type ExecutionStep = (parameters: ExecutionParameters, context: Context) => void;
export declare function execute(steps: StepScript, parameters?: ExecutionParameters, context?: Context): void;
