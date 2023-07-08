import { parse } from "yaml";

export type Language = 'yaml'|'json'|string;

export function getObject(code: string, lang: 'yaml'|'json'|string) {
    return lang === 'yaml' ? parse(code) : lang === 'json' ? JSON.parse(code): {};
}
