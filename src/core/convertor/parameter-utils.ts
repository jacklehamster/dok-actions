import { Context } from "../context/Context";
import { ExecutionParameters } from "../execution/ExecutionStep";

export function newParams(parameters: ExecutionParameters | undefined, context: Context): ExecutionParameters {
    const params = context.objectPool?.pop() ?? {};
    if (parameters) {
        for (let k in parameters) {
            params[k] = parameters[k];
        }    
    }
    return params;
}

export function recycleParams(params: ExecutionParameters, context: Context): void {
    for (let k in params) {
        delete params[k];
    }
    context.objectPool?.push(params);
}

