import { ConvertBehavior, ConvertorSet, Utils } from "../Convertor";
import { calculateResolution } from "../../resolutions/calculate";
import { ValueOf } from "../../types/ValueOf";
import { ExecutionParameters, ExecutionStep, execute } from "../../execution/ExecutionStep";
import { convertAction } from "./convert-action";
import { SupportedTypes } from "../../resolutions/SupportedTypes";
import { ScriptAction } from "../../actions/ScriptAction";
import { newParams, recycleParams } from "./parameter-utils";

export async function convertParametersProperty<T>(
        action: ScriptAction,
        results: ExecutionStep[],
        utils: Utils<T & ScriptAction>,
        external: Record<string, any>,
        convertorSet: ConvertorSet): Promise<ConvertBehavior | void> {
    if (!action.parameters) {
        return;
    }
    const { parameters, ...subAction } = action;

    const paramEntries: [string, ValueOf<SupportedTypes> | undefined | null][] = Object.entries(parameters ?? {})
        .map(([key, resolution]) => [key, calculateResolution(resolution)]);
    
    const subStepResults: ExecutionStep[] = [];
    await convertAction(subAction, subStepResults, utils, external, convertorSet);

    results.push((parameters, context) => {
        const paramValues: ExecutionParameters = newParams(undefined, context);
        for (let entry of paramEntries) {
            const key: string = entry[0];
            paramValues[key] = entry[1]?.valueOf(parameters);
        }

        execute(subStepResults, paramValues, context);

        recycleParams(paramValues, context);
    });
    return ConvertBehavior.SKIP_REMAINING_CONVERTORS;
}
