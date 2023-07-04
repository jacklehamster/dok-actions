import { HookAction } from "../../actions/HookAction";
import { ExecutionStep } from "../../execution/ExecutionStep";
import { ConvertBehavior, Utils } from "../Convertor";
export declare function convertHooksProperty<T>(action: HookAction & T, results: ExecutionStep[], _: Utils<T & HookAction>, external: Record<string, any>): Promise<ConvertBehavior | void>;
