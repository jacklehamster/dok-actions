import { ActionsAction } from "./ActionsAction";
import { HookAction } from "./HookAction";
import { LogAction } from "./LogAction";
import { LogicAction } from "./LogicAction";
import { PauseAction } from "./PauseAction";
import { ReferenceAction } from "./ReferenceAction";
import { RefreshAction } from "./RefreshAction";
import { ScriptAction } from "./ScriptAction";
export declare type DokAction<T = {}> = ScriptAction & LogAction & ActionsAction<T> & LogicAction & PauseAction & HookAction & ReferenceAction & RefreshAction;
