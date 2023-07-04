import { Formula } from "./formula/Formula";



export type NumberResolution<T extends number = number> = T | Formula | undefined;

