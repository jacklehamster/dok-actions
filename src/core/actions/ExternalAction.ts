import { Resolution } from "../resolutions/Resolution";
import { StringResolution } from "../resolutions/StringResolution";

export interface ExternalAction {
    callExternal?: {
        subject?: Resolution;
        method: StringResolution;
        arguments?: Resolution | (Resolution[]);
    };
}
