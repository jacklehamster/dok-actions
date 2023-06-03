import { Context } from "../context/Context";
import { ValueOf } from "../types/ValueOf";
import { ArrayResolution } from "./ArrayResolution";
import { calculateResolution } from "./calculate";
import { calculateEvaluator, getFormulaEvaluator, hasFormula, isFormula } from "./calculateEvaluator";
import { Expression, Formula } from "./Formula";
import { Resolution } from "./Resolution";
import { SupportedTypes } from "./SupportedTypes";

export function calculateArray(value: ArrayResolution): ValueOf<SupportedTypes> | undefined {
    //  check if we have any resolution to perform
    if (!hasFormula(value)) {
        if (!Array.isArray(value)) {
            throw new Error("value is not an array");
        }
        const array = value as SupportedTypes[];
        return { valueOf: () => array };
    }
    if (!value) {
        return undefined;
    }
    if (isFormula(value)) {
        const formula = value as (Formula|Expression);
        const evaluator = getFormulaEvaluator(formula);
        return {
            valueOf(context?: Context): SupportedTypes[] | undefined {
                return calculateEvaluator<SupportedTypes[] | undefined>(evaluator, context, formula, undefined);
            }
        };
    }
    const array = value as Resolution[]

    const evaluator = array.map(resolution => calculateResolution(resolution));

    return {
        valueOf(context?: Context): SupportedTypes {
            const value = evaluator.map(evalItem => evalItem?.valueOf(context));
            return value;
        }
    };
}