import { ActionsAction } from "../../actions/ActionsAction";
import { ExecutionStep } from "../../execution/ExecutionStep";
import { ConvertBehavior, ConvertorSet, Utils } from "../Convertor";
import { convertAction } from "./convert-action";

export async function convertActionsProperty<T>(
        action: ActionsAction<T>,
        results: ExecutionStep[],
        utils: Utils<T & ActionsAction<T>>,
        external: Record<string, any>,
        convertorSet: ConvertorSet): Promise<ConvertBehavior | void> {
    if (!action.actions?.length) {
        return;
    }
    for (let a of action.actions) {
        await convertAction(a, results, utils, external, convertorSet);
    }
}
