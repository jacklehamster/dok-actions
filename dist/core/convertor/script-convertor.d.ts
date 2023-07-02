import { ScriptAction } from "../actions/ScriptAction";
import { ExecutionStep } from "../execution/ExecutionStep";
import { ConvertBehavior, Utils } from "./Convertor";
export declare function convertScriptProperty<T>(action: ScriptAction, results: ExecutionStep[], { getSteps }: Utils<T>): Promise<ConvertBehavior | void>;
