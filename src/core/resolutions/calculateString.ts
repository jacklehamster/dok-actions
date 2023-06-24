import { ExecutionParameters } from "../execution/ExecutionStep";
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
        valueOf(parameters: ExecutionParameters): T|"" {
            return calculateEvaluator<T|"">(evaluator, parameters, value, defaultValue);
        }
    };

}
