import { ActionsAction } from "../actions/ActionsAction";
import { Convertor } from "./Convertor";
import { convertAction } from "./convert-action";

export const convertActionsProperty: Convertor<ActionsAction> = (
        action,
        results,
        getSteps,
        external) => {
    action.actions?.forEach(action => convertAction(action, results, getSteps, external));
}

