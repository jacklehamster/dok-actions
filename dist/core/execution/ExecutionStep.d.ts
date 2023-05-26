import { Context } from "../context/Context";
import { SupportedTypes } from "../resolutions/calculate";
export declare type ExecutionStep = (context: Context, parameters: Record<string, SupportedTypes | undefined>) => void;
export declare function execute(steps: ExecutionStep[], context: Context, parameters: Record<string, SupportedTypes | undefined>): void;
