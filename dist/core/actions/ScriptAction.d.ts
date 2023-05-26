import { Resolution } from "../resolutions/Resolution";
export interface ScriptAction {
    script?: string;
    parameters?: Record<string, Resolution>;
}
