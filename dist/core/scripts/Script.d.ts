import { Resolution } from "../resolutions/Resolution";
export declare type Tag = string | [string, string | number | boolean];
export interface Script<T> {
    name?: string;
    parameters?: (string | [string, Resolution])[];
    actions: T[];
    tags?: Tag[];
}
export interface ScriptFilter {
    name?: string | string[];
    tags?: Tag[];
}
export declare function filterScripts<T>(scripts: Script<T>[], filter: ScriptFilter): Script<T>[];
