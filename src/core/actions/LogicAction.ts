import { ArrayResolution } from "../resolutions/ArrayResolution";
import { BooleanResolution } from "../resolutions/BooleanResolution";
import { NumberResolution } from "../resolutions/NumberResolution";

export interface LogicAction {
    loop?: NumberResolution | NumberResolution[];
    condition?: BooleanResolution | NumberResolution;
    whileCondition?: BooleanResolution | BooleanResolution;
    loopEach?: ArrayResolution;
}
