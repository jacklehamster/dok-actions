import { ConvertBehavior, Utils } from "./Convertor";
import { ExecutionStep } from "../execution/ExecutionStep";
import { ActionConvertorList } from "./convert-action";
import { LogicAction } from "../actions/LogicAction";
export declare function convertConditionProperty<T>(action: LogicAction, results: ExecutionStep[], utils: Utils<T & LogicAction>, external: Record<string, any>, actionConversionMap: ActionConvertorList): Promise<ConvertBehavior | void>;
