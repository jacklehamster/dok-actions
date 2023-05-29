import { Expression, Formula } from "./Formula";

export type StringResolution<T extends string = string> = T | Formula | Expression | undefined;
