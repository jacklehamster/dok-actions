import { ValueOf } from "../types/ValueOf";
import { Context } from "../context/Context";
import { calculateEvaluator, getFormulaEvaluator } from "./calculateEvaluator";
import { NumberResolution } from "./NumberResolution";
import { BooleanResolution } from "./BooleanResolution";

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
        valueOf(context?: Context): boolean {
            return !!calculateEvaluator<boolean | number>(evaluator, context, value, defaultValue);
        }
    };
}
