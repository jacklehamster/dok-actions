import { ScriptAction } from "../actions/ScriptAction";
import { ExecutionStep, execute } from "../execution/ExecutionStep";
import { ConvertBehavior, Utils } from "./Convertor";
import { ActionConvertorList } from "./convert-action";

export async function convertScriptProperty<T>(
        action: ScriptAction,
        results: ExecutionStep[],
        {getSteps}: Utils<T>,
        _: Record<string, any>,
        __: ActionConvertorList): Promise<ConvertBehavior|void> {
    if (!action.script || action.scriptTags?.length) {
        return;
    }
    const steps = getSteps({ name: action.script, tags: action.scriptTags });
    results.push((parameters, context) => execute(steps, parameters, context));
}

