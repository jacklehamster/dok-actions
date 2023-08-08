import { ConvertBehavior, ConvertorSet, StepScript, Utils } from "../Convertor";
import { ScriptAction } from "../../actions/ScriptAction";
export declare function convertParametersProperty<T>(action: ScriptAction, results: StepScript, utils: Utils<T & ScriptAction>, external: Record<string, any>, convertorSet: ConvertorSet): Promise<ConvertBehavior | void>;
