import { PauseAction } from "../../actions/PauseAction";
import { Context, ExecutionWithParams } from "../../context/Context";
import { ExecutionParameters, ExecutionStep, execute } from "../../execution/ExecutionStep";
import { calculateBoolean } from "../../resolutions/calculateBoolean";
import { calculateNumber } from "../../resolutions/calculateNumber";
import { ConvertBehavior, ConvertorSet, Utils } from "../Convertor";
import { convertAction } from "./convert-action";

export async function convertDelayProperty<T>(
        action: PauseAction,
        results: ExecutionStep[],
        utils: Utils<T & PauseAction>,
        external: Record<string, any>,
        convertorSet: ConvertorSet): Promise<ConvertBehavior | void> {
    if (!action.delay) {
        return;
    }

    const { delay, ...subAction } = action;
    const delayAmount = calculateNumber(delay);
    const postStepResults: ExecutionStep[] = [];
    const remainingActions = utils.getRemainingActions();
    await convertAction(subAction, postStepResults, utils, external, convertorSet);
    for (let action of remainingActions) {
        await convertAction(action, postStepResults, utils, external, convertorSet);
    }
    const performPostSteps = (context: Context, parameters: ExecutionParameters) => {
        execute(postStepResults, parameters, context);
    }

    results.push((parameters, context) => {
        const timeout = external.setTimeout(performPostSteps, delayAmount.valueOf(parameters), context, parameters);
        context.cleanupActions.push(() => clearTimeout(timeout));
    });
    return ConvertBehavior.SKIP_REMAINING_ACTIONS;
}

export async function convertPauseProperty<T>(
        action: PauseAction,
        results: ExecutionStep[],
        utils: Utils<T & PauseAction>,
        external: Record<string, any>,
        convertorSet: ConvertorSet): Promise<ConvertBehavior | void> {
    if (!action.pause) {
        return;
    }

    const { pause, ...subAction } = action;
    const pauseResolution = calculateBoolean(pause);
    const postStepResults: ExecutionStep[] = [];
    const remainingActions = utils.getRemainingActions();
    await convertAction(subAction, postStepResults, utils, external, convertorSet);
    for (let action of remainingActions) {
        await convertAction(action, postStepResults, utils, external, convertorSet);
    }

    const step: ExecutionStep = (parameters, context) => {
        for (let i in parameters) {
            postExecution.parameters[i] = parameters[i];
        }
        if (!pauseResolution.valueOf(postExecution.parameters)) {
            context.postActionListener.delete(postExecution);
            execute(postStepResults, postExecution.parameters, context);
        } else if (!context.postActionListener.has(postExecution)) {
            context.postActionListener.add(postExecution);
        }
    };

    const postExecution: ExecutionWithParams = {
        steps: [step],
        parameters: {},
    };

    results.push(step);
    return ConvertBehavior.SKIP_REMAINING_ACTIONS;
}

export async function convertLockProperty<T>(
        action: PauseAction,
        results: ExecutionStep[],
        utils: Utils<T & PauseAction>,
        external: Record<string, any>,
        convertorSet: ConvertorSet): Promise<ConvertBehavior | void> {
    if (!action.lock && !action.unlock) {
        return;
    }

    const { lock, unlock, ...subAction } = action;


    if (unlock) {
        const unlockResolution = calculateBoolean(unlock);
        results.push((parameters, context) => {
            if (unlockResolution.valueOf(parameters)) {
                context.locked = false;
            }
        });
    }

    if (lock) {
        const lockResolution = calculateBoolean(lock);
        const postStepResults: ExecutionStep[] = [];
        const remainingActions = utils.getRemainingActions();
        await convertAction(subAction, postStepResults, utils, external, convertorSet);
        for (let action of remainingActions) {
            await convertAction(action, postStepResults, utils, external, convertorSet);
        }

        results.push((parameters, context) => {
            if (!lockResolution.valueOf(parameters)) {
                execute(postStepResults, parameters, context);
            } else {
                context.locked = true;
                const step: ExecutionStep = (parameters, context) => {
                    for (let i in parameters) {
                        postExecution.parameters[i] = parameters[i];
                    }
                    if (!context.locked) {
                        context.postActionListener.delete(postExecution);
                        execute(postStepResults, parameters, context);    
                    }
                };
                const postExecution: ExecutionWithParams = {
                    steps: [step],
                    parameters,
                };
        
                context.postActionListener.add(postExecution);
            }
        });
        return ConvertBehavior.SKIP_REMAINING_ACTIONS;
    }
}