import { DokAction } from "../actions/Action";
import { Resolution } from "../resolutions/Resolution";
export declare type Tag = string | [string, string | number | boolean];
export interface Script {
    name: string;
    parameters?: (string | [string, Resolution])[];
    actions: DokAction[];
    tags?: Tag[];
}
export declare function getByTags(scripts: Script[], tags: Tag[]): Script[];
export declare function getScriptNamesByTags(scripts: Script[], tags: Tag[]): string[];
export declare function getByName(scripts: Script[], name: string | string[]): Script[];
