import { ConvertBehavior, Utils } from "./Convertor";
import { calculateResolution } from "../resolutions/calculate";
import { ValueOf } from "../types/ValueOf";
import { ExecutionParameters, ExecutionStep, execute } from "../execution/ExecutionStep";
import { ActionConvertorList, convertAction } from "./convert-action";
import { SupportedTypes } from "../resolutions/SupportedTypes";
import { ScriptAction } from "../actions/ScriptAction";
import { StringResolution } from "../resolutions/StringResolution";
import { calculateString } from "../resolutions/calculateString";
import { HookAction } from "../actions/HookAction";
import { newParams, recycleParams } from "./parameter-utils";

export async function convertParametersProperty<T>(
        action: ScriptAction,
        results: ExecutionStep[],
        utils: Utils<T & ScriptAction>,
        external: Record<string, any>,
        actionConversionMap: ActionConvertorList): Promise<ConvertBehavior | void> {
    if (!action.parameters && !action.defaultParameters) {
        return;
    }
    const { parameters, defaultParameters, ...subAction } = action;

    const paramEntries: [string, ValueOf<SupportedTypes> | undefined][] = Object.entries(parameters ?? {})
        .map(([key, resolution]) => [key, calculateResolution(resolution)]);

    const defaultParamEntries: [string, ValueOf<SupportedTypes> | undefined][] = Object.entries(defaultParameters ?? {})
        .map(([key, resolution]) => [key, calculateResolution(resolution)]);
    
    const subStepResults: ExecutionStep[] = [];
    await convertAction(subAction, subStepResults, utils, external, actionConversionMap);

    results.push((parameters, context) => {
        const paramValues: ExecutionParameters = newParams(parameters, context);
        for (let entry of paramEntries) {
            const key: string = entry[0];
            paramValues[key] = entry[1]?.valueOf(parameters);
        }

        for (let entry of defaultParamEntries) {
            const key: string = entry[0];
            if (paramValues[key] === undefined) {
                paramValues[key] = entry[1]?.valueOf(parameters);
            }
        }

        execute(subStepResults, paramValues, context);

        recycleParams(paramValues, context);
    });
    return ConvertBehavior.SKIP_REMAINING_CONVERTORS;
}

export async function convertHooksProperty<T>(
        action: HookAction & T,
        results: ExecutionStep[],
        utils: Utils<T & HookAction>,
        external: Record<string, any>,
        actionConversionMap: ActionConvertorList): Promise<ConvertBehavior|void> {
    if (!action.hooks) {
        return;
    }
    const { hooks, ...subAction } = action;

    const hooksResolution: StringResolution[] = hooks;
    const hooksValueOf: ValueOf<string>[] = hooksResolution.map(hook => calculateString(hook));

    const postStepResults: ExecutionStep[] = [];
    const remainingActions = utils.getRemainingActions();
    await convertAction(subAction, postStepResults, utils, external, actionConversionMap);
    for (let action of remainingActions) {
        await convertAction(action, postStepResults, utils, external, actionConversionMap);
    }

    results.push((parameters, context) => {
        const paramValues: ExecutionParameters = newParams(parameters, context);
        for (let hook of hooksValueOf) {
            const h = hook.valueOf(parameters);
            const x = external[h];
            if (x) {
                paramValues[h] = x;
            } else {
                console.warn("Does not exist", x);
            }
        }

        execute(postStepResults, paramValues, context);

        recycleParams(paramValues, context);
    });
    return ConvertBehavior.SKIP_REMAINING_ACTIONS;
}
