import { ExecutionStep } from "../../execution/ExecutionStep";
import { ConvertBehavior, ConvertorSet, Utils } from "../Convertor";
import { calculateNumber } from "../../resolutions/calculateNumber";
import { convertAction } from "./convert-action";
import { RefreshAction } from "../../actions/RefreshAction";
import { calculateBoolean } from "../../resolutions/calculateBoolean";
import { calculateString } from "../../resolutions/calculateString";

export const DEFAULT_REFRESH_FRAME_RATE = 1;

export async function convertRefreshProperty<T>(
        action: T & RefreshAction,
        stepResults: ExecutionStep[],
        utils: Utils<T & RefreshAction>,
        external: Record<string, any>,
        convertorSet: ConvertorSet): Promise<ConvertBehavior | void> {
    if (!action.refresh) {
        return;
    }
    const { refresh, ...subAction } = action;
    const subStepResults: ExecutionStep[] = [];
    const processIdValue = calculateString(refresh.processId, "");
    const stop = calculateBoolean(refresh.stop);
    const cleanupAfterRefresh = calculateBoolean(refresh.cleanupAfterRefresh);
    const frameRate = calculateNumber(refresh.frameRate, DEFAULT_REFRESH_FRAME_RATE);
    await convertAction<RefreshAction>(subAction, subStepResults, utils, external, convertorSet);

    stepResults.push((parameters, context) => {
        if (stop.valueOf(parameters)) {
            utils.stopRefresh(processIdValue.valueOf(parameters));
        } else {
            const {cleanup, processId} = utils.refreshSteps(subStepResults, {
                cleanupAfterRefresh: cleanupAfterRefresh.valueOf(parameters),
                frameRate: frameRate.valueOf(parameters),
                parameters,
            }, processIdValue.valueOf(parameters));
            parameters.processId = processId;
            context.cleanupActions.push(cleanup);
        }
    });
    return ConvertBehavior.SKIP_REMAINING_CONVERTORS;
}
