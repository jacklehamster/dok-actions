import { LogAction } from "../actions/LogAction";
import { ExecutionStep } from "../execution/ExecutionStep";
import { Utils } from "./Convertor";
import { ActionConvertorList } from "./convert-action";
export declare function convertLogProperty<T>(action: LogAction, results: ExecutionStep[], _: Utils<T>, external: Record<string, any>, __: ActionConvertorList): void;
