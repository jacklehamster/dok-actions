import { Context } from "../context/Context";
import { TypedArray } from "../types/TypedArray";
import { ValueOf } from "../types/ValueOf";
import { calculateNumber } from "./calculateNumber";
import { calculateEvaluator, getFormulaEvaluator } from "./calculateEvaluator";
import { TypedArrayResolution } from "./TypedArrayResolution";

export interface TypedArrayConstructor {
    new (size: number): TypedArray;
    BYTES_PER_ELEMENT: number;
}

export function calculateTypedArray(value: TypedArrayResolution, ArrayConstructor: TypedArrayConstructor = Float32Array): ValueOf<TypedArray | undefined> {
    if (value instanceof Float32Array || value instanceof Int8Array || value instanceof Uint8Array
        || value instanceof Int16Array || value instanceof Uint16Array
        || value instanceof Int32Array || value instanceof Uint32Array) {
        return value;
    }
    if (Array.isArray(value)) {
        const array = new ArrayConstructor(value.length);
        const compiledArray = value.map(value => calculateNumber(value, 0));
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
        valueOf(context?: Context): TypedArray | undefined {
            const value = calculateEvaluator<TypedArray | number[] | undefined>(evaluator, context, formula, undefined);
            if (!value) {
                return undefined;
            }
            if (value instanceof Float32Array || value instanceof Int8Array || value instanceof Uint8Array
                || value instanceof Int16Array || value instanceof Uint16Array
                || value instanceof Int32Array || value instanceof Uint32Array) {
                return value;
            }
            if (Array.isArray(value)) {
                if (!bufferArray) {
                    bufferArray = new ArrayConstructor(value.length);
                }
                bufferArray.set(value);
                return bufferArray;
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