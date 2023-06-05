import { ConvertBehavior, Utils } from "./Convertor";
import { ExecutionStep } from "../execution/ExecutionStep";
import { ActionConvertorList } from "./convert-action";
import { ScriptAction } from "../actions/ScriptAction";
import { HookAction } from "../actions/HookAction";
export declare function convertParametersProperty<T>(action: ScriptAction, results: ExecutionStep[], utils: Utils<T & ScriptAction>, external: Record<string, any>, actionConversionMap: ActionConvertorList): ConvertBehavior | void;
export declare function convertHooksProperty<T>(action: HookAction & T, results: ExecutionStep[], utils: Utils<T & HookAction>, external: Record<string, any>, actionConversionMap: ActionConvertorList): ConvertBehavior | void;
