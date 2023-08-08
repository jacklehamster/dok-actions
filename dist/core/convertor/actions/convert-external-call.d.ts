import { ExternalAction } from "../../actions/ExternalAction";
import { ConvertBehavior, StepScript, Utils } from "../Convertor";
export declare function convertExternalCallProperty<T>(action: ExternalAction, results: StepScript, _: Utils<T & ExternalAction>, external: Record<string, any>): Promise<ConvertBehavior | void>;
