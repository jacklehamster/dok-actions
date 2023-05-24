import { LogAction } from "./LogAction";
import { LogicAction } from "./LogicAction";
import { ScriptAction } from "./ScriptAction";
export declare type Action = {
    action?: string;
    [key: string]: any;
};
export declare type DokAction = LogicAction | (ScriptAction | LogAction | Action);
