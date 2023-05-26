import { ActionsAction } from "./ActionsAction";
import { LogAction } from "./LogAction";
import { ScriptAction } from "./ScriptAction";
export declare type Action = {
    [key: string]: any;
};
export declare type DokAction = Action & ScriptAction & LogAction & ActionsAction;
