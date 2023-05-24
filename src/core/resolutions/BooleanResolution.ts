import { Expression, Formula } from "./Formula";
import { ValueOf } from "../types/ValueOf";
import { Context } from "../context/Context";
import { calculateEvaluator, getFormulaEvaluator } from "./calculate";

export type BooleanResolution = boolean | Formula | Expression | undefined;

export function calculateBoolean(value: BooleanResolution, defaultValue = false): ValueOf<boolean> {
    if (typeof(value) === "boolean") {
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
        valueOf(context?: Context): boolean {
            return calculateEvaluator<boolean>(evaluator, context, value, defaultValue);
        }
    };
}
