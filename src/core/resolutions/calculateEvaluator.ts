import * as math from "mathjs";
import { Context } from "../context/Context";
import { Expression, Formula } from "./Formula";


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
    const formula = typeof(value) === "string" ? value : value.formula;
    if (formula.charAt(0) !== "{" || formula.charAt(formula.length-1) !== "}") {
        throw new Error(`Formula: ${value} must start and end with brackets.`);
    }
    const mathEvaluator = math.parse(formula.substring(1, formula.length - 1)).compile();
    return mathEvaluator;
}

