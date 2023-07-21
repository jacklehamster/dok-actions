import { StringResolution } from "../resolutions/StringResolution";
import { ActionWithParameters } from "./ActionWithParameters";
import { ActionList } from "./ActionsAction";
export interface CallbackAction<T> extends ActionWithParameters {
    callback?: Record<string, ActionList<T>>;
    executeCallback?: StringResolution;
}
