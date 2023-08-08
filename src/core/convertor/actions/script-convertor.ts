import { ScriptAction } from "../../actions/ScriptAction";
import { execute } from "../../execution/ExecutionStep";
import { ConvertBehavior, StepScript, Utils } from "../Convertor";

export async function convertScriptProperty<T>(
        action: ScriptAction,
        results: StepScript,
        {getSteps}: Utils<T>): Promise<ConvertBehavior|void> {
    if (!action.executeScript) {
        return;
    }
    const { executeScript } = action;

    const name = executeScript;
    const steps = getSteps({ name });
    results.add((parameters, context) => execute(steps, parameters, context));
}

