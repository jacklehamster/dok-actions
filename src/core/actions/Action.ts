//  Action
//  Action[]
//  ExecuteScriptAction
//  

import { LogAction } from "./LogAction";
import { LogicAction } from "./LogicAction";
import { ScriptAction } from "./ScriptAction";

export type Action = {
    action?: string;
    [key: string]: any;
}

export type DokAction = LogicAction | (ScriptAction | LogAction | Action);