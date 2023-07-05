import { Context } from "../../context/Context";
import { ExecutionParameters } from "../../execution/ExecutionStep";

export function newParams(parameters: ExecutionParameters | undefined, context: Context): ExecutionParameters {
    const params = context.objectPool.generate();
    for (let k in parameters) {
        params[k] = parameters[k];
    }    
    return params;
}

export function recycleParams(params: ExecutionParameters, context: Context): void {
    context.objectPool.recycle(params);
}

