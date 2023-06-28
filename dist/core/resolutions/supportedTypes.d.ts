import { TypedArray } from "../types/TypedArray";
export declare type SupportedTypes = undefined | null | string | number | TypedArray | boolean | SupportedTypes[] | {
    [key: string]: SupportedTypes;
};
