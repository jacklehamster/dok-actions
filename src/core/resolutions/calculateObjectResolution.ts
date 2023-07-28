import { ValueOf } from "../types/ValueOf";
import { calculateResolution } from "./calculate";
import { ObjectResolution } from "./ObjectResolution";

export function calculateObject<T extends any = object, U = object | undefined>(value: ObjectResolution, defaultValue?: U): ValueOf<T | U> {
    const subject = calculateResolution(value.subject);
    const access = (value.access ?? []).map(key => calculateResolution(key));
    const formula = value.formula ? calculateResolution(value.formula) : undefined;

    return {
        valueOf(parameters) {
            let node = subject?.valueOf(parameters);
            const keys = access.map(key => key?.valueOf(parameters));
            for (let key of keys) {
                if (Array.isArray(node)) {
                    if (typeof key === "number") {
                        node = node?.[key];
                    } else {
                        node = undefined;
                        break;
                    }
                } else if (typeof key === "string" && typeof(node) === "object") {
                    node = (node as Record<string, any>)?.[key];
                } else {
                    node = undefined;
                    break;
                }
            }
            if (formula && parameters) {
                parameters.value = node;
                node = formula.valueOf(parameters);
            }
            return (node ?? defaultValue) as (T | U);
        },
    };
}