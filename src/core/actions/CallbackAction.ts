import { StringResolution } from "../resolutions/StringResolution";
import { ActionList } from "./ActionsAction";

export interface CallbackAction<T> {
    callback?: Record<string, ActionList<T>>;
    executeCallback?: StringResolution;
}
