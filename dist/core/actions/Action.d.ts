import { ActionsAction } from "./ActionsAction";
import { LogAction } from "./LogAction";
import { LogicAction } from "./LogicAction";
import { ScriptAction } from "./ScriptAction";
export declare type DokAction = ScriptAction & LogAction & ActionsAction & LogicAction;
