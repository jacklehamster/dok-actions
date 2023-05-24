import { Context } from "../context/Context";
import { SupportedTypes } from "../resolutions/calculate";

export type ExecutionStep = (context: Context, parameters: Record<string, SupportedTypes | undefined>) => void;
