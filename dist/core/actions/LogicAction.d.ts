import { BooleanResolution } from "../resolutions/BooleanResolution";
import { NumberResolution } from "../resolutions/NumberResolution";
import { DokAction } from "./Action";
export interface LogicAction {
    action: DokAction;
    loop?: NumberResolution;
    condition?: BooleanResolution;
    else?: DokAction;
}
