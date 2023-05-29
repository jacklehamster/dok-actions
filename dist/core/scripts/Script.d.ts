import { DokAction } from "../actions/Action";
import { Resolution } from "../resolutions/Resolution";
export declare type Tag = string | [string, string | number | boolean];
export interface Script {
    name: string;
    parameters?: (string | [string, Resolution])[];
    actions: (DokAction | Record<string, any>)[];
    tags?: Tag[];
}
export interface ScriptFilter {
    name?: string | string[];
    tags?: Tag[];
}
export declare function filterScripts(scripts: Script[], filter: ScriptFilter): Script[];
