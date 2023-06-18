import { Context } from "../context/Context";
import { ExecutionParameters } from "../execution/ExecutionStep";
export declare function newParams(context: Context): ExecutionParameters;
export declare function recycleParams(context: Context, params: ExecutionParameters): void;
