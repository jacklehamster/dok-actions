import { ExecutionStep } from "../execution/ExecutionStep";
import { ConvertBehavior, Utils } from "./Convertor";
import { ActionConvertorList } from "./convert-action";
import { RefreshAction } from "../actions/RefreshAction";
export declare function convertRefreshProperty<T>(action: T & RefreshAction, stepResults: ExecutionStep[], utils: Utils<T & RefreshAction>, external: Record<string, any>, actionConversionMap: ActionConvertorList): Promise<ConvertBehavior | void>;
