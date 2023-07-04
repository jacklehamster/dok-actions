import { ConvertBehavior, ConvertorSet, Utils } from "../Convertor";
import { ExecutionStep } from "../../execution/ExecutionStep";
import { ScriptAction } from "../../actions/ScriptAction";
export declare function convertParametersProperty<T>(action: ScriptAction, results: ExecutionStep[], utils: Utils<T & ScriptAction>, external: Record<string, any>, convertorSet: ConvertorSet): Promise<ConvertBehavior | void>;
