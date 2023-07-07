import { ValueOf } from "../types/ValueOf";
import { Resolution } from "./Resolution";
import { calculateArray } from "./calculateArray";
import { calculateEvaluator, getFormulaEvaluator } from "./formula/formula-evaluator";
import { SupportedTypes } from "./SupportedTypes";
import { calculateMap } from "./calculateMap";
import { isFormula } from "./formula/formula-utils";
import { ExecutionParameters } from "../execution/ExecutionStep";
import { calculateObject } from "./calculateObjectResolution";
import { ObjectResolution } from "./ObjectResolution";

export function calculateResolution(value: Resolution): ValueOf<SupportedTypes> | undefined | null {
    if (!value) {
        return {
            valueOf() {
                return value;
            }
        };
    }
    if (value instanceof Float32Array || value instanceof Int8Array || value instanceof Uint8Array
        || value instanceof Int16Array || value instanceof Uint16Array
        || value instanceof Int32Array || value instanceof Uint32Array) {
        return value;
    }
    if (typeof(value) === "number" || typeof(value) === "boolean") {
        return value;
    }
    if (typeof(value) === "string" && !isFormula(value)) {
        return value;
    }
    if (Array.isArray(value)) {
        return calculateArray(value);
    }
    if (typeof(value) === "object") {
        if (value.subject) {
            return calculateObject(value as ObjectResolution);
        }
        return calculateMap(value);
    }
    const evaluator = getFormulaEvaluator(value);
    return {
        valueOf(parameters: ExecutionParameters = {}): SupportedTypes {
            return calculateEvaluator<SupportedTypes>(evaluator, parameters, value, undefined);
        }
    };
}
