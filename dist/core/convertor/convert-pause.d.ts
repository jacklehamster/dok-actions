import { PauseAction } from "../actions/PauseAction";
import { ExecutionStep } from "../execution/ExecutionStep";
import { ConvertBehavior, Utils } from "./Convertor";
import { ActionConvertorList } from "./convert-action";
export declare function convertDelayProperty<T>(action: PauseAction, results: ExecutionStep[], utils: Utils<T & PauseAction>, external: Record<string, any>, actionConversionMap: ActionConvertorList): Promise<ConvertBehavior | void>;
export declare function convertPauseProperty<T>(action: PauseAction, results: ExecutionStep[], utils: Utils<T & PauseAction>, external: Record<string, any>, actionConversionMap: ActionConvertorList): Promise<ConvertBehavior | void>;
export declare function convertLockProperty<T>(action: PauseAction, results: ExecutionStep[], utils: Utils<T & PauseAction>, external: Record<string, any>, actionConversionMap: ActionConvertorList): Promise<ConvertBehavior | void>;
