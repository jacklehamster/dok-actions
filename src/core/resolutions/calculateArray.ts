import { ValueOf } from "../types/ValueOf";
import { ArrayResolution } from "./ArrayResolution";
import { calculateResolution } from "./calculate";
import { calculateEvaluator, getFormulaEvaluator } from "./formula/formula-evaluator";
import { Formula } from "./formula/Formula";
import { Resolution } from "./Resolution";
import { SupportedTypes } from "./SupportedTypes";
import { hasFormula, isFormula } from "./formula/formula-utils";
import { ExecutionParameters } from "../execution/ExecutionStep";

export function calculateArray(value: ArrayResolution): ValueOf<SupportedTypes[] | undefined> | undefined {
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
        const formula = value as Formula;
        const evaluator = getFormulaEvaluator(formula);
        return {
            valueOf(parameters: ExecutionParameters): SupportedTypes[] | undefined {
                return calculateEvaluator<SupportedTypes[] | undefined>(evaluator, parameters, formula, undefined);
            }
        };
    }
    const array = value as Resolution[]

    const evaluator = array.map(resolution => calculateResolution(resolution));

    return {
        valueOf(parameters: ExecutionParameters): SupportedTypes[] {
            return evaluator.map(evalItem => evalItem?.valueOf(parameters));
        }
    };
}