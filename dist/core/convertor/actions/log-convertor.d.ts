import { LogAction } from "../../actions/LogAction";
import { ConvertBehavior, StepScript, Utils } from "../Convertor";
export declare function convertLogProperty<T>(action: LogAction, results: StepScript, _: Utils<T>, external: Record<string, any>): Promise<ConvertBehavior | void>;
