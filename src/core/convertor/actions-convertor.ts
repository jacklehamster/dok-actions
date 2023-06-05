import { ActionsAction } from "../actions/ActionsAction";
import { ExecutionStep } from "../execution/ExecutionStep";
import { ConvertBehavior } from "./Convertor";
import { Utils } from "./Convertor";
import { ActionConvertorList, convertAction } from "./convert-action";

export function convertActionsProperty<T>(
        action: ActionsAction<T>,
        results: ExecutionStep[],
        utils: Utils<T>,
        external: Record<string, any>,
        actionConvertorMap: ActionConvertorList): ConvertBehavior | void {
    action.actions?.forEach(action => convertAction(action, results, utils, external, actionConvertorMap));
}
