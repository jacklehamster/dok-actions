import { ValueOf } from "../types/ValueOf";
import { calculateEvaluator, getFormulaEvaluator } from "./formula/formula-evaluator";
import { NumberResolution } from "./NumberResolution";
import { BooleanResolution } from "./BooleanResolution";
import { ExecutionParameters } from "../execution/ExecutionStep";

export function calculateBoolean(value: BooleanResolution | NumberResolution, defaultValue = false): ValueOf<boolean> {
    if (typeof(value) === "boolean" || typeof(value) === "number") {
        return !!value;
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
        valueOf(parameters: ExecutionParameters): boolean {
            return !!calculateEvaluator<boolean | number>(evaluator, parameters, value, defaultValue);
        }
    };
}
