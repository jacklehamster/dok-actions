import { Expression, Formula } from "./Formula";



export type NumberResolution = number | Formula | Expression | undefined;
export type NumberEnumResolution<T> = T | Formula | Expression | undefined;

