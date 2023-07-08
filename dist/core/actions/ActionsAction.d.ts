import { DokAction } from "./Action";
export declare type ActionList<T> = ((T & DokAction<T>) | ActionList<T>)[];
export interface ActionsAction<T> {
    actions?: ActionList<T>;
}
