import * as math from "mathjs";
import { Expression, FORMULA_SEPERATORS, Formula } from "./Formula";
import { getInnerFormula, isFormula, isSimpleInnerFormula } from "./formula-utils";
import { ExecutionParameters } from "../../execution/ExecutionStep";

export function calculateEvaluator<T>(evaluator: math.EvalFunction, parameters: ExecutionParameters = {}, formula: Formula | Expression, defaultValue: T): T {
    const scope = parameters;
    try {
        return evaluator.evaluate(scope ?? {}) ?? defaultValue;
    } catch (e) {
        console.error("Error: " + e + " on formula: " + formula + ", scope: ", JSON.parse(JSON.stringify(scope)));
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
    return mathEvaluator;
}

