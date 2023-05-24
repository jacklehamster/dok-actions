import { TypedArray } from "../types/TypedArray";
import { ValueOf } from "../types/ValueOf";
import { Expression, Formula } from "./Formula";
import { NumberResolution } from "./NumberResolution";
export declare type TypedArrayResolution = TypedArray | NumberResolution[] | Formula | Expression;
interface TypedArrayConstructor {
    new (size: number): TypedArray;
    BYTES_PER_ELEMENT: number;
}
export declare function calculateTypedArray(value: TypedArrayResolution, ArrayConstructor?: TypedArrayConstructor, defaultNumberValue?: number): ValueOf<TypedArray>;
export {};
