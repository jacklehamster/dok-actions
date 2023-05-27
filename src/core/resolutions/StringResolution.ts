import { Context } from "../context/Context";
import { ValueOf } from "../types/ValueOf";
import { Expression, Formula } from "./Formula";
import { calculateEvaluator, getFormulaEvaluator, isFormula } from "./calculateEvaluator";

export type StringResolution = string | Formula | Expression | undefined;

export function calculateString(value: StringResolution, defaultValue = ""): ValueOf<string> {
    if (typeof(value) === "string" && !isFormula(value)) {
        return value;
    }
    if (value === undefined) {
        return {
            valueOf() {
                return defaultValue;
            }
        };
    }
    const evaluator = getFormulaEvaluator(value);
    return {
        valueOf(context?: Context): string {
            return calculateEvaluator<string>(evaluator, context, value, defaultValue);
        }
    };

}
