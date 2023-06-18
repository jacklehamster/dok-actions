import { Context } from "../context/Context";
import { ExecutionParameters } from "../execution/ExecutionStep";

export function newParams(context: Context): ExecutionParameters {
    return context.objectPool?.pop() ?? {};
}

export function recycleParams(context: Context, params: ExecutionParameters): void {
    for (let k in params) {
        delete params[k];
    }
    context.objectPool?.push(params);
}

