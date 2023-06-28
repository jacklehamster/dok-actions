import { ArrayResolution } from "./ArrayResolution";
import { BooleanResolution } from "./BooleanResolution";
import { MapResolution } from "./MapResolution";
import { NullResolution } from "./NullResolution";
import { NumberResolution } from "./NumberResolution";
import { StringResolution } from "./StringResolution";
import { TypedArrayResolution } from "./TypedArrayResolution";

export type Resolution = NumberResolution | StringResolution | TypedArrayResolution | ArrayResolution | BooleanResolution | MapResolution | NullResolution;