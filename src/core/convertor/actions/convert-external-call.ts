import { ExternalAction } from "../../actions/ExternalAction";
import { ExecutionStep } from "../../execution/ExecutionStep";
import { Resolution } from "../../resolutions/Resolution";
import { calculateResolution } from "../../resolutions/calculate";
import { ConvertBehavior } from "../Convertor";

export async function convertExternalCallProperty(
        action: ExternalAction,
        results: ExecutionStep[]): Promise<ConvertBehavior|void> {
    if (action.callExternal === undefined) {
        return;
    }
    const { callExternal } = action;
    const methodResolution = calculateResolution(callExternal.method);
    const args: Resolution[] = !callExternal.arguments ? [] : Array.isArray(callExternal.arguments) ? callExternal.arguments : [callExternal.arguments];
    const argsValues = args.map(m => calculateResolution(m));
    results.push((parameters)=> {
        const method = methodResolution?.valueOf(parameters);
        if (typeof(method) === "function") {
            const m = method as Function;
            m(...argsValues.map(r => r?.valueOf(parameters)));
        }
    });
}
