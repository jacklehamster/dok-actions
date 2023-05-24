import { Expression, Formula } from "./Formula";
import { ValueOf } from "../types/ValueOf";
export declare type BooleanResolution = boolean | Formula | Expression | undefined;
export declare function calculateBoolean(value: BooleanResolution, defaultValue?: boolean): ValueOf<boolean>;
