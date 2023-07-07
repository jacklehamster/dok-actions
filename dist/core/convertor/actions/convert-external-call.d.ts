import { ExternalAction } from "../../actions/ExternalAction";
import { ExecutionStep } from "../../execution/ExecutionStep";
import { ConvertBehavior } from "../Convertor";
export declare function convertExternalCallProperty(action: ExternalAction, results: ExecutionStep[]): Promise<ConvertBehavior | void>;
