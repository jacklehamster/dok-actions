import { Expression, Formula } from "./formula/Formula";

export type StringResolution<T extends string = string> = T | Formula | Expression | undefined;
