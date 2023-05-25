import { Context } from "../context/Context";
import { TypedArray } from "../types/TypedArray";
import { ValueOf } from "../types/ValueOf";
import { Resolution } from "./Resolution";
import { calculateTypedArray } from "./TypedArrayResolution";
import { calculateEvaluator, getFormulaEvaluator } from "./calculateEvaluator";

export function calculateResolution(value: Resolution): ValueOf<SupportedTypes | undefined> {
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
        return calculateTypedArray(value);
    }
    if (typeof(value) === "string" && (value.charAt(0) !== "{" || value.charAt(value.length-1) !== "}")) {
        return value;
    }
    const evaluator = getFormulaEvaluator(value);
    return {
        valueOf(context?: Context): string | number | undefined {
            return calculateEvaluator<string | number | undefined>(evaluator, context, value, undefined);
        }
    };
}


export type SupportedTypes = string | number | TypedArray;
