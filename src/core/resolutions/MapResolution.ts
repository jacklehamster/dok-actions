import { Expression, Formula } from "./formula/Formula";
import { Resolution } from "./Resolution";

export type MapResolution = {[key: string]: Resolution} | Formula | Expression | undefined;
