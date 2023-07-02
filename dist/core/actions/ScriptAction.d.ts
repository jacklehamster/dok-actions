import { Resolution } from "../resolutions/Resolution";
export interface ScriptAction {
    executeScript?: string;
    parameters?: Record<string, Resolution>;
    defaultParameters?: Record<string, Resolution>;
}
