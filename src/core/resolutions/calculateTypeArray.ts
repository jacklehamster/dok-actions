import { ExecutionParameters } from "../execution/ExecutionStep";
import { GlType } from "../types/GlType";
import { TypedArray } from "../types/TypedArray";
import { ValueOf } from "../types/ValueOf";
import { calculateNumber } from "./calculateNumber";
import { calculateEvaluator, getFormulaEvaluator } from "./formula/formula-evaluator";
import { TypedArrayResolution } from "./TypedArrayResolution";

export interface TypedArrayConstructor {
    new (size: number): TypedArray;
    BYTES_PER_ELEMENT: number;
}

const DEFAULT_TYPED_ARRAY = {
    valueOf() {
        return Float32Array;
    }
};

export function getGlType(type: GlType | ValueOf<GlType> | string | undefined): ValueOf<GLenum> {
  if (type && typeof(type) !== "string") {
    return {
      valueOf(parameters: ExecutionParameters) {
        return getGlType(type.valueOf(parameters)).valueOf(parameters);
      }
    };
  }
  switch(type) {
    case "BYTE":
      return WebGL2RenderingContext.BYTE;
    case "FLOAT":
      return WebGL2RenderingContext.FLOAT;
    case "SHORT":
      return WebGL2RenderingContext.SHORT;
    case "UNSIGNED_BYTE":
      return WebGL2RenderingContext.UNSIGNED_BYTE;
    case "UNSIGNED_SHORT":
      return WebGL2RenderingContext.UNSIGNED_SHORT;
    case "INT":
      return WebGL2RenderingContext.INT;
    case "UNSIGNED_INT":
      return WebGL2RenderingContext.UNSIGNED_INT;
  }
  return WebGL2RenderingContext.FLOAT;  
}

export function getTypedArray(type: GlType | string | undefined): TypedArrayConstructor {
  switch(type) {
      case "BYTE":
        return Int8Array;
      case "FLOAT":
        return Float32Array;
      case "SHORT":
        return Int16Array;
      case "UNSIGNED_BYTE":
        return Uint8Array;
      case "UNSIGNED_SHORT":
        return Uint16Array;
      case "INT":
        return Int32Array;
      case "UNSIGNED_INT":
        return Uint32Array;
  }
  return Float32Array;
}

export function getByteSize(type?: GlType) {
  return getTypedArray(type).BYTES_PER_ELEMENT;
}

export function calculateTypedArray(value: TypedArrayResolution, typedArrayContructor: ValueOf<TypedArrayConstructor> = DEFAULT_TYPED_ARRAY): ValueOf<TypedArray | undefined> {
    if (value instanceof Float32Array || value instanceof Int8Array || value instanceof Uint8Array
        || value instanceof Int16Array || value instanceof Uint16Array
        || value instanceof Int32Array || value instanceof Uint32Array) {
        return value;
    }

    let ArrayConstructor: TypedArrayConstructor | undefined = undefined;
    if (Array.isArray(value)) {
        const compiledArray = value.map(value => calculateNumber(value, 0));
        return {
            valueOf(parameters: ExecutionParameters): TypedArray {
                if (!ArrayConstructor) {
                    ArrayConstructor = typedArrayContructor.valueOf(parameters);
                }
                const array = new ArrayConstructor(value.length);
                for (let i = 0; i < compiledArray.length; i++) {
                    array[i] = compiledArray[i].valueOf(parameters);
                }
                return array;
            }
        };    
    }
    const formula = value;
    const evaluator = getFormulaEvaluator(formula);
    let bufferArray: TypedArray;
    return {
        valueOf(parameters: ExecutionParameters): TypedArray | undefined {
            const value = calculateEvaluator<TypedArray | number[] | undefined>(evaluator, parameters, formula, undefined);
            if (!value) {
                return undefined;
            }
            if (value instanceof Float32Array || value instanceof Int8Array || value instanceof Uint8Array
                || value instanceof Int16Array || value instanceof Uint16Array
                || value instanceof Int32Array || value instanceof Uint32Array) {
                return value;
            }
            if (!ArrayConstructor) {
                ArrayConstructor = typedArrayContructor.valueOf(parameters);
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