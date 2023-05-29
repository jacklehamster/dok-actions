import { ValueOf } from "../types/ValueOf";
import { StringEnumResolution, StringResolution } from "./StringResolution";
export declare function calculateString(value: StringResolution | StringEnumResolution<any>, defaultValue?: string): ValueOf<string>;
