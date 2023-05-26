import { DokAction } from "../actions/Action";
import { Resolution } from "../resolutions/Resolution";

export type Tag = string|[string, string|number|boolean];

export interface Script {
    name: string;
    parameters?: (string|[string, Resolution])[];
    actions: DokAction[];
    tags?: Tag[];
}

export function getByTags(scripts: Script[], tags: Tag[]): Script[] {
    return scripts.filter(script => {
        return tags.every(tag => {
            if (typeof(tag) === "string") {
                return script.tags?.some((t) => t === tag || (Array.isArray(t) && t[0] === tag))
            } else {
                return script.tags?.some((t) => Array.isArray(t) && t[0] === tag[0] && t[1] === tag[1]);
            }
        });
    });
}

export function getScriptNamesByTags(scripts: Script[], tags: Tag[]): string[] {
    return getByTags(scripts, tags).map(({ name }) => name);
}

export function getByName(scripts: Script[], name: string | string[]): Script[] {
    return scripts.filter(script => name.includes(script.name));
}