import { ValueOf } from "../types/ValueOf";
import { Context } from "../context/Context";
import { calculateEvaluator, getFormulaEvaluator } from "./calculateEvaluator";
import { NumberResolution } from "./NumberResolution";


export function calculateNumber<T extends number = number>(value: NumberResolution<T>, defaultValue = 0): ValueOf<T|number> {
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
        valueOf(context?: Context): T|number {
            return calculateEvaluator<T|number>(evaluator, context, value, defaultValue);
        }
    };
}
