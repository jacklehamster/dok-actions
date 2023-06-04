import { Context } from "../context/Context";

export type ValueOf<T> = {
    valueOf(context?: Context): T;
}
