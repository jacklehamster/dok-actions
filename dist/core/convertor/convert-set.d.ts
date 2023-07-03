import { SetAction } from "../actions/SetAction";
import { ExecutionStep } from "../execution/ExecutionStep";
import { ConvertBehavior } from "./Convertor";
export declare function convertSetProperty(action: SetAction, results: ExecutionStep[]): Promise<ConvertBehavior | void>;
export declare function convertSetsProperty(action: SetAction, results: ExecutionStep[]): Promise<ConvertBehavior | void>;
export declare function convertDefaultValuesProperty(action: SetAction, results: ExecutionStep[]): Promise<ConvertBehavior | void>;
