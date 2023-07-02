import { ScriptAction } from "../actions/ScriptAction";
import { ExecutionStep, execute } from "../execution/ExecutionStep";
import { ConvertBehavior, Utils } from "./Convertor";

export async function convertScriptProperty<T>(
        action: ScriptAction,
        results: ExecutionStep[],
        {getSteps}: Utils<T>): Promise<ConvertBehavior|void> {
    if (!action.executeScript) {
        return;
    }
    const { executeScript } = action;

    const name = executeScript;
    const steps = getSteps({ name });
    results.push((parameters, context) => execute(steps, parameters, context));
}

