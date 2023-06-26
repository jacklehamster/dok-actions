import { DokAction } from "../actions/Action";

export type Tag = string|[string, string|number|boolean];

export interface Script<T> {
    name?: string;
    actions: (T & DokAction<T>)[];
    tags?: Tag[];
}

export interface ScriptFilter {
    name?: string | string[];
    tags?: Tag[];
}

function filterMatchesTags(filter: ScriptFilter, tags?: Tag[]) {
    return filter.tags?.every(tag => {
        if (typeof(tag) === "string") {
            return tags?.some((t) => t === tag || (Array.isArray(t) && t[0] === tag));
        } else {
            return tags?.some((t) => Array.isArray(t) && t[0] === tag[0] && t[1] === tag[1]);
        }
    });
}

export function filterScripts<T>(scripts: Script<T>[], filter: ScriptFilter): Script<T>[] {
    const namesToFilter = !filter.name ? undefined : Array.isArray(filter.name) ? filter.name : [filter.name];
    return scripts.filter(({name, tags}) => {
        if (namesToFilter?.length && namesToFilter.indexOf(name ?? "") < 0) {
            return false;
        }    
        if (filter.tags && !filterMatchesTags(filter, tags)) {
            return false;
        }
        return true;
    });
}
