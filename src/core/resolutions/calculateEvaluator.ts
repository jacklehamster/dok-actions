import * as math from "mathjs";
import { Context } from "../context/Context";
import { Expression, Formula } from "./Formula";
import { Resolution } from "./Resolution";

export function hasFormula(resolution: Resolution): boolean {
    if (isFormula(resolution)) {
        return true;
    }
    if (Array.isArray(resolution)) {
        return resolution.some(item => hasFormula(item));
    }
    if (typeof (resolution) === "object") {
        return hasFormula(Object.values(resolution));
    }
    return false;
}

export function isFormula(value: Formula | Expression | any) {
    if (!value) {
        return false;
    }
    if (typeof(value) !== "string" && typeof(value) !== "object") {
        return false;
    }
    const formula = typeof(value) === "string" ? value : value.formula;
    return formula?.charAt(0) === "{" && formula?.charAt(formula.length-1) === "}";
}

export function calculateEvaluator<T>(evaluator: math.EvalFunction, context: Context | undefined, formula: Formula | Expression, defaultValue: T): T {
    const scope = context?.parameters?.[context.parameters.length - 1];
    try {
        return evaluator.evaluate(scope ?? {}) ?? defaultValue;
    } catch (e) {
        console.error("Error: " + e + " on formula: " + formula + ", scope: ", scope);
    }
    return defaultValue;
}

export function getFormulaEvaluator(value: Formula | Expression): math.EvalFunction {
    if (!isFormula(value)) {
        throw new Error(`Formula: ${value} must start and end with brackets.`);
    }
    const formula = typeof(value) === "string" ? value : value.formula;
    const mathEvaluator = math.parse(formula.substring(1, formula.length - 1)).compile();
    return mathEvaluator;
}

