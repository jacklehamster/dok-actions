import { TypedArray } from "../types/TypedArray";
import { ValueOf } from "../types/ValueOf";
import { Resolution } from "./Resolution";
export declare function calculateResolution(value: Resolution): ValueOf<SupportedTypes | undefined>;
export declare type SupportedTypes = string | number | TypedArray;
