import { Context } from "../context/Context";
import { ValueOf } from "../types/ValueOf";
import { Resolution } from "./Resolution";
import { calculateArray } from "./calculateArray";
import { calculateEvaluator, getFormulaEvaluator } from "./formula/formula-evaluator";
import { SupportedTypes } from "./SupportedTypes";
import { calculateMap } from "./calculateMap";
import { isFormula } from "./formula/formula-utils";

export function calculateResolution(value: Resolution): ValueOf<SupportedTypes> | undefined {
    if (value === undefined) {
        return {
            valueOf() {
                return undefined;
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
        return calculateMap(value);
    }
    const evaluator = getFormulaEvaluator(value);
    return {
        valueOf(context?: Context): string | number | undefined {
            return calculateEvaluator<string | number | undefined>(evaluator, context, value, undefined);
        }
    };
}
