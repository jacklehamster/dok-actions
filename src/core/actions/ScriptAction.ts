import { BooleanResolution } from "../resolutions/BooleanResolution";
import { NumberResolution } from "../resolutions/NumberResolution";
import { Resolution } from "../resolutions/Resolution";
import { Action } from "./Action";

export interface ScriptAction extends Action {
    action?: "execute-script";
    script: string;
    parameters?: Record<string, Resolution>;
    loop?: NumberResolution;
    condition?: BooleanResolution;
    else?: string;
}
