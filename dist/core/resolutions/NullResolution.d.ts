import { Expression, Formula } from "./formula/Formula";
export declare type NullResolution<T extends null = null> = T | Formula | Expression | null;
