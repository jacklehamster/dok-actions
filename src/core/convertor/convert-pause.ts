import { PauseAction } from "../actions/PauseAction";
import { Context } from "../context/Context";
import { ExecutionParameters, ExecutionStep, execute } from "../execution/ExecutionStep";
import { calculateBoolean } from "../resolutions/calculateBoolean";
import { calculateNumber } from "../resolutions/calculateNumber";
import { ConvertBehavior, Utils } from "./Convertor";
import { ActionConvertorList, convertAction } from "./convert-action";

export async function convertDelayProperty<T>(
        action: PauseAction,
        results: ExecutionStep[],
        utils: Utils<T & PauseAction>,
        external: Record<string, any>,
        actionConversionMap: ActionConvertorList): Promise<ConvertBehavior | void> {
    if (!action.delay) {
        return;
    }

    const { delay, ...subAction } = action;
    const delayAmount = calculateNumber(delay);
    const postStepResults: ExecutionStep[] = [];
    const remainingActions = utils.getRemainingActions();
    await convertAction(subAction, postStepResults, utils, external, actionConversionMap);
    for (let action of remainingActions) {
        await convertAction(action, postStepResults, utils, external, actionConversionMap);
    }
    const performPostSteps = (context: Context, parameters: ExecutionParameters) => {
        execute(postStepResults, parameters, context);
    }

    results.push((context, parameters) => {
        const timeout = external.setTimeout(performPostSteps, delayAmount.valueOf(context), context, parameters);
        context.cleanupActions.push(() => clearTimeout(timeout));
    });
    return ConvertBehavior.SKIP_REMAINING_ACTIONS;
}

export async function convertPauseProperty<T>(
        action: PauseAction,
        results: ExecutionStep[],
        utils: Utils<T & PauseAction>,
        external: Record<string, any>,
        actionConversionMap: ActionConvertorList): Promise<ConvertBehavior | void> {
    if (!action.pause) {
        return;
    }

    const { pause, ...subAction } = action;
    const pauseResolution = calculateBoolean(pause);
    const postStepResults: ExecutionStep[] = [];
    const remainingActions = utils.getRemainingActions();
    await convertAction(subAction, postStepResults, utils, external, actionConversionMap);
    for (let action of remainingActions) {
        await convertAction(action, postStepResults, utils, external, actionConversionMap);
    }

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

export async function convertLockProperty<T>(
        action: PauseAction,
        results: ExecutionStep[],
        utils: Utils<T & PauseAction>,
        external: Record<string, any>,
        actionConversionMap: ActionConvertorList): Promise<ConvertBehavior | void> {
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
        await convertAction(subAction, postStepResults, utils, external, actionConversionMap);
        for (let action of remainingActions) {
            await convertAction(action, postStepResults, utils, external, actionConversionMap);
        }

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
}