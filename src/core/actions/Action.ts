//  Action
//  Action[]
//  ExecuteScriptAction
//  

import { ActionsAction } from "./ActionsAction";
import { LogAction } from "./LogAction";
import { ScriptAction } from "./ScriptAction";

export type Action = {
    [key: string]: any;
}

export type DokAction = Action & ScriptAction & LogAction & ActionsAction;