import { Expression, Formula } from "./Formula";
import { Resolution } from "./Resolution";

export type MapResolution = {[key: string]: Resolution} | Formula | Expression | undefined;
