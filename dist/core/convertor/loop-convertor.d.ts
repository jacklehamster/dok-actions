import { ExecutionStep } from "../execution/ExecutionStep";
import { ConvertBehavior, Utils } from "./Convertor";
import { ActionConvertorList } from "./convert-action";
import { LogicAction } from "../actions/LogicAction";
export declare function convertLoopProperty<T>(action: T & LogicAction, stepResults: ExecutionStep[], utils: Utils<T & LogicAction>, external: Record<string, any>, actionConversionMap: ActionConvertorList): Promise<ConvertBehavior | void>;
export declare function convertWhileProperty<T>(action: T & LogicAction, stepResults: ExecutionStep[], utils: Utils<T & LogicAction>, external: Record<string, any>, actionConversionMap: ActionConvertorList): Promise<ConvertBehavior | void>;
export declare function convertLoopEachProperty<T>(action: T & LogicAction, stepResults: ExecutionStep[], utils: Utils<T & LogicAction>, external: Record<string, any>, actionConversionMap: ActionConvertorList): Promise<ConvertBehavior | void>;
