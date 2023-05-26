import { execute } from "../execution/ExecutionStep";
import { Convertor } from "./Convertor";

export const convertScriptProperty: Convertor = (
        action,
        results,
        getSteps) => {
    const steps = getSteps(action.script);
    results.push((context, parameters) => execute(steps, parameters, context));
}

