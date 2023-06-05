import { ConvertBehavior, Utils } from "./Convertor";
import { ExecutionStep, execute } from "../execution/ExecutionStep";
import { ActionConvertorList, convertAction } from "./convert-action";
import { calculateBoolean } from "../resolutions/calculateBoolean";
import { LogicAction } from "../actions/LogicAction";

export function convertConditionProperty<T>(
        action: LogicAction,
        results: ExecutionStep[],
        utils: Utils<T & LogicAction>,
        external: Record<string, any>,
        actionConversionMap: ActionConvertorList): ConvertBehavior | void {
    if (action.condition === undefined) {
        return;
    }
    if (!action.condition) {
        return ConvertBehavior.SKIP_REMAINING_CONVERTORS;
    }
    const { condition, ...subAction } = action;
    const conditionResolution = calculateBoolean(condition);
    const subStepResults: ExecutionStep[] = [];
    convertAction(subAction, subStepResults, utils, external, actionConversionMap);
    results.push((context, parameters) => {
        if (conditionResolution.valueOf(context)) {
            execute(subStepResults, parameters, context);
        }
    });
    return ConvertBehavior.SKIP_REMAINING_CONVERTORS;        
}
