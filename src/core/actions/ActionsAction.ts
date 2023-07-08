import { DokAction } from "./Action";

export type ActionList<T> = (T&DokAction<T> | ActionList<T>)[]

export interface ActionsAction<T> {
    actions?: ActionList<T>;
}
