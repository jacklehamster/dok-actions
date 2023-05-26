import { ConvertBehavior, Convertor, DEFAULT_EXTERNALS } from "./Convertor";
import { Resolution } from "../resolutions/Resolution";
import { SupportedTypes, calculateResolution } from "../resolutions/calculate";
import { ValueOf } from "../types/ValueOf";
import { ExecutionStep, execute } from "../execution/ExecutionStep";
import { convertAction } from "./convert-action";

export const convertParametersProperty: Convertor = (
        action,
        results,
        getSteps,
        external = DEFAULT_EXTERNALS) => {
    const { parameters, ...subAction } = action;

    const paramResolutions: Record<string, Resolution> = (parameters ?? {});
    const paramEntries: [string, ValueOf<SupportedTypes | undefined>][] = Object.entries(paramResolutions)
        .map(([key, resolution]) => [key, calculateResolution(resolution)]);

    const subStepResults: ExecutionStep[] = [];
    convertAction(subAction, subStepResults, getSteps, external);

    results.push((context, parameters) => {
        const paramValues: Record<string, SupportedTypes | undefined> = context.objectPool?.pop() ?? {};
        for (let k in parameters) {
            paramValues[k] = parameters[k];
        }
        for (let entry of paramEntries) {
            const key: string = entry[0];
            paramValues[key] = entry[1].valueOf(context);
        }

        if (!context.parameters) {
            context.parameters = [];
        }
        context.parameters.push(paramValues);
        execute(subStepResults, paramValues, context);
        context.parameters.pop();

        for (let k in paramValues) {
            delete paramValues[k];
        }
        context.objectPool?.push(paramValues);
    });
    return ConvertBehavior.SKIP_REMAINING;
}