import { HookAction } from "../../actions/HookAction";
import { ConvertBehavior, StepScript, Utils } from "../Convertor";
export declare function convertHooksProperty<T>(action: HookAction & T, results: StepScript, _: Utils<T & HookAction>, external: Record<string, any>): Promise<ConvertBehavior | void>;
