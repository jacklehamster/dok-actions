import { ActionList, ActionsAction } from "../../actions/ActionsAction";
import { ExecutionStep } from "../../execution/ExecutionStep";
import { ConvertBehavior, ConvertorSet, Utils } from "../Convertor";
export declare function convertActions<T>(actions: ActionList<T>, results: ExecutionStep[], utils: Utils<T & ActionsAction<T>>, external: Record<string, any>, convertorSet: ConvertorSet): Promise<void>;
export declare function convertActionsProperty<T>(action: ActionsAction<T>, results: ExecutionStep[], utils: Utils<T & ActionsAction<T>>, external: Record<string, any>, convertorSet: ConvertorSet): Promise<ConvertBehavior | void>;
