import { NumberResolution } from "./NumberResolution";
import { Resolution } from "./Resolution";
import { StringResolution } from "./StringResolution";

export type ObjectResolution = {
    subject: Resolution;
    access?: (StringResolution|NumberResolution)[];
};
