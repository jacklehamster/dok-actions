import { PauseAction } from "../../actions/PauseAction";
import { ExecutionStep } from "../../execution/ExecutionStep";
import { ConvertBehavior, ConvertorSet, Utils } from "../Convertor";
export declare function convertDelayProperty<T>(action: PauseAction, results: ExecutionStep[], utils: Utils<T & PauseAction>, external: Record<string, any>, convertorSet: ConvertorSet): Promise<ConvertBehavior | void>;
export declare function convertPauseProperty<T>(action: PauseAction, results: ExecutionStep[], utils: Utils<T & PauseAction>, external: Record<string, any>, convertorSet: ConvertorSet): Promise<ConvertBehavior | void>;
export declare function convertLockProperty<T>(action: PauseAction, results: ExecutionStep[], utils: Utils<T & PauseAction>, external: Record<string, any>, convertorSet: ConvertorSet): Promise<ConvertBehavior | void>;
