import { Resolution } from "../resolutions/Resolution";
export interface LogAction {
    log?: Resolution | (Resolution[]);
}
