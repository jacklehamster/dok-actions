import { ActionsAction } from "../../actions/ActionsAction";
import { CallbackAction } from "../../actions/CallbackAction";
import { ConvertBehavior, ConvertorSet, StepScript, Utils } from "../Convertor";
export declare function convertCallbackProperty<T>(action: CallbackAction<T>, results: StepScript, utils: Utils<T & CallbackAction<T>>, external: Record<string, any>, convertorSet: ConvertorSet): Promise<ConvertBehavior | void>;
export declare function convertExecuteCallbackProperty<T>(action: CallbackAction<T>, results: StepScript, utils: Utils<T & ActionsAction<T>>): Promise<ConvertBehavior | void>;
