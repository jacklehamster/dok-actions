import { DokAction } from "../actions/Action";
import { Context } from "../context/Context";
import { ExecutionParameters, ExecutionStep, execute } from "../execution/ExecutionStep";
import { Script } from "../scripts/Script";
import { ConvertBehavior, Convertor, DEFAULT_EXTERNALS } from "./Convertor";
import { convertActionsProperty } from "./actions-convertor";
import { convertConditionProperty } from "./condition-convertor";
import { convertLogProperty } from "./log-convertor";
import { convertLoopProperty } from "./loop-convertor";
import { convertParametersProperty } from "./parameters-convertor";
import { convertScriptProperty } from "./script-convertor";

export type ActionConvertorList = Convertor<Record<string, any>>[];

export const DEFAULT_CONVERTORS: ActionConvertorList = [
    convertParametersProperty,
    convertLoopProperty,
    convertConditionProperty,
    convertLogProperty,
    convertScriptProperty,
    convertActionsProperty,
];

export const convertAction: Convertor<DokAction> = (
        action,
        stepResults: ExecutionStep[],
        getSteps,
        external = DEFAULT_EXTERNALS,
        actionConversionMap: ActionConvertorList): ConvertBehavior | undefined => {

    for (let convertor of actionConversionMap) {
        if (convertor(action, stepResults, getSteps, external, actionConversionMap) === ConvertBehavior.SKIP_REMAINING) {
            return;
        }
    }
    return;
}

export function convertScripts(
        scripts: Script[],
        external: Record<string, any> = DEFAULT_EXTERNALS,
        actionConversionMap = DEFAULT_CONVERTORS): Map<Script, ExecutionStep[]> {
    const scriptMap: Map<Script, ExecutionStep[]> = new Map();
    const getSteps = (name?: string) => {
        const script = scripts.find(script => script.name === name);
        return script ? scriptMap.get(script) ?? [] : [];
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

export function executeScript(
        scriptName: string,
        parameters: ExecutionParameters = {},
        scripts: Script[],
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
