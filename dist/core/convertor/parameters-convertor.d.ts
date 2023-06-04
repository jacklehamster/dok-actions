import { Convertor } from "./Convertor";
import { ExecutionParameters } from "../execution/ExecutionStep";
import { ScriptAction } from "../actions/ScriptAction";
import { Context } from "../context/Context";
import { DokAction } from "../actions/Action";
export declare function newParams(context: Context): ExecutionParameters;
export declare function recycleParams(context: Context, params: ExecutionParameters): void;
export declare const convertParametersProperty: Convertor<ScriptAction>;
export declare const convertHooksProperty: Convertor<DokAction>;
