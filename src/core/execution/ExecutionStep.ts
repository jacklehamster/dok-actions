import { Context, createContext } from "../context/Context";
import { SupportedTypes } from "../resolutions/SupportedTypes";

export type ExecutionParameters = Record<string, SupportedTypes>;
export type ExecutionStep = (context: Context, parameters: ExecutionParameters) => void;

export function execute(steps?: ExecutionStep[], parameters: ExecutionParameters = {}, context: Context = createContext()) {
    if (!steps?.length) {
        return;
    }
    if (!context.parameters) {
        context.parameters = [];
    }

    const changedParameters = context.parameters[context.parameters.length-1] !== parameters;
    if (changedParameters) {
        context.parameters.push(parameters);
    }
    for (let step of steps) {
        step(context, parameters);
    }
    context.postActionListener.forEach(listener => listener(context, parameters));

    if (changedParameters) {
        context.parameters.pop();
    }
}
