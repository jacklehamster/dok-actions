import { Resolution } from "../resolutions/Resolution";
import { Tag } from "../scripts/Script";
export interface ScriptAction {
    script?: string;
    scriptTags?: Tag[];
    parameters?: Record<string, Resolution>;
}
