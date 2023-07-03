import { ConvertBehavior, Utils } from "./Convertor";
import { ExecutionStep } from "../execution/ExecutionStep";
import { ActionConvertorList } from "./convert-action";
import { ScriptAction } from "../actions/ScriptAction";
export declare function convertParametersProperty<T>(action: ScriptAction, results: ExecutionStep[], utils: Utils<T & ScriptAction>, external: Record<string, any>, actionConversionMap: ActionConvertorList): Promise<ConvertBehavior | void>;
