import { DokAction } from "../actions/Action";
import { Resolution } from "../resolutions/Resolution";

export type Tag = string|[string, string|number|boolean];

export interface Script {
    name: string;
    parameters?: (string|[string, Resolution])[];
    actions: (DokAction|Record<string, any>)[];
    tags?: Tag[];
}

export interface ScriptFilter {
    name?: string | string[];
    tags?: Tag[];
}

export function filterScripts(scripts: Script[], filter: ScriptFilter): Script[] {
    return scripts.filter(({name, tags}) => {
        const namesToFilter = !filter.name ? undefined : Array.isArray(filter.name) ? filter.name : [filter.name];
        if (namesToFilter?.length && namesToFilter.indexOf(name) < 0) {
            return false;
        }
        if (filter.tags && !filter.tags?.every(tag => {
            if (typeof(tag) === "string") {
                return tags?.some((t) => t === tag || (Array.isArray(t) && t[0] === tag))
            } else {
                return tags?.some((t) => Array.isArray(t) && t[0] === tag[0] && t[1] === tag[1]);
            }
        })) {
            return false;
        }
        return true;
    });
}
