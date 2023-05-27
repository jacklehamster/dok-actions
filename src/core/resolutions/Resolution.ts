import { ArrayResolution } from "./ArrayResolution";
import { NumberResolution } from "./NumberResolution";
import { StringResolution } from "./StringResolution";
import { TypedArrayResolution } from "./TypedArrayResolution";

export type Resolution = NumberResolution | StringResolution | TypedArrayResolution | ArrayResolution;