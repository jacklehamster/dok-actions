import { Context } from "../context/Context";
import { TypedArray } from "../types/TypedArray";
import { ValueOf } from "../types/ValueOf";
import { Expression, Formula } from "./Formula";
import { NumberResolution, calculateNumber } from "./NumberResolution";
import { calculateEvaluator, getFormulaEvaluator } from "./calculate";

export type TypedArrayResolution = TypedArray | NumberResolution[] | Formula | Expression;

interface TypedArrayConstructor {
    new (size: number): TypedArray;
    BYTES_PER_ELEMENT: number;
}

export function calculateTypedArray(value: TypedArrayResolution, ArrayConstructor: TypedArrayConstructor = Float32Array, defaultNumberValue = 0): ValueOf<TypedArray> {
    if (value instanceof Float32Array || value instanceof Int8Array || value instanceof Uint8Array
        || value instanceof Int16Array || value instanceof Uint16Array
        || value instanceof Int32Array || value instanceof Uint32Array) {
        return value;
    }
    if (Array.isArray(value)) {
        const array = new ArrayConstructor(value.length);
        const compiledArray = value.map(value => calculateNumber(value, defaultNumberValue));
        return {
            valueOf(context?: Context): TypedArray {
                for (let i = 0; i < compiledArray.length; i++) {
                    array[i] = compiledArray[i].valueOf(context);
                }
                return array;
            }
        };    
    }
    const formula = value;
    const evaluator = getFormulaEvaluator(formula);
    let bufferArray: TypedArray;
    return {
        valueOf(context?: Context): TypedArray {
            const value = calculateEvaluator<TypedArray | undefined>(evaluator, context, formula, undefined);
            if (value instanceof Float32Array || value instanceof Int8Array || value instanceof Uint8Array
                || value instanceof Int16Array || value instanceof Uint16Array
                || value instanceof Int32Array || value instanceof Uint32Array) {
                return value;
            }
            if (typeof(value) === "number") {
                if (!bufferArray) {
                    bufferArray = new ArrayConstructor(value / ArrayConstructor.BYTES_PER_ELEMENT);
                }
                return bufferArray;
            }
            throw new Error(`Formula ${formula} doesnt't evaluate to a TypedArray.`);
        }
    };
}