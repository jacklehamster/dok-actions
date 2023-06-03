import { TypedArray } from "../types/TypedArray";
import { ValueOf } from "../types/ValueOf";
import { TypedArrayResolution } from "./TypedArrayResolution";
export interface TypedArrayConstructor {
    new (size: number): TypedArray;
    BYTES_PER_ELEMENT: number;
}
export declare function calculateTypedArray(value: TypedArrayResolution, ArrayConstructor?: TypedArrayConstructor): ValueOf<TypedArray | undefined>;
