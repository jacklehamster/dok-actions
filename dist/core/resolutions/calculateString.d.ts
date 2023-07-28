import { ValueOf } from "../types/ValueOf";
import { ObjectResolution } from "./ObjectResolution";
import { StringResolution } from "./StringResolution";
export declare function calculateString<T extends string = string>(value: StringResolution<T> | ObjectResolution, defaultValue?: T | ""): ValueOf<T | ""> | string;
