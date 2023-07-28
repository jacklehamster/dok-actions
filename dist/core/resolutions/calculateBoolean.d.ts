import { ValueOf } from "../types/ValueOf";
import { NumberResolution } from "./NumberResolution";
import { BooleanResolution } from "./BooleanResolution";
import { ObjectResolution } from "./ObjectResolution";
export declare function calculateBoolean(value: BooleanResolution | NumberResolution | ObjectResolution, defaultValue?: boolean): ValueOf<boolean>;
