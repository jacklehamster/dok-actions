import { ValueOf } from "../types/ValueOf";
import { calculateEvaluator, getFormulaEvaluator } from "./formula/formula-evaluator";
import { NumberResolution } from "./NumberResolution";
import { BooleanResolution } from "./BooleanResolution";
import { ExecutionParameters } from "../execution/ExecutionStep";
import { ObjectResolution } from "./ObjectResolution";
import { calculateObject } from "./calculateObjectResolution";

export function calculateBoolean(value: BooleanResolution | NumberResolution | ObjectResolution, defaultValue = false): ValueOf<boolean> {
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
    if (typeof(value) === "object") {
        if (value.subject) {
            return calculateObject(value as ObjectResolution);
        }
        throw new Error("Invalid expression. You need a subject");
    }

    const evaluator = getFormulaEvaluator(value);
    return {
        valueOf(parameters: ExecutionParameters): boolean {
            return !!calculateEvaluator<boolean | number>(evaluator, parameters, value, defaultValue);
        }
    };
}
