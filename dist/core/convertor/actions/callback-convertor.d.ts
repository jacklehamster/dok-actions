import { ActionsAction } from "../../actions/ActionsAction";
import { CallbackAction } from "../../actions/CallbackAction";
import { ExecutionStep } from "../../execution/ExecutionStep";
import { ConvertBehavior, ConvertorSet, Utils } from "../Convertor";
export declare function convertCallbackProperty<T>(action: CallbackAction<T>, results: ExecutionStep[], utils: Utils<T & CallbackAction<T>>, external: Record<string, any>, convertorSet: ConvertorSet): Promise<ConvertBehavior | void>;
export declare function convertExecuteCallbackProperty<T>(action: CallbackAction<T>, results: ExecutionStep[], utils: Utils<T & ActionsAction<T>>): Promise<ConvertBehavior | void>;
