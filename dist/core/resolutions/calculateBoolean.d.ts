import { ValueOf } from "../types/ValueOf";
import { NumberResolution } from "./NumberResolution";
import { BooleanResolution } from "./BooleanResolution";
export declare function calculateBoolean(value: BooleanResolution | NumberResolution, defaultValue?: boolean): ValueOf<boolean>;
