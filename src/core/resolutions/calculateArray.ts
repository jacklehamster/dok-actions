import { Context } from "../context/Context";
import { ValueOf } from "../types/ValueOf";
import { ArrayResolution } from "./ArrayResolution";
import { calculateResolution } from "./calculate";
import { calculateEvaluator, getFormulaEvaluator } from "./formula/formula-evaluator";
import { Expression, Formula } from "./formula/Formula";
import { Resolution } from "./Resolution";
import { SupportedTypes } from "./SupportedTypes";
import { hasFormula, isFormula } from "./formula/formula-utils";

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