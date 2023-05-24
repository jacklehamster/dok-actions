import * as math from "mathjs";
import { Context } from "../context/Context";
import { TypedArray } from "../types/TypedArray";
import { ValueOf } from "../types/ValueOf";
import { Resolution } from "./Resolution";
import { calculateTypedArray } from "./TypedArrayResolution";
import { Expression, Formula } from "./Formula";

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

export function calculateEvaluator<T>(evaluator: math.EvalFunction, context: Context | undefined, formula: Formula | Expression, defaultValue: T): T {
    const scope = context?.parameters[context.parameters.length-1];
    try {
        return evaluator.evaluate(scope ?? {}) ?? defaultValue;
    } catch (e) {
        console.error("Error: " + e + " on formula: " + formula + ", scope: ", scope);
    }
    return defaultValue;
}

export function getFormulaEvaluator(value: Formula | Expression): math.EvalFunction {
    const formula = typeof(value) === "string" ? value : value.formula;
    if (formula.charAt(0) !== "{" || formula.charAt(formula.length-1) !== "}") {
        throw new Error(`Formula: ${value} must start and end with brackets.`);
    }
    const mathEvaluator = math.parse(formula.substring(1, formula.length - 1)).compile();
    return mathEvaluator;
}

