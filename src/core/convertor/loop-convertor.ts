import { ExecutionStep, execute } from "../execution/ExecutionStep";
import { ConvertBehavior, Convertor, DEFAULT_EXTERNALS } from "./Convertor";
import { calculateNumber } from "../resolutions/calculateNumber";
import { convertAction } from "./convert-action";
import { LogicAction } from "../actions/LogicAction";

export const convertLoopProperty: Convertor<LogicAction> = (
        action,
        stepResults: ExecutionStep[],
        getSteps,
        external = DEFAULT_EXTERNALS) => {
    if (!action.loop) {
        return ConvertBehavior.SKIP_REMAINING;
    }
    const { loop, ...subAction } = action;
    const loopResolution = calculateNumber(loop, 0);
    const subStepResults: ExecutionStep[] = [];
    convertAction(subAction, subStepResults, getSteps, external);
    stepResults.push((context, parameters) => {
        const numLoops = loopResolution.valueOf(context);
        for (let i = 0; i < numLoops; i++) {
            parameters.index = i;
            execute(subStepResults, parameters, context);
        }
    });
    return ConvertBehavior.SKIP_REMAINING;
}
