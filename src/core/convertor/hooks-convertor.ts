import { HookAction } from "../actions/HookAction";
import { ExecutionStep } from "../execution/ExecutionStep";
import { StringResolution } from "../resolutions/StringResolution";
import { calculateString } from "../resolutions/calculateString";
import { ValueOf } from "../types/ValueOf";
import { ConvertBehavior, Utils } from "./Convertor";

export async function convertHooksProperty<T>(
        action: HookAction & T,
        results: ExecutionStep[],
        _: Utils<T & HookAction>,
        external: Record<string, any>): Promise<ConvertBehavior|void> {
    if (!action.hooks) {
        return;
    }
    const { hooks } = action;

    const hooksResolution: StringResolution[] = hooks;
    const hooksValueOf: ValueOf<string>[] = hooksResolution.map(hook => calculateString(hook));

    results.push((parameters) => {
        for (let hook of hooksValueOf) {
            const h = hook.valueOf(parameters);
            const x = external[h];
            if (x) {
                parameters[h] = x;
            } else {
                console.warn("Does not exist", x);
            }
        }
    });
}
