import { ValueOf } from "../types/ValueOf";
import { NumberResolution } from "./NumberResolution";
export declare function calculateNumber<T extends number = number>(value: NumberResolution<T>, defaultValue?: number): ValueOf<T | number>;
