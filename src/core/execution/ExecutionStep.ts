import { Context, createContext } from "../context/Context";
import { SupportedTypes } from "../resolutions/SupportedTypes";

export type ExecutionParameters = Record<string, SupportedTypes>;
export type ExecutionStep = (parameters: ExecutionParameters, context: Context) => void;

export function execute(steps?: ExecutionStep[], parameters: ExecutionParameters = {}, context: Context = createContext()) {
    if (!steps?.length) {
        return;
    }
    if (!context.parameters) {
        context.parameters = [];
    }

    const params = context.parameters;
    const changedParameters = params[params.length-1] !== parameters;
    if (changedParameters) {
        params.push(parameters);
    }
    for (let step of steps) {
        step(parameters, context);
    }
    context.executePostActions(parameters);

    if (changedParameters) {
        params.pop();
    }
}
