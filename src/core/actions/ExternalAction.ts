import { Resolution } from "../resolutions/Resolution";
import { StringResolution } from "../resolutions/StringResolution";

export interface ExternalAction {
    callExternal?: {
        name: StringResolution;
        arguments?: Resolution | (Resolution[]);
    };
}
