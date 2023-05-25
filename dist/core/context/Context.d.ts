import { SupportedTypes } from "../resolutions/calculate";
export interface Context {
    parameters: Record<string, SupportedTypes | undefined>[];
    cleanupActions?: (() => void)[];
    objectPool?: Record<string, any>[];
}
