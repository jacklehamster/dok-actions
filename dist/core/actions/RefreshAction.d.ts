import { BooleanResolution } from "../resolutions/BooleanResolution";
import { NumberResolution } from "../resolutions/NumberResolution";
import { StringResolution } from "../resolutions/StringResolution";
export interface RefreshAction {
    refresh?: {
        processId?: StringResolution;
        cleanupAfterRefresh?: BooleanResolution;
        frameRate?: NumberResolution;
        stop?: BooleanResolution;
    };
}
