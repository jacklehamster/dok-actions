import { Context } from "../context/Context";
import { ValueOf } from "../types/ValueOf";
import { ArrayResolution } from "./ArrayResolution";
import { calculateResolution } from "./calculate";
import { hasFormula } from "./calculateEvaluator";
import { SupportedTypes } from "./SupportedTypes";

export function calculateArray(value: ArrayResolution): ValueOf<SupportedTypes> {
    //  check if we have any resolution to perform
    if (!hasFormula(value)) {
        if (typeof(value) === "object") {
            throw new Error("value can't be an object.");
        }
        return value;
    }
    const evaluator = value.map(resolution => calculateResolution(resolution));

    return {
        valueOf(context?: Context): SupportedTypes {
            const value = evaluator.map(evalItem => evalItem.valueOf(context));
            return value;
        }
    };
}