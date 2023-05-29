import { Expression, Formula } from "./Formula";



export type NumberResolution<T extends number = number> = T | Formula | Expression | undefined;

