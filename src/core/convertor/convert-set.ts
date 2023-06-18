import { SetAction } from "../actions/SetAction";
import { ExecutionStep } from "../execution/ExecutionStep";
import { calculateResolution } from "../resolutions/calculate";
import { calculateString } from "../resolutions/calculateString";
import { ConvertBehavior } from "./Convertor";

export async function convertSetProperty(
        action: SetAction,
        results: ExecutionStep[]): Promise<ConvertBehavior|void> {
    if (!action.set) {
        return;
    }
    const variable = calculateString(action.set.variable);
    const access = [variable, ...(action.set.access?.map(a => calculateResolution(a)) ?? [])];
    const value = calculateResolution(action.set.value);

    results.push((context, parameters)=> {
        let root: any = parameters;
        for (let i = 0; i < access.length; i++) {
            if (!root) {
                console.warn("Invalid access");
                return;
            }
            const key = access[i]?.valueOf(context);
            if (Array.isArray(root)) {
                if (typeof key === "number") {
                    if (i === access.length - 1) {
                        root[key] = value?.valueOf(context);
                    } else {
                        root = root[key];
                    }
                } else {
                    console.warn("Invalid key for array: ", key);
                }
            } else if (typeof(root) === "object") {
                if (i === access.length - 1) {
                    root[key + ""] = value?.valueOf(context);
                } else {
                    root = root[key + ""];
                }
            }    
        }
    });    
}
