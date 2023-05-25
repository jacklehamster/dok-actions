import { DokAction } from "../actions/Action";
import { ScriptAction } from "../actions/ScriptAction";
import { Context } from "../context/Context";
import { ExecutionStep } from "../execution/ExecutionStep";
import { calculateBoolean } from "../resolutions/BooleanResolution";
import { calculateNumber } from "../resolutions/calculateNumber";
import { Resolution } from "../resolutions/Resolution";
import { SupportedTypes, calculateResolution } from "../resolutions/calculate";
import { Script } from "../scripts/Script";
import { ValueOf } from "../types/ValueOf";

export type Convertor = (action: DokAction, getSteps: (name: string) => ExecutionStep[], external?: Record<string, any>) => ExecutionStep | undefined;

export const DEFAULT_EXTERNALS = {
    log: console.log,
};

function convertScriptAction(action: ScriptAction, getSteps: (name: string) => ExecutionStep[]): ExecutionStep {
    const steps = getSteps(action.script);
    const elseSteps = action.else ? getSteps(action.else) : undefined;
    const resolutions: Record<string, Resolution> = (action.parameters ?? {});
    const entries: [string, ValueOf<SupportedTypes | undefined>][] = Object.entries(resolutions).map(([key, resolution]) => [key, calculateResolution(resolution)]);
    const loopResolution = action.loop ? calculateNumber(action.loop) : 1;
    const conditionResolution = action.condition ? calculateBoolean(action.condition) : true;
    return (context, parameters) => {
        const paramValues: Record<string, SupportedTypes | undefined> = context.objectPool?.pop() ?? {};
        context.parameters.push(paramValues);
        for (let k in parameters) {
            paramValues[k] = parameters[k];
        }
        for (let entry of entries) {
            const key: string = entry[0];
            paramValues[key] = entry[1].valueOf(context);
        }

        const numLoops = loopResolution.valueOf(context);
        for (let index = 0; index < numLoops; index++) {
            paramValues.index = index;
            if (conditionResolution.valueOf(context)) {
                for (let step of steps) {
                    step(context, paramValues);
                }        
            } else if (elseSteps) {
                for (let step of elseSteps) {
                    step(context, paramValues);
                }
            }
        }
        const obj = context.parameters.pop();
        if (obj) {
            for (let k in obj) {
                delete obj[k];
            }
            context.objectPool?.push(obj);
        }
    };
}

export const convertAction: Convertor = (
        action,
        getSteps,
        external = DEFAULT_EXTERNALS) => {
    if (typeof(action.action) === "string" || !action.action) {
        switch(action.action) {
            case "log":
                {
                    const messages: Resolution[] = action.messages;
                    const resolutions = messages.map(m => calculateResolution(m));
                    return (context) => {
                        external.log.apply(null, resolutions.map(r => r.valueOf(context)));
                    }    
                }
            case undefined:
            case "execute-script":
                {
                    return convertScriptAction(action as ScriptAction, getSteps);
                }
        }    
    } else {
        const dokAction: DokAction = action.action;
        const elseAction: DokAction = action.else;
        const step = convertAction(dokAction, getSteps, external);
        const elseStep = action.else ? convertAction(elseAction, getSteps, external) : undefined;
        const loopResolution = action.loop ? calculateNumber(action.loop) : 1;
        const conditionResolution = action.condition ? calculateBoolean(action.condition) : true;
        return (context, parameters) => {
            const numLoops = loopResolution.valueOf(context);
            for (let i = 0; i < numLoops; i++) {
                parameters.index = i;
                if (conditionResolution.valueOf(context)) {
                    step?.(context, parameters);
                } else {
                    elseStep?.(context, parameters);
                }
            }
        }
    }
    return;
}

export const DEFAULT_CONVERTORS = {
    "log": convertAction,
    "execute-script": convertAction,
    "actionAction": convertAction,
};

export function convertScripts(
    scripts: Script[],
    convertors: Record<string, Convertor> = DEFAULT_CONVERTORS,
    external: Record<string, any> = DEFAULT_EXTERNALS): Record<string, ExecutionStep[]> {
    const scriptMap: Record<string, ExecutionStep[]> = {};
    const getSteps = (name: string) => scriptMap[name];
    scripts.forEach(script => {
        if (!scriptMap[script.name]) {
            scriptMap[script.name] = [];
        }
        const scriptSteps = scriptMap[script.name];
        script.actions.forEach(action => {
            const convertAction = typeof(action.action) === "string" ? convertors[action.action ?? "execute-script"] : convertors.actionAction;
            const step = convertAction(action, getSteps, external);
            if (step) {
                scriptSteps.push(step);
            }
        });
    });
    return scriptMap;
}

export function executeScript(
        scriptName: string,
        scripts: Script[],
        context: Context,
        convertors: Record<string, Convertor> = DEFAULT_CONVERTORS,
        external: Record<string, any> = DEFAULT_EXTERNALS): void {
    const scriptMap = convertScripts(scripts, convertors, external);
    const scriptExecutionStep = convertScriptAction({
        script: scriptName,
    }, (name) => scriptMap[name]);
    scriptExecutionStep(context, {});
}
