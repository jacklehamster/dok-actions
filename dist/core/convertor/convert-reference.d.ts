import { ReferenceAction } from "../actions/ReferenceAction";
import { ExecutionStep } from "../execution/ExecutionStep";
import { ConvertBehavior, Utils } from "./Convertor";
import { ActionConvertorList } from "./convert-action";
export declare function convertReferenceProperty<T>(action: ReferenceAction, results: ExecutionStep[], utils: Utils<T & ReferenceAction>, external: Record<string, any>, actionConversionMap: ActionConvertorList): Promise<ConvertBehavior | void>;
