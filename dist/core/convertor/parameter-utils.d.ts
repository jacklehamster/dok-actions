import { Context } from "../context/Context";
import { ExecutionParameters } from "../execution/ExecutionStep";
export declare function newParams(parameters: ExecutionParameters, context: Context): ExecutionParameters;
export declare function recycleParams(params: ExecutionParameters, context: Context): void;
