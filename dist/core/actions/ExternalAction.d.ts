import { Resolution } from "../resolutions/Resolution";
export interface ExternalAction {
    callExternal?: {
        method: Resolution;
        arguments?: Resolution | (Resolution[]);
    };
}
