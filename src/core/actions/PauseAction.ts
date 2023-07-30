import { BooleanResolution } from "../resolutions/BooleanResolution";
import { NumberResolution } from "../resolutions/NumberResolution";
import { StringResolution } from "../resolutions/StringResolution";

export interface PauseAction {
    delay?: NumberResolution;
    pause?: BooleanResolution | NumberResolution;
    lock?: StringResolution;
    unlock?: StringResolution;
}
