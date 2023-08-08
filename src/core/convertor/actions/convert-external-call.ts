import { ExternalAction } from "../../actions/ExternalAction";
import { Resolution } from "../../resolutions/Resolution";
import { calculateResolution } from "../../resolutions/calculate";
import { calculateString } from "../../resolutions/calculateString";
import { ConvertBehavior, StepScript, Utils } from "../Convertor";

export async function convertExternalCallProperty<T>(
        action: ExternalAction,
        results: StepScript,
        _: Utils<T & ExternalAction>,
        external: Record<string, any>): Promise<ConvertBehavior|void> {
    if (action.callExternal === undefined) {
        return;
    }
    const { callExternal } = action;
    const subjectResolution = calculateResolution(callExternal.subject);
    const methodResolution = calculateString(callExternal.method);
    const args: Resolution[] = !callExternal.arguments ? [] : Array.isArray(callExternal.arguments) ? callExternal.arguments : [callExternal.arguments];
    const argsValues = args.map(m => calculateResolution(m));
    results.add((parameters)=> {
        const subject = subjectResolution?.valueOf(parameters) ?? external;
        if (subject && typeof(subject) === "object" && !Array.isArray(subject)) {
            const s = subject as Record<string, any>;
            const method = methodResolution?.valueOf(parameters);
            const m = s[method];
            if (typeof(m) === "function") {
                m.apply(s, argsValues.map(r => r?.valueOf(parameters)));
            }    
        }
    });
}
