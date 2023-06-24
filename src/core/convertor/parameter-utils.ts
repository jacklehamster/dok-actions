import { Context } from "../context/Context";
import { ExecutionParameters } from "../execution/ExecutionStep";

export function newParams(parameters: ExecutionParameters, context: Context): ExecutionParameters {
    const params = context.objectPool?.pop() ?? {};
    for (let k in parameters) {
        params[k] = parameters[k];
    }
    return params;
}

export function recycleParams(params: ExecutionParameters, context: Context): void {
    for (let k in params) {
        delete params[k];
    }
    context.objectPool?.push(params);
}

