import { LogAction } from "../../actions/LogAction";
import { Resolution } from "../../resolutions/Resolution";
import { calculateResolution } from "../../resolutions/calculate";
import { ConvertBehavior, StepScript, Utils } from "../Convertor";

export async function convertLogProperty<T>(
        action: LogAction,
        results: StepScript,
        _: Utils<T>,
        external: Record<string, any>): Promise<ConvertBehavior|void> {
    if (action.log === undefined) {
        return;
    }
    const messages: Resolution[] = Array.isArray(action.log) ? action.log : [action.log];
    const resolutions = messages.map(m => calculateResolution(m));
    results.add((parameters)=> external.log(...resolutions.map(r => r?.valueOf(parameters))));    
}
