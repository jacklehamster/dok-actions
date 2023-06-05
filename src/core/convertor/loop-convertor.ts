import { ExecutionStep, execute } from "../execution/ExecutionStep";
import { ConvertBehavior, Utils } from "./Convertor";
import { calculateNumber } from "../resolutions/calculateNumber";
import { ActionConvertorList, convertAction } from "./convert-action";
import { LogicAction } from "../actions/LogicAction";

export function convertLoopProperty<T>(
        action: LogicAction,
        stepResults: ExecutionStep[],
        utils: Utils<T & LogicAction>,
        external: Record<string, any>,
        actionConversionMap: ActionConvertorList): ConvertBehavior | void {
    if (action.loop === undefined) {
        return;
    }
    if (!action.loop) {
        return ConvertBehavior.SKIP_REMAINING_CONVERTORS;
    }
    const { loop, ...subAction } = action;
    const loopResolution = calculateNumber(loop, 0);
    const subStepResults: ExecutionStep[] = [];
    convertAction<LogicAction>(subAction, subStepResults, utils, external, actionConversionMap);
    stepResults.push((context, parameters) => {
        const numLoops = loopResolution.valueOf(context);
        for (let i = 0; i < numLoops; i++) {
            parameters.index = i;
            execute(subStepResults, parameters, context);
        }
    });
    return ConvertBehavior.SKIP_REMAINING_CONVERTORS;
}
