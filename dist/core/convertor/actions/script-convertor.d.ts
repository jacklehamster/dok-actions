import { ScriptAction } from "../../actions/ScriptAction";
import { ConvertBehavior, StepScript, Utils } from "../Convertor";
export declare function convertScriptProperty<T>(action: ScriptAction, results: StepScript, { getSteps }: Utils<T>): Promise<ConvertBehavior | void>;
