import { ConvertBehavior, ConvertorSet, Utils } from "../Convertor";
import { ExecutionStep, execute } from "../../execution/ExecutionStep";
import { convertAction } from "./convert-action";
import { calculateBoolean } from "../../resolutions/calculateBoolean";
import { LogicAction } from "../../actions/LogicAction";

export async function convertConditionProperty<T>(
        action: LogicAction,
        results: ExecutionStep[],
        utils: Utils<T & LogicAction>,
        external: Record<string, any>,
        convertorSet: ConvertorSet): Promise<ConvertBehavior | void> {
    if (action.condition === undefined) {
        return;
    }
    if (!action.condition) {
        return ConvertBehavior.SKIP_REMAINING_CONVERTORS;
    }
    const { condition, ...subAction } = action;
    const conditionResolution = calculateBoolean(condition);
    const subStepResults: ExecutionStep[] = [];
    await convertAction(subAction, subStepResults, utils, external, convertorSet);
    results.push((parameters, context) => {
        if (conditionResolution.valueOf(parameters)) {
            execute(subStepResults, parameters, context);
        }
    });
    return ConvertBehavior.SKIP_REMAINING_CONVERTORS;        
}
