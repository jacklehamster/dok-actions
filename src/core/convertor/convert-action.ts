import { Context, createContext } from "../context/Context";
import { ExecutionParameters, ExecutionStep, execute } from "../execution/ExecutionStep";
import { Script, ScriptFilter, filterScripts } from "../scripts/Script";
import { ConvertBehavior, Convertor, DEFAULT_EXTERNALS, Utils } from "./Convertor";
import { DEFAULT_CONVERTORS } from "./default-convertors";

export type ActionConvertorList = Convertor<any>[];

export function convertAction<T>(
        action: T,
        stepResults: ExecutionStep[],
        utils: Utils<T>,
        external: Record<string, any> = DEFAULT_EXTERNALS,
        actionConversionMap: ActionConvertorList): ConvertBehavior | undefined {
    for (let convertor of actionConversionMap) {
        const convertBehavior = convertor(action, stepResults, utils, external, actionConversionMap);
        if (convertBehavior === ConvertBehavior.SKIP_REMAINING_CONVERTORS) {
            return;
        } else if (convertBehavior === ConvertBehavior.SKIP_REMAINING_ACTIONS) {
            return convertBehavior;
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
        const { actions } = script;
        for (let i = 0; i < actions.length; i++) {
            const getRemainingActions = () => actions.slice(i + 1);
            const convertBehavior = convertAction(actions[i], scriptSteps, {getSteps, getRemainingActions}, external, actionConversionMap);
            if (convertBehavior === ConvertBehavior.SKIP_REMAINING_ACTIONS) {
                break;
            }
        }
    });
    return scriptMap;
}

export function executeScript<T>(
        scriptName: string,
        parameters: ExecutionParameters = {},
        scripts: Script<T>[],
        external: Record<string, any> = DEFAULT_EXTERNALS,
        actionConversionMap: ActionConvertorList = DEFAULT_CONVERTORS): () => void {
    const context: Context = createContext();
    const scriptMap = convertScripts(scripts, external, actionConversionMap);
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
        external: Record<string, any> = DEFAULT_EXTERNALS,
        actionConversionMap: ActionConvertorList): void {
    const results: ExecutionStep[] = [];
    convertAction(action, results, utils, external, actionConversionMap);
    execute(results, parameters, context);
}