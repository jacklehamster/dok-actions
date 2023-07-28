import { ExecutionParameters } from "../execution/ExecutionStep";
import { ValueOf } from "../types/ValueOf";
import { ObjectResolution } from "./ObjectResolution";
import { StringResolution } from "./StringResolution";
import { calculateObject } from "./calculateObjectResolution";
import { calculateEvaluator, getFormulaEvaluator } from "./formula/formula-evaluator";
import { isFormula } from "./formula/formula-utils";

export function calculateString<T extends string = string>(value: StringResolution<T> | ObjectResolution, defaultValue: T|"" = ""): ValueOf<T|"">|string {
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
    if (typeof(value) === "object") {
        if (value.subject) {
            return calculateObject<T, T | "">(value as ObjectResolution, defaultValue);
        }
        throw new Error("Invalid expression. You need a subject");
    }

    const evaluator = getFormulaEvaluator(value);
    return {
        valueOf(parameters: ExecutionParameters): T|"" {
            return calculateEvaluator<T|"">(evaluator, parameters, value, defaultValue);
        }
    };

}
