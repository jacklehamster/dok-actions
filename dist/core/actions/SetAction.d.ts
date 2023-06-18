import { NumberResolution } from "../resolutions/NumberResolution";
import { Resolution } from "../resolutions/Resolution";
import { StringResolution } from "../resolutions/StringResolution";
export interface SetAction {
    set?: {
        variable: StringResolution;
        access?: (StringResolution | NumberResolution)[];
        value: Resolution;
    };
}