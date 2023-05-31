import { Context } from "../context/Context";
import { ExecutionParameters, ExecutionStep, GetSteps, execute } from "../execution/ExecutionStep";
import { Script, ScriptFilter, filterScripts } from "../scripts/Script";
import { ConvertBehavior, Convertor, DEFAULT_EXTERNALS } from "./Convertor";
import { convertActionsProperty } from "./actions-convertor";
import { convertConditionProperty } from "./condition-convertor";
import { convertLogProperty } from "./log-convertor";
import { convertLoopProperty } from "./loop-convertor";
import { convertParametersProperty } from "./parameters-convertor";
import { convertScriptProperty } from "./script-convertor";

export type ActionConvertorList = Convertor<any>[];

export const DEFAULT_CONVERTORS: ActionConvertorList = [
    convertParametersProperty,
    convertLoopProperty,
    convertConditionProperty,
    convertLogProperty,
    convertScriptProperty,
    convertActionsProperty,
];

export function convertAction<T>(
        action: T,
        stepResults: ExecutionStep[],
        getSteps: GetSteps,
        external: Record<string, any> = DEFAULT_EXTERNALS,
        actionConversionMap: ActionConvertorList): ConvertBehavior | undefined {
    for (let convertor of actionConversionMap) {
        if (convertor(action, stepResults, getSteps, external, actionConversionMap) === ConvertBehavior.SKIP_REMAINING) {
            return;
        }
    }
    return;    
}

export function convertScripts<T>(
        scripts: Script<T>[],
        external: Record<string, any> = DEFAULT_EXTERNALS,
        actionConversionMap = DEFAULT_CONVERTORS): Map<Script<T>, ExecutionStep[]> {
    const scriptMap: Map<Script<T>, ExecutionStep[]> = new Map();
    const getSteps = (filter: ScriptFilter) => {
        const filteredScripts = filterScripts(scripts, filter);
        const steps: ExecutionStep[] = [];
        filteredScripts.forEach(script => steps.push(...(scriptMap.get(script)??[])));
        return steps;
    };
    scripts.forEach(script => {
        if (!scriptMap.has(script)) {
            scriptMap.set(script, []);
        }
        const scriptSteps = scriptMap.get(script) ?? [];
        script.actions.forEach(action => {
            convertAction(action, scriptSteps, getSteps, external, actionConversionMap);
        });
    });
    return scriptMap;
}

export function executeScript<T>(
        scriptName: string,
        parameters: ExecutionParameters = {},
        scripts: Script<T>[],
        external: Record<string, any> = DEFAULT_EXTERNALS,
        actionConversionMap = DEFAULT_CONVERTORS): () => void {
    const context: Context = {
        parameters: [parameters],
        cleanupActions: []
    };
    const scriptMap = convertScripts(scripts, external, actionConversionMap);
    const script = scripts.find(({name}) => name === scriptName);
    const steps = script ? scriptMap.get(script) : [];
    if (steps?.length) {
        execute(steps, {}, context);
    }
    return () => {
        context.cleanupActions!.forEach(action => action());
        context.cleanupActions!.length = 0;
    };
}
