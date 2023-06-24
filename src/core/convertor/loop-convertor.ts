import { ExecutionStep, execute } from "../execution/ExecutionStep";
import { ConvertBehavior, Utils } from "./Convertor";
import { calculateNumber } from "../resolutions/calculateNumber";
import { ActionConvertorList, convertAction } from "./convert-action";
import { LogicAction } from "../actions/LogicAction";

export async function convertLoopProperty<T>(
        action: T & LogicAction,
        stepResults: ExecutionStep[],
        utils: Utils<T & LogicAction>,
        external: Record<string, any>,
        actionConversionMap: ActionConvertorList): Promise<ConvertBehavior | void> {
    if (action.loop === undefined) {
        return;
    }
    if (!action.loop) {
        return ConvertBehavior.SKIP_REMAINING_CONVERTORS;
    }
    const { loop, ...subAction } = action;
    const loopResolution = calculateNumber(loop, 0);
    const subStepResults: ExecutionStep[] = [];
    await convertAction<LogicAction>(subAction, subStepResults, utils, external, actionConversionMap);
    stepResults.push((parameters, context) => {
        const numLoops = loopResolution.valueOf(parameters);
        for (let i = 0; i < numLoops; i++) {
            parameters.index = i;
            execute(subStepResults, parameters, context);
        }
    });
    return ConvertBehavior.SKIP_REMAINING_CONVERTORS;
}
