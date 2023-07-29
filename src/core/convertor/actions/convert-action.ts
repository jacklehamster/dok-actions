import { Context, createContext } from "../../context/Context";
import { ExecutionParameters, ExecutionStep, execute } from "../../execution/ExecutionStep";
import { ScriptProcessorHelper } from "../../processor/ScriptProcessor";
import { Script } from "../../scripts/Script";
import { convertScripts } from "../utils/script-utils";
import { ConvertBehavior, ConvertorSet, Utils } from "./../Convertor";

export async function convertAction<T>(
        action: T,
        stepResults: ExecutionStep[],
        utils: Utils<T>,
        external: Record<string, any>,
        convertorSet: ConvertorSet): Promise<ConvertBehavior | void> {
    for (let convertor of convertorSet.actionsConvertor) {
        const convertBehavior = await convertor(action, stepResults, utils, external, convertorSet);
        if (convertBehavior === ConvertBehavior.SKIP_REMAINING_CONVERTORS) {
            return;
        } else if (convertBehavior === ConvertBehavior.SKIP_REMAINING_ACTIONS) {
            return convertBehavior;
        }
    }
    return;    
}

export async function executeScript<T>(
        scriptName: string,
        parameters: ExecutionParameters = {},
        scripts: Script<T>[],
        external: Record<string, any>,
        convertorSet: ConvertorSet,
        processorHelper: ScriptProcessorHelper): Promise<() => void> {
    const context: Context = createContext();
    const scriptMap = await convertScripts(scripts, external, convertorSet, processorHelper);
    const script = scripts.find(({name}) => name === scriptName);
    const steps = script ? scriptMap.get(script) : [];
    execute(steps, parameters, context);
    return () => context.clear();
}

export async function executeAction<T>(
        action: T,
        parameters: ExecutionParameters,
        context: Context,
        utils: Utils<T>,
        convertorSet: ConvertorSet): Promise<void> {
    const results: ExecutionStep[] = [];
    if (ConvertBehavior.SKIP_REMAINING_ACTIONS !== await convertAction(action, results, utils, context.external, convertorSet)) {
        execute(results, parameters, context);
    }
}