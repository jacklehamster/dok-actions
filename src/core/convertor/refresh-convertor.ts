import { ExecutionStep } from "../execution/ExecutionStep";
import { ConvertBehavior, Utils } from "./Convertor";
import { calculateNumber } from "../resolutions/calculateNumber";
import { ActionConvertorList, convertAction } from "./convert-action";
import { RefreshAction } from "../actions/RefreshAction";
import { calculateBoolean } from "../resolutions/calculateBoolean";
import { calculateString } from "../resolutions/calculateString";

export async function convertRefreshProperty<T>(
        action: T & RefreshAction,
        stepResults: ExecutionStep[],
        utils: Utils<T & RefreshAction>,
        external: Record<string, any>,
        actionConversionMap: ActionConvertorList): Promise<ConvertBehavior | void> {
    if (!action.refresh) {
        return;
    }
    const { refresh, ...subAction } = action;
    const subStepResults: ExecutionStep[] = [];
    const processId = calculateString(refresh.processId, "");
    const stop = calculateBoolean(refresh.stop);
    const cleanupAfterRefresh = calculateBoolean(refresh.cleanupAfterRefresh);
    const frameRate = calculateNumber(refresh.frameRate, 60);
    await convertAction<RefreshAction>(subAction, subStepResults, utils, external, actionConversionMap);

    stepResults.push((parameters, context) => {
        if (stop.valueOf(parameters)) {
            utils.stopRefresh(processId.valueOf(parameters));
        } else {
            const cleanup = utils.refreshSteps(subStepResults, {
                cleanupAfterRefresh: cleanupAfterRefresh.valueOf(parameters),
                frameRate: frameRate.valueOf(parameters),
                parameters,
            }, processId.valueOf(parameters));
            context.cleanupActions.push(cleanup);
        }
    });
    return ConvertBehavior.SKIP_REMAINING_CONVERTORS;
}
