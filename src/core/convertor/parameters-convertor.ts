import { ConvertBehavior, Convertor, DEFAULT_EXTERNALS } from "./Convertor";
import { Resolution } from "../resolutions/Resolution";
import { calculateResolution } from "../resolutions/calculate";
import { ValueOf } from "../types/ValueOf";
import { ExecutionParameters, ExecutionStep, execute } from "../execution/ExecutionStep";
import { convertAction } from "./convert-action";
import { SupportedTypes } from "../resolutions/supportedTypes";

export const convertParametersProperty: Convertor = (
        action,
        results,
        getSteps,
        external = DEFAULT_EXTERNALS) => {
    const { parameters, ...subAction } = action;

    const paramResolutions: Record<string, Resolution> = (parameters ?? {});
    const paramEntries: [string, ValueOf<SupportedTypes>][] = Object.entries(paramResolutions)
        .map(([key, resolution]) => [key, calculateResolution(resolution)]);

    const subStepResults: ExecutionStep[] = [];
    convertAction(subAction, subStepResults, getSteps, external);

    results.push((context, parameters) => {
        const paramValues: ExecutionParameters = context.objectPool?.pop() ?? {};
        for (let k in parameters) {
            paramValues[k] = parameters[k];
        }
        for (let entry of paramEntries) {
            const key: string = entry[0];
            paramValues[key] = entry[1].valueOf(context);
        }

        execute(subStepResults, paramValues, context);

        for (let k in paramValues) {
            delete paramValues[k];
        }
        context.objectPool?.push(paramValues);
    });
    return ConvertBehavior.SKIP_REMAINING;
}