import { Context } from "../context/Context";
import { SupportedTypes } from "../resolutions/calculate";

export type ExecutionStep = (context: Context, parameters: Record<string, SupportedTypes | undefined>) => void;

export function execute(steps: ExecutionStep[], parameters: Record<string, SupportedTypes | undefined> = {}, context: Context = {}) {
    for (let step of steps) {
        step(context, parameters);
    }
}
