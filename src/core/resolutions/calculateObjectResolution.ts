import { ValueOf } from "../types/ValueOf";
import { calculateResolution } from "./calculate";
import { ObjectResolution } from "./ObjectResolution";

export function calculateObject(value: ObjectResolution): ValueOf<any | undefined> {
    const subject = calculateResolution(value.subject);
    const access = (value.access ?? []).map(key => calculateResolution(key));

    return {
        valueOf(parameters) {
            let node = subject?.valueOf(parameters);
            const keys = access.map(key => key?.valueOf(parameters));
            for (let key of keys) {
                if (Array.isArray(node)) {
                    if (typeof key === "number") {
                        node = node?.[key];
                    } else {
                        return undefined;
                    }
                } else if (typeof key === "string" && typeof(node) === "object") {
                    node = (node as Record<string, any>)?.[key];
                } else {
                    return undefined;
                }
            }
            return node;
        },
    };
}