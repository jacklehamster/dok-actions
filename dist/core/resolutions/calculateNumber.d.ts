import { ValueOf } from "../types/ValueOf";
import { NumberResolution } from "./NumberResolution";
import { ObjectResolution } from "./ObjectResolution";
export declare function calculateNumber<T extends number = number>(value: NumberResolution<T> | ObjectResolution, defaultValue?: T | 0): ValueOf<T | 0> | number;
