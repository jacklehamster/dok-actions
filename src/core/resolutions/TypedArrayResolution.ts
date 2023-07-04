import { TypedArray } from "../types/TypedArray";
import { Formula } from "./formula/Formula";
import { NumberResolution } from "./NumberResolution";

export type TypedArrayResolution = TypedArray | NumberResolution[] | Formula;
