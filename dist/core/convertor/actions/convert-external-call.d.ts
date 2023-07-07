import { ExternalAction } from "../../actions/ExternalAction";
import { ExecutionStep } from "../../execution/ExecutionStep";
import { ConvertBehavior, Utils } from "../Convertor";
export declare function convertExternalCallProperty<T>(action: ExternalAction, results: ExecutionStep[], _: Utils<T & ExternalAction>, external: Record<string, any>): Promise<ConvertBehavior | void>;
