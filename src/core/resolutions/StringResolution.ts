import { Expression, Formula } from "./Formula";

export type StringResolution = string | Formula | Expression | undefined;

export type StringEnumResolution<T> = T | Formula | Expression | undefined;