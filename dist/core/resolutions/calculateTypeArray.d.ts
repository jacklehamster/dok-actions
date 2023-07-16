import { GlType } from "../types/GlType";
import { TypedArray } from "../types/TypedArray";
import { ValueOf } from "../types/ValueOf";
import { StringResolution } from "./StringResolution";
import { TypedArrayResolution } from "./TypedArrayResolution";
export interface TypedArrayConstructor {
    new (size: number): TypedArray;
    BYTES_PER_ELEMENT: number;
}
export declare function getGlType(type: StringResolution<GlType>): ValueOf<GLenum>;
export declare function getTypedArray(type: GlType | string | undefined): TypedArrayConstructor;
export declare function getByteSize(type?: StringResolution<GlType>): ValueOf<number>;
export declare function getTypeArrayContructor(glType?: GlType | string): ValueOf<TypedArrayConstructor>;
export declare function calculateTypeArrayConstructor(glType: StringResolution<GlType>): ValueOf<TypedArrayConstructor>;
export declare function calculateTypedArray(value: TypedArrayResolution, typedArrayContructor?: ValueOf<TypedArrayConstructor>): ValueOf<TypedArray | undefined>;
