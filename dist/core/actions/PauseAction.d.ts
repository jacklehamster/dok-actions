import { BooleanResolution } from "../resolutions/BooleanResolution";
import { NumberResolution } from "../resolutions/NumberResolution";
export interface PauseAction {
    delay?: NumberResolution;
    pause?: BooleanResolution | NumberResolution;
    lock?: BooleanResolution | NumberResolution;
    unlock?: BooleanResolution | NumberResolution;
}
