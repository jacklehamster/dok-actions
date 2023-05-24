import { Resolution } from "../resolutions/Resolution";
import { Action } from "./Action";

export interface LogAction extends Action {
    action: "log";
    messages: Resolution[];
}