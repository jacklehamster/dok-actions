import { ConvertBehavior, Utils } from "./Convertor";
import { ExecutionParameters, ExecutionStep } from "../execution/ExecutionStep";
import { ActionConvertorList } from "./convert-action";
import { ScriptAction } from "../actions/ScriptAction";
import { Context } from "../context/Context";
import { HookAction } from "../actions/HookAction";
export declare function newParams(context: Context): ExecutionParameters;
export declare function recycleParams(context: Context, params: ExecutionParameters): void;
export declare function convertParametersProperty<T>(action: ScriptAction, results: ExecutionStep[], utils: Utils<T & ScriptAction>, external: Record<string, any>, actionConversionMap: ActionConvertorList): Promise<ConvertBehavior | void>;
export declare function convertHooksProperty<T>(action: HookAction & T, results: ExecutionStep[], utils: Utils<T & HookAction>, external: Record<string, any>, actionConversionMap: ActionConvertorList): Promise<ConvertBehavior | void>;
