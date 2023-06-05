import { LogAction } from "../actions/LogAction";
import { ExecutionStep } from "../execution/ExecutionStep";
import { Resolution } from "../resolutions/Resolution";
import { calculateResolution } from "../resolutions/calculate";
import { Utils } from "./Convertor";
import { ActionConvertorList } from "./convert-action";

export function convertLogProperty<T>(
        action: LogAction,
        results: ExecutionStep[],
        _: Utils<T>,
        external: Record<string, any>,
        __: ActionConvertorList) {
    if (action.log === undefined) {
        return;
    }
    const messages: Resolution[] = Array.isArray(action.log) ? action.log : [action.log];
    const resolutions = messages.map(m => calculateResolution(m));
    results.push((context)=> external.log(...resolutions.map(r => r?.valueOf(context))));    
}
