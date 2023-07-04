import { Formula } from "./formula/Formula";

export type StringResolution<T extends string = string> = T | Formula | undefined;
