import { Context } from "../context/Context";
import { ValueOf } from "../types/ValueOf";
import { calculateResolution } from "./calculate";
import { calculateEvaluator, getFormulaEvaluator } from "./formula/formula-evaluator";
import { Expression, Formula } from "./formula/Formula";
import { MapResolution } from "./MapResolution";
import { Resolution } from "./Resolution";
import { SupportedTypes } from "./SupportedTypes";
import { hasFormula, isFormula } from "./formula/formula-utils";

export function calculateMap(value: MapResolution): ValueOf<{ [key:string]:SupportedTypes } | undefined> {
    //  check if we have any resolution to perform
    if (!hasFormula(value)) {
        const map = value as {[key: string]:SupportedTypes}
        return { valueOf: () => map };
    }
    if (isFormula(value)) {
        const formula = value as (Formula|Expression);
        const evaluator = getFormulaEvaluator(formula);
        return {
            valueOf(context?: Context): { [key:string]:SupportedTypes } | undefined {
                return calculateEvaluator<{ [key:string]:SupportedTypes } | undefined>(evaluator, context, formula, undefined);
            }
        };
    }
    const map = value as {[key: string]:Resolution}
    const evaluatorEntries = Object.entries(map).map(([key, resolution]) => [key, calculateResolution(resolution)]);

    return {
        valueOf(context?: Context): { [key:string]:SupportedTypes } | undefined {
            return Object.fromEntries(evaluatorEntries.map(([key, evalItem]) => [key, evalItem?.valueOf(context)]));
        }
    };
}