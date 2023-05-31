import { ConvertBehavior, Convertor, DEFAULT_EXTERNALS } from "./Convertor";
import { ExecutionStep, execute } from "../execution/ExecutionStep";
import { convertAction } from "./convert-action";
import { DokAction } from "../actions/Action";
import { calculateBoolean } from "../resolutions/calculateBoolean";

export const convertConditionProperty: Convertor<DokAction> = (
        action,
        results,
        getSteps,
        external = DEFAULT_EXTERNALS,
        actionConversionMap) => {
    if (action.condition === undefined) {
        return;
    }
    if (!action.condition) {
        return ConvertBehavior.SKIP_REMAINING;
    }
    const { condition, ...subAction } = action;
    const conditionResolution = calculateBoolean(condition);
    const subStepResults: ExecutionStep[] = [];
    convertAction(subAction, subStepResults, getSteps, external, actionConversionMap);
    results.push((context, parameters) => {
        if (conditionResolution.valueOf(context)) {
            execute(subStepResults, parameters, context);
        }
    });
    return ConvertBehavior.SKIP_REMAINING;
}
