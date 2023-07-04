import { ExecutionStep } from "../../execution/ExecutionStep";
import { ConvertBehavior, ConvertorSet, Utils } from "../Convertor";
import { LogicAction } from "../../actions/LogicAction";
export declare function convertLoopProperty<T>(action: T & LogicAction, stepResults: ExecutionStep[], utils: Utils<T & LogicAction>, external: Record<string, any>, convertorSet: ConvertorSet): Promise<ConvertBehavior | void>;
export declare function convertWhileProperty<T>(action: T & LogicAction, stepResults: ExecutionStep[], utils: Utils<T & LogicAction>, external: Record<string, any>, convertorSet: ConvertorSet): Promise<ConvertBehavior | void>;
export declare function convertLoopEachProperty<T>(action: T & LogicAction, stepResults: ExecutionStep[], utils: Utils<T & LogicAction>, external: Record<string, any>, convertorSet: ConvertorSet): Promise<ConvertBehavior | void>;
