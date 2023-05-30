import { Context } from "../context/Context";
import { ValueOf } from "../types/ValueOf";
import { ArrayResolution } from "./ArrayResolution";
import { Resolution } from "./Resolution";
import { calculateArray } from "./calculateArray";
import { calculateEvaluator, getFormulaEvaluator, hasFormula } from "./calculateEvaluator";
import { SupportedTypes } from "./SupportedTypes";
import { calculateTypedArray } from "./calculateTypeArray";

export function calculateResolution(value: Resolution): ValueOf<SupportedTypes> {
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
    if (typeof(value) === "number") {
        return value;
    }
    if (Array.isArray(value)) {
        if (hasFormula(value)) {
            return calculateArray(value);
        }
        const typeArrayResolution = value as Exclude<typeof value, ArrayResolution>;
        return calculateTypedArray(typeArrayResolution);
    }
    if (typeof(value) === "string" && (value.charAt(0) !== "{" || value.charAt(value.length-1) !== "}")) {
        return value;
    }
    if (Array.isArray(value)) {
        return calculateArray(value);
    }
    const evaluator = getFormulaEvaluator(value);
    return {
        valueOf(context?: Context): string | number | undefined {
            return calculateEvaluator<string | number | undefined>(evaluator, context, value, undefined);
        }
    };
}
