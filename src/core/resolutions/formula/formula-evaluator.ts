import * as math from "mathjs";
import { Context } from "../../context/Context";
import { Expression, FORMULA_SEPERATORS, Formula } from "./Formula";
import { getInnerFormula, isFormula, isSimpleInnerFormula } from "./formula-utils";

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
        throw new Error(`Formula: ${value} must match the format: "${FORMULA_SEPERATORS[0]}formula${FORMULA_SEPERATORS[1]}".`);
    }
    const innerFormula = getInnerFormula(value);
    const mathEvaluator = math.parse(innerFormula).compile();
    if (isSimpleInnerFormula(innerFormula)) {
        return {
            evaluate(scope?: any) {
                return scope[innerFormula] ?? mathEvaluator.evaluate(scope);
            },
        };
    }
    return math.parse(innerFormula).compile();
}

