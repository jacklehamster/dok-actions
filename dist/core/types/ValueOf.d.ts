import { Context } from "../context/Context";
export declare type ValueOf<T> = {
    valueOf(context?: Context): T;
};
