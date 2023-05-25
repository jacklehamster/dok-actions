import { Expression, Formula } from "./Formula";
import { ValueOf } from "../types/ValueOf";
import { NumberResolution } from "./NumberResolution";
export declare type BooleanResolution = boolean | Formula | Expression | undefined;
export declare function calculateBoolean(value: BooleanResolution | NumberResolution, defaultValue?: boolean): ValueOf<boolean>;
