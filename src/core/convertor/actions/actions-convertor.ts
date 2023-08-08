import { ActionList, ActionsAction } from "../../actions/ActionsAction";
import { ConvertBehavior, ConvertorSet, StepScript, Utils } from "../Convertor";
import { convertAction } from "./convert-action";

export async function convertActions<T>(
        actions: ActionList<T>,
        results: StepScript,
        utils: Utils<T & ActionsAction<T>>,
        external: Record<string, any>,
        convertorSet: ConvertorSet) {
    for (let a of actions) {
        if (Array.isArray(a)) {
            await convertActions(a, results, utils, external, convertorSet);
        } else {
            await convertAction(a, results, utils, external, convertorSet);
        }
    }
}

export async function convertActionsProperty<T>(
        action: ActionsAction<T>,
        results: StepScript,
        utils: Utils<T & ActionsAction<T>>,
        external: Record<string, any>,
        convertorSet: ConvertorSet): Promise<ConvertBehavior | void> {
    if (!action.actions?.length) {
        return;
    }
    await convertActions(action.actions, results, utils, external, convertorSet);
}
