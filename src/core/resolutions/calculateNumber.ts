import { ValueOf } from "../types/ValueOf";
import { calculateEvaluator, getFormulaEvaluator } from "./formula/formula-evaluator";
import { NumberResolution } from "./NumberResolution";
import { ExecutionParameters } from "../execution/ExecutionStep";


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
        valueOf(parameters?: ExecutionParameters): T|0 {
            return calculateEvaluator<T|0>(evaluator, parameters, value, defaultValue);
        }
    };
}
