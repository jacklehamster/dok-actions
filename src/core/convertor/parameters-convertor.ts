import { ConvertBehavior, Utils } from "./Convertor";
import { Resolution } from "../resolutions/Resolution";
import { calculateResolution } from "../resolutions/calculate";
import { ValueOf } from "../types/ValueOf";
import { ExecutionParameters, ExecutionStep, execute } from "../execution/ExecutionStep";
import { ActionConvertorList, convertAction } from "./convert-action";
import { SupportedTypes } from "../resolutions/SupportedTypes";
import { ScriptAction } from "../actions/ScriptAction";
import { Context } from "../context/Context";
import { StringResolution } from "../resolutions/StringResolution";
import { calculateString } from "../resolutions/calculateString";
import { HookAction } from "../actions/HookAction";

function newParams(context: Context): ExecutionParameters {
    return context.objectPool?.pop() ?? {};
}

function recycleParams(context: Context, params: ExecutionParameters): void {
    for (let k in params) {
        delete params[k];
    }
    context.objectPool?.push(params);
}

export function convertParametersProperty<T>(
        action: ScriptAction,
        results: ExecutionStep[],
        utils: Utils<T & ScriptAction>,
        external: Record<string, any>,
        actionConversionMap: ActionConvertorList): ConvertBehavior | void {
    if (!action.parameters) {
        return;
    }
    const { parameters, ...subAction } = action;

    const paramResolutions: Record<string, Resolution> = parameters;
    const paramEntries: [string, ValueOf<SupportedTypes> | undefined][] = Object.entries(paramResolutions)
        .map(([key, resolution]) => [key, calculateResolution(resolution)]);

    const subStepResults: ExecutionStep[] = [];
    convertAction(subAction, subStepResults, utils, external, actionConversionMap);

    results.push((context, parameters) => {
        const paramValues: ExecutionParameters = newParams(context);
        for (let k in parameters) {
            paramValues[k] = parameters[k];
        }
        for (let entry of paramEntries) {
            const key: string = entry[0];
            paramValues[key] = entry[1]?.valueOf(context);
        }

        execute(subStepResults, paramValues, context);

        recycleParams(context, paramValues);
    });
    return ConvertBehavior.SKIP_REMAINING_CONVERTORS;
}

export function convertHooksProperty<T>(
        action: HookAction & T,
        results: ExecutionStep[],
        utils: Utils<T & HookAction>,
        external: Record<string, any>,
        actionConversionMap: ActionConvertorList): ConvertBehavior|void {
    if (!action.hooks) {
        return;
    }
    const { hooks, ...subAction } = action;

    const hooksResolution: StringResolution[] = hooks;
    const hooksValueOf: ValueOf<string>[] = hooksResolution.map(hook => calculateString(hook));

    const subStepResults: ExecutionStep[] = [];
    convertAction(subAction, subStepResults, utils, external, actionConversionMap);

    results.push((context, parameters) => {
        const paramValues: ExecutionParameters = newParams(context);
        for (let k in parameters) {
            paramValues[k] = parameters[k];
        }
        for (let hook of hooksValueOf) {
            const h = hook.valueOf(context);
            const x = external[h];
            if (x) {
                paramValues[h] = x;
            }
        }

        execute(subStepResults, paramValues, context);

        recycleParams(context, paramValues);
    });
    return ConvertBehavior.SKIP_REMAINING_CONVERTORS;
}
