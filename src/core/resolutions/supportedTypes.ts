import { TypedArray } from "../types/TypedArray";

export type SupportedTypes = undefined | null | string | number | TypedArray | boolean | SupportedTypes[] | { [key:string]:SupportedTypes };
