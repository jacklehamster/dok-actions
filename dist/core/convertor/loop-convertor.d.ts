import { ExecutionStep } from "../execution/ExecutionStep";
import { ConvertBehavior, Utils } from "./Convertor";
import { ActionConvertorList } from "./convert-action";
import { LogicAction } from "../actions/LogicAction";
export declare function convertLoopProperty<T>(action: LogicAction, stepResults: ExecutionStep[], utils: Utils<T & LogicAction>, external: Record<string, any>, actionConversionMap: ActionConvertorList): ConvertBehavior | void;
