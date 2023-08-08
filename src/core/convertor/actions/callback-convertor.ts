import { ActionsAction } from "../../actions/ActionsAction";
import { CallbackAction } from "../../actions/CallbackAction";
import { Context } from "../../context/Context";
import { ExecutionParameters, execute } from "../../execution/ExecutionStep";
import { calculateString } from "../../resolutions/calculateString";
import { ConvertBehavior, ConvertorSet, StepScript, Utils } from "../Convertor";
import { convertActions } from "./actions-convertor";
import { convertAction } from "./convert-action";
import { newParams, recycleParams } from "./parameter-utils";

export async function convertCallbackProperty<T>(
        action: CallbackAction<T>,
        results: StepScript,
        utils: Utils<T & CallbackAction<T>>,
        external: Record<string, any>,
        convertorSet: ConvertorSet): Promise<ConvertBehavior | void> {
    if (!action.callback) {
        return;
    }
    const { callback, ...subAction } = action;

    const callbackParameters: Record<string, ExecutionParameters | undefined> = {};
    const executeCallback: Utils<T & CallbackAction<T>>["executeCallback"] = { ...utils.executeCallback};
    for (const key in callback) {
        const callbackSteps: StepScript = new StepScript();
        await convertActions(callback[key], callbackSteps, {...utils, executeCallback}, external, convertorSet);

        const onCallback = callbackSteps.getSteps().length ? (context?: Context, additionalParameters?: ExecutionParameters) => { 
            const p = callbackParameters[key];
            if (additionalParameters) {
                if (p) {
                    for (let k in additionalParameters) {
                        p[k] = additionalParameters[k];
                    }    
                }
            }
            execute(callbackSteps, p, context);
            for (let i in p) {
                delete p[i];
            }
            if (p && context) {
                recycleParams(p, context);
                callbackParameters[key] = undefined;  
            }
        } : () => {};
        executeCallback[key] = onCallback;
    }

    const subStepResults: StepScript = new StepScript();
    await convertAction(subAction, subStepResults, { ...utils, executeCallback }, external, convertorSet);
    results.add((parameters, context) => {
        for (const key in callback) {
            callbackParameters[key] = newParams(parameters, context);
        }
        execute(subStepResults, parameters, context);
    });
    return ConvertBehavior.SKIP_REMAINING_CONVERTORS;
}

export async function convertExecuteCallbackProperty<T>(
        action: CallbackAction<T>,
        results: StepScript,
        utils: Utils<T & ActionsAction<T>>): Promise<ConvertBehavior | void> {
    if (!action.executeCallback) {
        return;
    }
    const { executeCallback } = action;

    const callbackToExecute = calculateString(executeCallback);
    results.add((parameters, context) => {
        const callbackName = callbackToExecute.valueOf(parameters);
        utils.executeCallback?.[callbackName]?.(context, parameters);
    });
}