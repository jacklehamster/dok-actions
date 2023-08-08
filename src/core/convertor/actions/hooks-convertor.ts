import { HookAction } from "../../actions/HookAction";
import { StringResolution } from "../../resolutions/StringResolution";
import { calculateString } from "../../resolutions/calculateString";
import { ValueOf } from "../../types/ValueOf";
import { ConvertBehavior, StepScript, Utils } from "../Convertor";

export async function convertHooksProperty<T>(
        action: HookAction & T,
        results: StepScript,
        _: Utils<T & HookAction>,
        external: Record<string, any>): Promise<ConvertBehavior|void> {
    if (!action.hooks) {
        return;
    }
    const { hooks } = action;

    const hooksResolution: StringResolution[] = hooks;
    const hooksValueOf: ValueOf<string>[] = hooksResolution.map(hook => calculateString(hook));

    results.add((parameters) => {
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
