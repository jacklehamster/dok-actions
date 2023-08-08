import { PauseAction } from "../../actions/PauseAction";
import { Context, ExecutionWithParams } from "../../context/Context";
import { ExecutionParameters, ExecutionStep, execute } from "../../execution/ExecutionStep";
import { calculateBoolean } from "../../resolutions/calculateBoolean";
import { calculateNumber } from "../../resolutions/calculateNumber";
import { calculateString } from "../../resolutions/calculateString";
import { ConvertBehavior, ConvertorSet, StepScript, Utils } from "../Convertor";
import { convertAction } from "./convert-action";

export async function convertDelayProperty<T>(
        action: PauseAction,
        results: StepScript,
        utils: Utils<T & PauseAction>,
        external: Record<string, any>,
        convertorSet: ConvertorSet): Promise<ConvertBehavior | void> {
    if (!action.delay) {
        return;
    }

    const { delay, ...subAction } = action;
    const delayAmount = calculateNumber(delay);
    const postStepResults: StepScript = new StepScript();
    const remainingActions = utils.getRemainingActions();
    await convertAction(subAction, postStepResults, utils, external, convertorSet);
    for (let action of remainingActions) {
        await convertAction(action, postStepResults, utils, external, convertorSet);
    }
    const performPostSteps = (context: Context, parameters: ExecutionParameters) => {
        execute(postStepResults, parameters, context);
    }

    results.add((parameters, context) => {
        const timeout = external.setTimeout(performPostSteps, delayAmount.valueOf(parameters), context, parameters);
        context.addCleanup(() => clearTimeout(timeout));
    });
    return ConvertBehavior.SKIP_REMAINING_ACTIONS;
}

export async function convertPauseProperty<T>(
        action: PauseAction,
        results: StepScript,
        utils: Utils<T & PauseAction>,
        external: Record<string, any>,
        convertorSet: ConvertorSet): Promise<ConvertBehavior | void> {
    if (!action.pause) {
        return;
    }

    const { pause, ...subAction } = action;
    const pauseResolution = calculateBoolean(pause);
    const postStepResults: StepScript = new StepScript();
    const remainingActions = utils.getRemainingActions();
    await convertAction(subAction, postStepResults, utils, external, convertorSet);
    for (let action of remainingActions) {
        await convertAction(action, postStepResults, utils, external, convertorSet);
    }

    // const step: ExecutionStep = (parameters, context) => {
    //     for (let i in parameters) {
    //         postExecution.parameters[i] = parameters[i];
    //     }
    //     if (!pauseResolution.valueOf(postExecution.parameters)) {
    //         context.deletePostAction(postExecution);
    //         execute(postStepResults, postExecution.parameters, context);
    //     } else {
    //         context.addPostAction(postExecution);
    //     }
    // };

    // const postExecution: ExecutionWithParams = {
    //     steps: [step],
    //     parameters: {},
    // };
    const step: ExecutionStep = (parameters, context) => {
        const postExecution: ExecutionWithParams = parameters.postAction ?? {
            steps: [step],
            parameters: {},
        };
        for (let i in parameters) {
            postExecution.parameters[i] = parameters[i];
        }
        if (!pauseResolution.valueOf(postExecution.parameters)) {
            context.deletePostAction(postExecution);
            execute(postStepResults, postExecution.parameters, context);
        } else {
            context.addPostAction(postExecution);
        }
    };

    results.add(step);
    return ConvertBehavior.SKIP_REMAINING_ACTIONS;
}

export async function convertLockProperty<T>(
        action: PauseAction,
        results: StepScript,
        utils: Utils<T & PauseAction>,
        external: Record<string, any>,
        convertorSet: ConvertorSet): Promise<ConvertBehavior | void> {
    if (!action.lock && !action.unlock) {
        return;
    }

    const { lock, unlock, ...subAction } = action;


    if (unlock) {
        const unlockResolution = calculateString(unlock);
        results.add((parameters, context) => {
            context.locked.delete(unlockResolution.valueOf(parameters));
        });
    }

    if (lock) {
        const lockResolution = calculateString(lock);
        const postStepResults: StepScript = new StepScript();
        const remainingActions = utils.getRemainingActions();
        await convertAction(subAction, postStepResults, utils, external, convertorSet);
        for (let action of remainingActions) {
            await convertAction(action, postStepResults, utils, external, convertorSet);
        }

        results.add((parameters, context) => {
            const lockId = lockResolution.valueOf(parameters);
            context.locked.add(lockId);
            const step: ExecutionStep = (parameters, context) => {
                for (let i in parameters) {
                    postExecution.parameters[i] = parameters[i];
                }
                if (!context.locked.size) {
                    context.deletePostAction(postExecution);
                    execute(postStepResults, parameters, context);    
                }
            };
            const postExecution: ExecutionWithParams = {
                steps: [step],
                parameters,
            };
    
            context.addPostAction(postExecution);
        });
        return ConvertBehavior.SKIP_REMAINING_ACTIONS;
    }
}