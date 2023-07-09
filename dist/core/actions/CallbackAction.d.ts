import { BooleanResolution } from "../resolutions/BooleanResolution";
import { ActionList } from "./ActionsAction";
export interface CallbackAction<T> {
    callback?: ActionList<T>;
    executeCallback?: BooleanResolution;
}
