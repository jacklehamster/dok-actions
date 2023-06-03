import { Expression, Formula } from "./Formula";
import { Resolution } from "./Resolution";
export declare type MapResolution = {
    [key: string]: Resolution;
} | Formula | Expression | undefined;
