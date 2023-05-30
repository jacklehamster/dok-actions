import { TypedArray } from "../types/TypedArray";
import { ValueOf } from "../types/ValueOf";
import { TypedArrayResolution } from "./TypedArrayResolution";
interface TypedArrayConstructor {
    new (size: number): TypedArray;
    BYTES_PER_ELEMENT: number;
}
export declare function calculateTypedArray(value: TypedArrayResolution, ArrayConstructor?: TypedArrayConstructor, defaultNumberValue?: number): ValueOf<TypedArray>;
export {};
