import { NumberResolution } from "./NumberResolution";
import { Resolution } from "./Resolution";
import { StringResolution } from "./StringResolution";
import { Formula } from "./formula/Formula";

export type ObjectResolution = {
    subject: Resolution;
    access?: (StringResolution|NumberResolution)[];
    formula?: Formula;
};
