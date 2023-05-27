import { DokAction } from "../actions/Action";
import { Context } from "../context/Context";
import { ExecutionStep, execute } from "../execution/ExecutionStep";
import { SupportedTypes } from "../resolutions/calculate";
import { Script } from "../scripts/Script";
import { ConvertBehavior, Convertor, DEFAULT_EXTERNALS } from "./Convertor";
import { convertActionsProperty } from "./actions-convertor";
import { convertConditionProperty } from "./condition-convertor";
import { convertLogProperty } from "./log-convertor";
import { convertLoopProperty } from "./loop-convertor";
import { convertParametersProperty } from "./parameters-convertor";
import { convertScriptProperty } from "./script-convertor";

export type ActionPredicate = (action: DokAction) => boolean;
export type ActionConversionMap = [ActionPredicate, Convertor][];

export const DEFAULT_CONVERSION_MAP: ActionConversionMap = [
    [({parameters}) => parameters !== undefined, convertParametersProperty],
    [({loop}) => loop !== undefined, convertLoopProperty],
    [({condition}) => condition !== undefined, convertConditionProperty],
    [({log}) => log !== undefined, convertLogProperty],
    [({script}) => script !== undefined, convertScriptProperty],
    [({actions}) => actions !== undefined, convertActionsProperty],
];

export const convertAction: Convertor = (
        action,
        stepResults: ExecutionStep[],
        getSteps,
        external = DEFAULT_EXTERNALS,
        actionConversionMap = DEFAULT_CONVERSION_MAP): ConvertBehavior | undefined => {

    for (let [predicate, convertor] of actionConversionMap) {
        if (predicate(action)) {
            if (convertor(action, stepResults, getSteps, external, actionConversionMap) === ConvertBehavior.SKIP_REMAINING) {
                return;
            }
        }
    }
    return;
}

export function convertScripts(
        scripts: Script[],
        external: Record<string, any> = DEFAULT_EXTERNALS,
        actionConversionMap = DEFAULT_CONVERSION_MAP): Record<string, ExecutionStep[]> {
    const scriptMap: Record<string, ExecutionStep[]> = {};
    const getSteps = (name?: string) => name ? scriptMap[name] : [];
    scripts.forEach(script => {
        if (!scriptMap[script.name]) {
            scriptMap[script.name] = [];
        }
        const scriptSteps = scriptMap[script.name];
        script.actions.forEach(action => {
            convertAction(action, scriptSteps, getSteps, external, actionConversionMap);
        });
    });
    return scriptMap;
}

export function executeScript(
        scriptName: string,
        parameters: Record<string, SupportedTypes | undefined> = {},
        scripts: Script[],
        external: Record<string, any> = DEFAULT_EXTERNALS,
        actionConversionMap = DEFAULT_CONVERSION_MAP): () => void {
    const context: Context = {
        parameters: [parameters],
        cleanupActions: []
    };
    const scriptMap = convertScripts(scripts, external, actionConversionMap);
    execute(scriptMap[scriptName], {}, context);
    return () => {
        context.cleanupActions!.forEach(action => action());
        context.cleanupActions!.length = 0;
    };
}
