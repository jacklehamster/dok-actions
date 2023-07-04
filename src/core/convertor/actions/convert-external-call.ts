import { ExternalAction } from "../../actions/ExternalAction";
import { ExecutionStep } from "../../execution/ExecutionStep";
import { Resolution } from "../../resolutions/Resolution";
import { calculateResolution } from "../../resolutions/calculate";
import { calculateString } from "../../resolutions/calculateString";
import { ConvertBehavior, Utils } from "../Convertor";

export async function convertExternalCallProperty<T>(
        action: ExternalAction,
        results: ExecutionStep[],
        _: Utils<T>,
        external: Record<string, any>): Promise<ConvertBehavior|void> {
    if (action.callExternal === undefined) {
        return;
    }
    const { callExternal } = action;
    const nameResolution = calculateString(callExternal.name);
    const args: Resolution[] = !callExternal.arguments ? [] : Array.isArray(callExternal.arguments) ? callExternal.arguments : [callExternal.arguments];
    const resolutions = args.map(m => calculateResolution(m));
    results.push((parameters)=> {
        const name = nameResolution.valueOf(parameters);
        const fun = external[name];
        if (typeof(fun) === "function") {
            fun(...resolutions.map(r => r?.valueOf(parameters)));
        }
    });
}
