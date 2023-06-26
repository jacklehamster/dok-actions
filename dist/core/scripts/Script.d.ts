import { DokAction } from "../actions/Action";
export declare type Tag = string | [string, string | number | boolean];
export interface Script<T> {
    name?: string;
    actions: (T & DokAction<T>)[];
    tags?: Tag[];
}
export interface ScriptFilter {
    name?: string | string[];
    tags?: Tag[];
}
export declare function filterScripts<T>(scripts: Script<T>[], filter: ScriptFilter): Script<T>[];
