import { NumberResolution } from "./NumberResolution";
import { Resolution } from "./Resolution";
import { StringResolution } from "./StringResolution";
import { Formula } from "./formula/Formula";
export declare type ObjectResolution = {
    subject: Resolution;
    access?: (StringResolution | NumberResolution)[];
    formula?: Formula;
};
