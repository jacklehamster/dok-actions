import { PauseAction } from "../actions/PauseAction";
import { Context } from "../context/Context";
import { ExecutionParameters, ExecutionStep, execute } from "../execution/ExecutionStep";
import { calculateBoolean } from "../resolutions/calculateBoolean";
import { calculateNumber } from "../resolutions/calculateNumber";
import { ConvertBehavior, Convertor, DEFAULT_EXTERNALS, Utils } from "./Convertor";
import { convertAction } from "./convert-action";

export const convertDelayProperty: Convertor<PauseAction> = (
        action,
        results,
        utils: Utils<PauseAction>,
        external = DEFAULT_EXTERNALS,
        actionConversionMap) => {
    if (!action.delay) {
        return;
    }

    const { delay, ...subAction } = action;
    const delayAmount = calculateNumber(delay);
    const postStepResults: ExecutionStep[] = [];
    const remainingActions = utils.getRemainingActions();
    convertAction(subAction, postStepResults, utils, external, actionConversionMap);
    remainingActions.forEach(action => {
        convertAction(action, postStepResults, utils, external, actionConversionMap);
    });
    const performPostSteps = (context: Context, parameters: ExecutionParameters) => {
        execute(postStepResults, parameters, context);
    }

    results.push((context, parameters) => {
        const timeout = external.setTimeout(performPostSteps, delayAmount.valueOf(context), context, parameters);
        context.cleanupActions.push(() => clearTimeout(timeout));
    });
    return ConvertBehavior.SKIP_REMAINING_ACTIONS;
}

export const convertPauseProperty: Convertor<PauseAction> = (
        action,
        results,
        utils: Utils<PauseAction>,
        external = DEFAULT_EXTERNALS,
        actionConversionMap) => {
    if (!action.pause) {
        return;
    }

    const { pause, ...subAction } = action;
    const pauseResolution = calculateBoolean(pause);
    const postStepResults: ExecutionStep[] = [];
    const remainingActions = utils.getRemainingActions();
    convertAction(subAction, postStepResults, utils, external, actionConversionMap);
    remainingActions.forEach(action => {
        convertAction(action, postStepResults, utils, external, actionConversionMap);
    });

    const step: ExecutionStep = (context, parameters) => {
        if (!pauseResolution.valueOf(context)) {
            context.postActionListener.delete(step);
            execute(postStepResults, parameters, context);
        } else if (!context.postActionListener.has(step)) {
            context.postActionListener.add(step);
        }
    };

    results.push(step);
    return ConvertBehavior.SKIP_REMAINING_ACTIONS;
}

export const convertLockProperty: Convertor<PauseAction> = (
        action,
        results,
        utils: Utils<PauseAction>,
        external = DEFAULT_EXTERNALS,
        actionConversionMap) => {
    if (!action.lock && !action.unlock) {
        return;
    }

    const { lock, unlock, ...subAction } = action;


    if (unlock) {
        const unlockResolution = calculateBoolean(unlock);
        results.push((context) => {
            if (unlockResolution.valueOf(context)) {
                context.locked = false;
            }
        });
    }

    if (lock) {
        const lockResolution = calculateBoolean(lock);
        const postStepResults: ExecutionStep[] = [];
        const remainingActions = utils.getRemainingActions();
        convertAction(subAction, postStepResults, utils, external, actionConversionMap);
        remainingActions.forEach(action => {
            convertAction(action, postStepResults, utils, external, actionConversionMap);
        });

        results.push((context, parameters) => {
            if (!lockResolution.valueOf(context)) {
                execute(postStepResults, parameters, context);
            } else {
                context.locked = true;
                const step: ExecutionStep = (context, parameters) => {
                    if (!context.locked) {
                        context.postActionListener.delete(step);
                        execute(postStepResults, parameters, context);    
                    }
                };
                context.postActionListener.add(step);
            }
        });
        return ConvertBehavior.SKIP_REMAINING_ACTIONS;
    }
    return;
}