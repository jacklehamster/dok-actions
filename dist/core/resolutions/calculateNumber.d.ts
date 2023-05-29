import { ValueOf } from "../types/ValueOf";
import { NumberEnumResolution, NumberResolution } from "./NumberResolution";
export declare function calculateNumber(value: NumberResolution | NumberEnumResolution<any>, defaultValue?: number): ValueOf<number>;
