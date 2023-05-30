import { TypedArray } from "../types/TypedArray";
import { Expression, Formula } from "./Formula";
import { NumberResolution } from "./NumberResolution";

export type TypedArrayResolution = TypedArray | NumberResolution[] | Formula | Expression;
