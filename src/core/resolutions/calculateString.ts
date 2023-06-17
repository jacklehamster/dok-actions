import { Context } from "../context/Context";
import { ValueOf } from "../types/ValueOf";
import { StringResolution } from "./StringResolution";
import { calculateEvaluator, getFormulaEvaluator } from "./formula/formula-evaluator";
import { isFormula } from "./formula/formula-utils";

export function calculateString<T extends string = string>(value: StringResolution<T>, defaultValue: T|"" = ""): ValueOf<T|"">|string {
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
        valueOf(context?: Context): T|"" {
            return calculateEvaluator<T|"">(evaluator, context, value, defaultValue);
        }
    };

}
