import { ConvertBehavior, ConvertorSet, StepScript, Utils } from "../Convertor";
import { LogicAction } from "../../actions/LogicAction";
export declare function convertConditionProperty<T>(action: LogicAction, results: StepScript, utils: Utils<T & LogicAction>, external: Record<string, any>, convertorSet: ConvertorSet): Promise<ConvertBehavior | void>;
