import { Context } from "../context/Context";

export interface ValueOf<T> {
    valueOf(context?: Context): T;
}