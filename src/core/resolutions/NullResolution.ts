import { Formula } from "./formula/Formula";

export type NullResolution<T extends null = null> = T | Formula | null;
