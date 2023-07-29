import { ActionList } from "../actions/ActionsAction";
export declare type Tag = string | [string, string | number | boolean];
export interface Script<T> {
    name?: string;
    actions?: ActionList<T>;
    scripts?: Script<T>[];
    tags?: Tag[];
}
export interface ScriptFilter {
    name?: string | string[];
    tags?: Tag[];
}
export declare function filterScripts<T>(scripts: Script<T>[], filter: ScriptFilter): Script<T>[];
