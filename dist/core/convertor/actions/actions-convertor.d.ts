import { ActionList, ActionsAction } from "../../actions/ActionsAction";
import { ConvertBehavior, ConvertorSet, StepScript, Utils } from "../Convertor";
export declare function convertActions<T>(actions: ActionList<T>, results: StepScript, utils: Utils<T & ActionsAction<T>>, external: Record<string, any>, convertorSet: ConvertorSet): Promise<void>;
export declare function convertActionsProperty<T>(action: ActionsAction<T>, results: StepScript, utils: Utils<T & ActionsAction<T>>, external: Record<string, any>, convertorSet: ConvertorSet): Promise<ConvertBehavior | void>;
