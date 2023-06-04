//  Action
//  Action[]
//  ExecuteScriptAction
//  

import { ActionsAction } from "./ActionsAction";
import { HookAction } from "./HookAction";
import { LogAction } from "./LogAction";
import { LogicAction } from "./LogicAction";
import { PauseAction } from "./PauseAction";
import { ScriptAction } from "./ScriptAction";

export type DokAction = ScriptAction & LogAction & ActionsAction & LogicAction & PauseAction & HookAction;