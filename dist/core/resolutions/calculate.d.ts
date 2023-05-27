import { TypedArray } from "../types/TypedArray";
import { ValueOf } from "../types/ValueOf";
import { Resolution } from "./Resolution";
export declare function calculateResolution(value: Resolution): ValueOf<SupportedTypes>;
export declare type SupportedTypes = undefined | string | number | TypedArray | boolean | SupportedTypes[];
