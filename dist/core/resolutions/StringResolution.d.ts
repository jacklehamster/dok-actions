import { ValueOf } from "../types/ValueOf";
import { Expression, Formula } from "./Formula";
export declare type StringResolution = string | Formula | Expression | undefined;
export declare function calculateString(value: StringResolution, defaultValue?: string): ValueOf<string>;
