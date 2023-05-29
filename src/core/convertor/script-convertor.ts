import { ScriptAction } from "../actions/ScriptAction";
import { execute } from "../execution/ExecutionStep";
import { Convertor } from "./Convertor";

export const convertScriptProperty: Convertor<ScriptAction> = (
        action,
        results,
        getSteps) => {
    if (action.script === undefined) {
        return;
    }
    const steps = getSteps(action.script);
    results.push((context, parameters) => execute(steps, parameters, context));
}

