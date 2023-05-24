import { Expression, Formula } from "./Formula";
import { ValueOf } from "../types/ValueOf";
import { Context } from "../context/Context";
import { calculateEvaluator, getFormulaEvaluator } from "./calculate";
import { NumberResolution } from "./NumberResolution";

export type BooleanResolution = boolean | Formula | Expression | undefined;

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
