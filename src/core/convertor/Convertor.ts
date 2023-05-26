import { DokAction } from "../actions/Action";
import { Context } from "../context/Context";
import { ExecutionStep } from "../execution/ExecutionStep";
import { calculateBoolean } from "../resolutions/BooleanResolution";
import { calculateNumber } from "../resolutions/calculateNumber";
import { Resolution } from "../resolutions/Resolution";
import { SupportedTypes, calculateResolution } from "../resolutions/calculate";
import { Script } from "../scripts/Script";
import { ValueOf } from "../types/ValueOf";
import { assert } from "console";

export enum ConvertBehavior {
    NONE,
    SKIP_REMAINING,
}

export type Convertor = (action: DokAction, results: ExecutionStep[], getSteps: (name?: string) => ExecutionStep[], external?: Record<string, any>) => ConvertBehavior | void;

export const DEFAULT_EXTERNALS = {
    log: console.log,
};

export function execute(steps: ExecutionStep[], context: Context, parameters: Record<string, SupportedTypes | undefined>) {
    for (let step of steps) {
        step(context, parameters);
    }
}

const convertLoopProperty: Convertor = (
        action,
        stepResults: ExecutionStep[],
        getSteps,
        external = DEFAULT_EXTERNALS) => {
    assert(action.loop !== undefined);
    if (!action.loop) {
        return ConvertBehavior.SKIP_REMAINING;
    }
    const { loop, ...subAction } = action;
    const loopResolution = calculateNumber(loop, 0);
    const subStepResults: ExecutionStep[] = [];
    convertAction(subAction, subStepResults, getSteps, external);
    stepResults.push((context, parameters) => {
        const numLoops = loopResolution.valueOf(context);
        for (let i = 0; i < numLoops; i++) {
            parameters.index = i;
            execute(subStepResults, context, parameters);
        }
    });
    return ConvertBehavior.SKIP_REMAINING;
}

const convertConditionProperty: Convertor = (
        action,
        results,
        getSteps,
        external = DEFAULT_EXTERNALS) => {
    assert(action.condition !== undefined);
    if (!action.condition) {
        return ConvertBehavior.SKIP_REMAINING;
    }
    const { condition, ...subAction } = action;
    const conditionResolution = calculateBoolean(condition);
    const subStepResults: ExecutionStep[] = [];
    convertAction(subAction, subStepResults, getSteps, external);
    results.push((context, parameters) => {
        if (conditionResolution.valueOf(context)) {
            execute(subStepResults, context, parameters);
        }
    });
    return ConvertBehavior.SKIP_REMAINING;
}

const convertParametersProperty: Convertor = (
        action,
        results,
        getSteps,
        external = DEFAULT_EXTERNALS) => {
    assert(action.parameters !== undefined);
    const { parameters, ...subAction } = action;

    const paramResolutions: Record<string, Resolution> = (parameters ?? {});
    const paramEntries: [string, ValueOf<SupportedTypes | undefined>][] = Object.entries(paramResolutions).map(([key, resolution]) => [key, calculateResolution(resolution)]);

    const subStepResults: ExecutionStep[] = [];
    convertAction(subAction, subStepResults, getSteps, external);

    results.push((context, parameters) => {
        const paramValues: Record<string, SupportedTypes | undefined> = context.objectPool?.pop() ?? {};
        for (let k in parameters) {
            paramValues[k] = parameters[k];
        }
        for (let entry of paramEntries) {
            const key: string = entry[0];
            paramValues[key] = entry[1].valueOf(context);
        }

        context.parameters.push(paramValues);
        execute(subStepResults, context, paramValues);
        context.parameters.pop();

        for (let k in paramValues) {
            delete paramValues[k];
        }
        context.objectPool?.push(paramValues);
    });
    return ConvertBehavior.SKIP_REMAINING;
}

const convertScriptProperty: Convertor = (
        action,
        results,
        getSteps) => {
    const steps = getSteps(action.script);
    results.push((context, parameters) => execute(steps, context, parameters));
}

const convertLogProperty: Convertor = (
        action,
        results,
        _,
        external = DEFAULT_EXTERNALS) => {
    const messages: Resolution[] = Array.isArray(action.log) ? action.log : [action.log];
    const resolutions = messages.map(m => calculateResolution(m));
    results.push((context)=> external.log(...resolutions.map(r => r.valueOf(context))));
}

const convertActionsProperty: Convertor = (
        action,
        results,
        getSteps,
        external) => {
    action.actions?.forEach(action => convertAction(action, results, getSteps, external));
}

export const convertAction: Convertor = (
        action,
        stepResults: ExecutionStep[],
        getSteps,
        external = DEFAULT_EXTERNALS): ConvertBehavior | undefined => {

    if (action.parameters !== undefined) {
        if (convertParametersProperty(action, stepResults, getSteps, external) === ConvertBehavior.SKIP_REMAINING) {
            return;
        }
    }

    if (action.loop !== undefined) {
        if (convertLoopProperty(action, stepResults, getSteps, external) === ConvertBehavior.SKIP_REMAINING) {
            return;
        }
    }

    if (action.condition !== undefined) {
        if (convertConditionProperty(action, stepResults, getSteps, external) === ConvertBehavior.SKIP_REMAINING) {
            return;
        }
    }
    
    if (action.log !== undefined) {
        if (convertLogProperty(action, stepResults, getSteps, external) === ConvertBehavior.SKIP_REMAINING) {
            return;
        }
    }

    if (action.script !== undefined) {
        if (convertScriptProperty(action, stepResults, getSteps, external) === ConvertBehavior.SKIP_REMAINING) {
            return;
        }
    }

    if (action.actions !== undefined) {
        if (convertActionsProperty(action, stepResults, getSteps, external) === ConvertBehavior.SKIP_REMAINING) {
            return;
        }        
    }

    return;
}

export function convertScripts(
    scripts: Script[],
    external: Record<string, any> = DEFAULT_EXTERNALS): Record<string, ExecutionStep[]> {
    const scriptMap: Record<string, ExecutionStep[]> = {};
    const getSteps = (name?: string) => name ? scriptMap[name] : [];
    scripts.forEach(script => {
        if (!scriptMap[script.name]) {
            scriptMap[script.name] = [];
        }
        const scriptSteps = scriptMap[script.name];
        script.actions.forEach(action => {
            convertAction(action, scriptSteps, getSteps, external);
        });
    });
    return scriptMap;
}

export function executeScript(
        scriptName: string,
        parameters: Record<string, SupportedTypes | undefined> = {},
        scripts: Script[],
        external: Record<string, any> = DEFAULT_EXTERNALS): () => void {
    const context: Context = {
        parameters: [parameters],
        cleanupActions: []
    };
    const scriptMap = convertScripts(scripts, external);
    execute(scriptMap[scriptName], context, {});
    return () => {
        context.cleanupActions!.forEach(action => action());
        context.cleanupActions!.length = 0;
    };
}
