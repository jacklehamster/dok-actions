import { Context } from "../context/Context";
import { ValueOf } from "../types/ValueOf";
import { calculateResolution } from "./calculate";
import { calculateEvaluator, getFormulaEvaluator, hasFormula, isFormula } from "./calculateEvaluator";
import { Expression, Formula } from "./Formula";
import { MapResolution } from "./MapResolution";
import { SupportedTypes } from "./SupportedTypes";

export function calculateMap(value: MapResolution): ValueOf<SupportedTypes> {
    //  check if we have any resolution to perform
    if (!hasFormula(value)) {
        return { valueOf: () => value };
    }
    if (isFormula(value)) {
        const formula = value as (Formula|Expression);
        const evaluator = getFormulaEvaluator(formula);
        return {
            valueOf(context?: Context): string | number | undefined {
                return calculateEvaluator<string | number | undefined>(evaluator, context, formula, undefined);
            }
        };
    }
    const evaluatorEntries = Object.entries(value).map(([key, resolution]) => [key, calculateResolution(resolution)]);

    return {
        valueOf(context?: Context): SupportedTypes {
            return Object.fromEntries(evaluatorEntries.map(([key, evalItem]) => [key, evalItem.valueOf(context)]));
        }
    };
}