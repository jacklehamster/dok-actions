import { ValueOf } from "../types/ValueOf";
import { MapResolution } from "./MapResolution";
import { SupportedTypes } from "./SupportedTypes";
export declare function calculateMap(value: MapResolution): ValueOf<{
    [key: string]: SupportedTypes;
} | undefined>;
