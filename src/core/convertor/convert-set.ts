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
        const paramsTemp = newParams(undefined, context);

        for (const [key, value] of setsEntries) {
            parameters.value = parameters[key];
            paramsTemp[key] = value?.valueOf(parameters);    
        }
        delete parameters.value;
        for (const [key] of setsEntries) {
            parameters[key] = paramsTemp[key];
        }
        recycleParams(paramsTemp, context);
    });    
}

export async function convertDefaultValuesProperty(
    action: SetAction,
    results: ExecutionStep[]): Promise<ConvertBehavior|void> {
if (!action.defaultValues) {
    return;
}
const { defaultValues } = action;
const defaultValuesEntries: [string, ValueOf<SupportedTypes> | undefined | null][] = !defaultValues ? [] : Object.entries(defaultValues).map(([key, value]) => [key, calculateResolution(value)]);

results.push((parameters, context)=> {
    const paramsTemp = newParams(undefined, context);

    for (const [key, value] of defaultValuesEntries) {
        parameters.value = parameters[key];
        paramsTemp[key] = value?.valueOf(parameters);    
    }
    delete parameters.value;
    for (const [key] of defaultValuesEntries) {
        if (parameters[key] === undefined) {
            parameters[key] = paramsTemp[key];
        }
    }
    recycleParams(paramsTemp, context);
});    
}
