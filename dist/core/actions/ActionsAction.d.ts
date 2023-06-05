import { DokAction } from "./Action";
export interface ActionsAction<T> {
    actions?: (T & DokAction<T>)[];
}
