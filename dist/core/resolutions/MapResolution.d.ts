import { Formula } from "./formula/Formula";
import { Resolution } from "./Resolution";
export declare type MapResolution = {
    [key: string]: Resolution;
} | Formula | undefined;
