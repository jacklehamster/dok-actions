import { ValueOf } from "../types/ValueOf";
import { Context } from "../context/Context";
import { calculateEvaluator, getFormulaEvaluator } from "./formula/formula-evaluator";
import { NumberResolution } from "./NumberResolution";


export function calculateNumber<T extends number = number>(value: NumberResolution<T>, defaultValue:T|0 = 0): ValueOf<T|0>|number {
    if (typeof(value) === "number") {
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
        valueOf(context?: Context): T|0 {
            return calculateEvaluator<T|0>(evaluator, context, value, defaultValue);
        }
    };
}
