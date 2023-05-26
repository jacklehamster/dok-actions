import { Resolution } from "../resolutions/Resolution";
import { calculateResolution } from "../resolutions/calculate";
import { Convertor, DEFAULT_EXTERNALS } from "./Convertor";

export const convertLogProperty: Convertor = (
    action,
    results,
    _,
    external = DEFAULT_EXTERNALS) => {
const messages: Resolution[] = Array.isArray(action.log) ? action.log : [action.log];
const resolutions = messages.map(m => calculateResolution(m));
results.push((context)=> external.log(...resolutions.map(r => r.valueOf(context))));
}

