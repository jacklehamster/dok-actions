import { ActionWithParameters } from "./ActionWithParameters";
export interface ScriptAction extends ActionWithParameters {
    executeScript?: string;
}
