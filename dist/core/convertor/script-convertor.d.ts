import { ScriptAction } from "../actions/ScriptAction";
import { ExecutionStep } from "../execution/ExecutionStep";
import { ConvertBehavior, Utils } from "./Convertor";
import { ActionConvertorList } from "./convert-action";
export declare function convertScriptProperty<T>(action: ScriptAction, results: ExecutionStep[], { getSteps }: Utils<T>, _: Record<string, any>, __: ActionConvertorList): ConvertBehavior | void;
