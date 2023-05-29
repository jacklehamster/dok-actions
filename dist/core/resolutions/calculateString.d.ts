import { ValueOf } from "../types/ValueOf";
import { StringResolution } from "./StringResolution";
export declare function calculateString<T extends string = string>(value: StringResolution<T>, defaultValue?: T | ""): ValueOf<T | ""> | string;
