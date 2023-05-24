import { SupportedTypes } from "../resolutions/calculate";

export interface Context {
    time: number;
    parameters: Record<string, SupportedTypes | undefined>[];
    cleanupActions?:(() => void)[];
    objectPool?: Record<string, any>[];
}
