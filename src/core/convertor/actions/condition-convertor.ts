import { ConvertBehavior, ConvertorSet, StepScript, Utils } from "../Convertor";
import { execute } from "../../execution/ExecutionStep";
import { convertAction } from "./convert-action";
import { calculateBoolean } from "../../resolutions/calculateBoolean";
import { LogicAction } from "../../actions/LogicAction";

export async function convertConditionProperty<T>(
        action: LogicAction,
        results: StepScript,
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
    const subStepResults: StepScript = new StepScript();
    await convertAction(subAction, subStepResults, utils, external, convertorSet);
    results.add((parameters, context) => {
        if (conditionResolution.valueOf(parameters)) {
            execute(subStepResults, parameters, context);
        }
    });
    return ConvertBehavior.SKIP_REMAINING_CONVERTORS;        
}
