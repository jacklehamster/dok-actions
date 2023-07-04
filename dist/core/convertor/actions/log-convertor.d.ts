import { LogAction } from "../../actions/LogAction";
import { ExecutionStep } from "../../execution/ExecutionStep";
import { ConvertBehavior, Utils } from "../Convertor";
export declare function convertLogProperty<T>(action: LogAction, results: ExecutionStep[], _: Utils<T>, external: Record<string, any>): Promise<ConvertBehavior | void>;
