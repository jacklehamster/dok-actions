import { ActionsAction } from "../../actions/ActionsAction";
import { ExecutionStep } from "../../execution/ExecutionStep";
import { ConvertBehavior, ConvertorSet, Utils } from "../Convertor";
export declare function convertActionsProperty<T>(action: ActionsAction<T>, results: ExecutionStep[], utils: Utils<T & ActionsAction<T>>, external: Record<string, any>, convertorSet: ConvertorSet): Promise<ConvertBehavior | void>;
