import { Context } from "../context/Context";
import { SupportedTypes } from "../resolutions/supportedTypes";

export type ExecutionParameters = Record<string, SupportedTypes>;
export type ExecutionStep = (context: Context, parameters: ExecutionParameters) => void;

export function execute(steps: ExecutionStep[], parameters: ExecutionParameters = {}, context: Context = {}) {
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
    if (changedParameters) {
        context.parameters.pop();
    }
}
