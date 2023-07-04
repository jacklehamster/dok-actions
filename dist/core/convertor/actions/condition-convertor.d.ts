import { ConvertBehavior, ConvertorSet, Utils } from "../Convertor";
import { ExecutionStep } from "../../execution/ExecutionStep";
import { LogicAction } from "../../actions/LogicAction";
export declare function convertConditionProperty<T>(action: LogicAction, results: ExecutionStep[], utils: Utils<T & LogicAction>, external: Record<string, any>, convertorSet: ConvertorSet): Promise<ConvertBehavior | void>;
