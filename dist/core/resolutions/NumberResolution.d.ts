import { Expression, Formula } from "./Formula";
import { ValueOf } from "../types/ValueOf";
export declare type NumberResolution = number | Formula | Expression | undefined;
export declare function calculateNumber(value: NumberResolution, defaultValue?: number): ValueOf<number>;
