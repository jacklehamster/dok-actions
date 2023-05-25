import { ValueOf } from "../types/ValueOf";
import { Context } from "../context/Context";
import { calculateEvaluator, getFormulaEvaluator } from "./calculateEvaluator";
import { NumberResolution } from "./NumberResolution";


export function calculateNumber(value: NumberResolution, defaultValue = 0): ValueOf<number> {
    if (typeof (value) === "number") {
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
        valueOf(context?: Context): number {
            return calculateEvaluator<number>(evaluator, context, value, defaultValue);
        }
    };
}
