import { ActionsAction } from "../actions/ActionsAction";
import { ExecutionStep } from "../execution/ExecutionStep";
import { ConvertBehavior } from "./Convertor";
import { Utils } from "./Convertor";
import { ActionConvertorList } from "./convert-action";
export declare function convertActionsProperty<T>(action: ActionsAction<T>, results: ExecutionStep[], utils: Utils<T & ActionsAction<T>>, external: Record<string, any>, actionConvertorMap: ActionConvertorList): Promise<ConvertBehavior | void>;
