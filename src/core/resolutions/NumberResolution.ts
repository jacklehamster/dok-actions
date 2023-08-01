import { ObjectResolution } from "./ObjectResolution";
import { Formula } from "./formula/Formula";



export type NumberResolution<T extends number = number> = T | Formula | ObjectResolution | undefined;

