import { ConvertBehavior, ConvertorSet, StepScript, Utils } from "../Convertor";
import { RefreshAction } from "../../actions/RefreshAction";
export declare const DEFAULT_REFRESH_FRAME_RATE = 1;
export declare function convertRefreshProperty<T>(action: T & RefreshAction, stepResults: StepScript, utils: Utils<T & RefreshAction>, external: Record<string, any>, convertorSet: ConvertorSet): Promise<ConvertBehavior | void>;
