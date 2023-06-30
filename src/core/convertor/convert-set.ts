import { SetAction } from "../actions/SetAction";
import { ExecutionStep } from "../execution/ExecutionStep";
import { SupportedTypes } from "../resolutions/SupportedTypes";
import { calculateResolution } from "../resolutions/calculate";
import { calculateString } from "../resolutions/calculateString";
import { ValueOf } from "../types/ValueOf";
import { ConvertBehavior } from "./Convertor";
import { newParams, recycleParams } from "./parameter-utils";

export async function convertSetProperty(
        action: SetAction,
        results: ExecutionStep[]): Promise<ConvertBehavior|void> {
    if (!action.set) {
        return;
    }
    const { set } = action;
    const variable = calculateString(set.variable);
    const access = [variable, ...(set.access?.map(a => calculateResolution(a)) ?? [])];
    const value = calculateResolution(set.value);

    results.push((parameters)=> {
        let root: any = parameters;
        for (let i = 0; i < access.length; i++) {
            if (!root) {
                console.warn("Invalid access");
                return;
            }
            const key = access[i]?.valueOf(parameters);
            if (Array.isArray(root)) {
                if (typeof key === "number") {
                    if (i === access.length - 1) {
                        parameters.value = root[key];
                        root[key] = value?.valueOf(parameters);
                    } else {
                        root = root[key];
                    }
                } else {
                    console.warn("Invalid key for array: ", key);
                }
            } else if (typeof(root) === "object") {
                if (i === access.length - 1) {
                    parameters.value = root[key + ""];
                    root[key + ""] = value?.valueOf(parameters);
                } else {
                    root = root[key + ""];
                }
            }    
        }
    });    
}

export async function convertSetsProperty(
        action: SetAction,
        results: ExecutionStep[]): Promise<ConvertBehavior|void> {
    if (!action.sets) {
        return;
    }
    const { sets } = action;
    const setsEntries: [string, ValueOf<SupportedTypes> | undefined | null][] = !sets ? [] : Object.entries(sets).map(([key, value]) => [key, calculateResolution(value)]);

    results.push((parameters, context)=> {
        const paramCopy = newParams(parameters, context);

        for (const [key, value] of setsEntries) {
            paramCopy.value = paramCopy[key];
            parameters[key] = value?.valueOf(paramCopy);    
        }
        recycleParams(paramCopy, context);
    });    
}
