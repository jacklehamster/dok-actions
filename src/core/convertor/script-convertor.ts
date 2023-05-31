import { ScriptAction } from "../actions/ScriptAction";
import { execute } from "../execution/ExecutionStep";
import { Convertor } from "./Convertor";

export const convertScriptProperty: Convertor<ScriptAction> = (
        action,
        results,
        getSteps) => {
    if (!action.script || action.scriptTags?.length) {
        return;
    }
    const steps = getSteps({ name: action.script, tags: action.scriptTags });
    results.push((context, parameters) => execute(steps, parameters, context));
}

