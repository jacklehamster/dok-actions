import { Context } from "../context/Context";
import { ValueOf } from "../types/ValueOf";
import { StringResolution } from "./StringResolution";
import { calculateEvaluator, getFormulaEvaluator, isFormula } from "./calculateEvaluator";

export function calculateString<T extends string = string>(value: StringResolution<T>, defaultValue = ""): ValueOf<T | string> {
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
        valueOf(context?: Context): T|string {
            return calculateEvaluator<T|string>(evaluator, context, value, defaultValue);
        }
    };

}
