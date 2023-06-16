import { Context, createContext } from "../context/Context";
import { ExecutionParameters, ExecutionStep, execute } from "../execution/ExecutionStep";
import { ScriptProcessorHelper } from "../processor/ScriptProcessor";
import { Script, ScriptFilter, filterScripts } from "../scripts/Script";
import { ConvertBehavior, Convertor, Utils } from "./Convertor";

export type ActionConvertorList = Convertor<any>[];

export async function convertAction<T>(
        action: T,
        stepResults: ExecutionStep[],
        utils: Utils<T>,
        external: Record<string, any>,
        actionConversionMap: ActionConvertorList): Promise<ConvertBehavior | void> {
    for (let convertor of actionConversionMap) {
        const convertBehavior = await convertor(action, stepResults, utils, external, actionConversionMap);
        if (convertBehavior === ConvertBehavior.SKIP_REMAINING_CONVERTORS) {
            return;
        } else if (convertBehavior === ConvertBehavior.SKIP_REMAINING_ACTIONS) {
            return convertBehavior;
        }
    }
    return;    
}

export async function convertScripts<T>(
        scripts: Script<T>[],
        external: Record<string, any>,
        actionConversionMap: ActionConvertorList,
        processorHelper: ScriptProcessorHelper): Promise<Map<Script<T>, ExecutionStep[]>> {
    const scriptMap: Map<Script<T>, ExecutionStep[]> = new Map();
    const getSteps = (filter: ScriptFilter) => {
        const filteredScripts = filterScripts(scripts, filter);
        const steps: ExecutionStep[] = [];
        filteredScripts.forEach(script => steps.push(...(scriptMap.get(script)??[])));
        return steps;
    };
    for (let script of scripts) {
        if (!scriptMap.has(script)) {
            scriptMap.set(script, []);
        }
        const scriptSteps = scriptMap.get(script) ?? [];
        const { actions } = script;
        for (let i = 0; i < actions.length; i++) {
            const getRemainingActions = () => actions.slice(i + 1);
            const convertBehavior = await convertAction(actions[i], scriptSteps, {
                getSteps, getRemainingActions, refreshSteps: processorHelper.refreshSteps, stopRefresh: processorHelper.stopRefresh,
            }, external, actionConversionMap);
            if (convertBehavior === ConvertBehavior.SKIP_REMAINING_ACTIONS) {
                break;
            }
        }
    }
    return scriptMap;
}

export async function executeScript<T>(
        scriptName: string,
        parameters: ExecutionParameters = {},
        scripts: Script<T>[],
        external: Record<string, any>,
        actionConversionMap: ActionConvertorList,
        processorHelper: ScriptProcessorHelper): Promise<() => void> {
    const context: Context = createContext();
    const scriptMap = await convertScripts(scripts, external, actionConversionMap, processorHelper);
    const script = scripts.find(({name}) => name === scriptName);
    const steps = script ? scriptMap.get(script) : [];
    execute(steps, parameters, context);
    return () => {
        context.cleanupActions!.forEach(action => action());
        context.cleanupActions!.length = 0;
    };
}

export function executeAction<T>(
        action: T,
        parameters: ExecutionParameters,
        context: Context,
        utils: Utils<T>,
        external: Record<string, any>,
        actionConversionMap: ActionConvertorList): void {
    const results: ExecutionStep[] = [];
    convertAction(action, results, utils, external, actionConversionMap);
    execute(results, parameters, context);
}