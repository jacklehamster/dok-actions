import { SetAction } from "../../actions/SetAction";
import { ConvertBehavior, StepScript } from "../Convertor";
export declare function convertSetProperty(action: SetAction, results: StepScript): Promise<ConvertBehavior | void>;
export declare function convertSetsProperty(action: SetAction, results: StepScript): Promise<ConvertBehavior | void>;
export declare function convertDefaultValuesProperty(action: SetAction, results: StepScript): Promise<ConvertBehavior | void>;
