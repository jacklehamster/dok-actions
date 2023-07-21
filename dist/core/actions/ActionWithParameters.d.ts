import { Resolution } from "../resolutions/Resolution";
export interface ActionWithParameters {
    parameters?: Record<string, Resolution>;
}
