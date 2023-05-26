import { ConvertBehavior, Convertor, DEFAULT_EXTERNALS } from "./Convertor";
import { calculateBoolean } from "../resolutions/BooleanResolution";
import { ExecutionStep, execute } from "../execution/ExecutionStep";
import { convertAction } from "./convert-action";

export const convertConditionProperty: Convertor = (
        action,
        results,
        getSteps,
        external = DEFAULT_EXTERNALS) => {
    if (!action.condition) {
        return ConvertBehavior.SKIP_REMAINING;
    }
    const { condition, ...subAction } = action;
    const conditionResolution = calculateBoolean(condition);
    const subStepResults: ExecutionStep[] = [];
    convertAction(subAction, subStepResults, getSteps, external);
    results.push((context, parameters) => {
        if (conditionResolution.valueOf(context)) {
            execute(subStepResults, parameters, context);
        }
    });
    return ConvertBehavior.SKIP_REMAINING;
}
