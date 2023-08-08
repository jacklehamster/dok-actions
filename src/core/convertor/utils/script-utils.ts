import { ScriptProcessorHelper } from "../../processor/ScriptProcessor";
import { Script, ScriptFilter, filterScripts } from "../../scripts/Script";
import { ConvertBehavior, ConvertorSet, StepScript } from "../Convertor";
import { convertAction } from "../actions/convert-action";

export function spreadScripts<T>(scripts: Script<T>[] = [], results: Script<T>[] = []): Script<T>[] {
    scripts.forEach(script => {
        spreadScripts(script.scripts, results);
        results.push(script);
    });
    return results;
}

export async function convertScripts<T>(
        scripts: Script<T>[],
        external: Record<string, any>,
        convertorSet: ConvertorSet,
        processorHelper: ScriptProcessorHelper): Promise<Map<Script<T>, StepScript>> {
    return convertScriptsHelper<T>(spreadScripts(scripts), external, convertorSet, processorHelper);
}

async function convertScriptsHelper<T>(
        scripts: Script<T>[],
        external: Record<string, any>,
        convertorSet: ConvertorSet,
        processorHelper: ScriptProcessorHelper): Promise<Map<Script<T>, StepScript>> {
    const scriptMap: Map<Script<T>, StepScript> = new Map();
    scripts.forEach(script => scriptMap.set(script, new StepScript()));
    const getSteps = (filter: ScriptFilter) => {
        const filteredScripts = filterScripts(scripts, filter);
        const steps: StepScript = new StepScript();
        filteredScripts.forEach(script => {
            const stepScript = scriptMap.get(script);
            stepScript?.getSteps().forEach(step => steps.add(step));
        });
        return steps;
    };
    for (let script of scripts) {
        const scriptSteps = scriptMap.get(script) ?? new StepScript();
        const { actions = [] } = script;
        for (let i = 0; i < actions.length; i++) {
            const getRemainingActions = () => actions.slice(i + 1);
            const convertBehavior = await convertAction(actions[i], scriptSteps, {
                getSteps, getRemainingActions, refreshSteps: processorHelper.refreshSteps, stopRefresh: processorHelper.stopRefresh,
            }, external, convertorSet);
            if (convertBehavior === ConvertBehavior.SKIP_REMAINING_ACTIONS) {
                break;
            }
        }
    }
    return scriptMap;
}
