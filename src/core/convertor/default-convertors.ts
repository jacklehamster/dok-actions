import { convertActionsProperty } from "./actions-convertor";
import { convertConditionProperty } from "./condition-convertor";
import { ActionConvertorList } from "./convert-action";
import { convertDelayProperty, convertLockProperty, convertPauseProperty } from "./convert-pause";
import { convertLogProperty } from "./log-convertor";
import { convertLoopProperty } from "./loop-convertor";
import { convertHooksProperty, convertParametersProperty } from "./parameters-convertor";
import { convertScriptProperty } from "./script-convertor";

export function getDefaultConvertors(): ActionConvertorList {
    return [
        convertHooksProperty,
        convertParametersProperty,
        convertLoopProperty,
        convertConditionProperty,
        convertDelayProperty,
        convertPauseProperty,
        convertLockProperty,
        convertLogProperty,
        convertScriptProperty,
        convertActionsProperty,
    ];
}

export const DEFAULT_CONVERTORS = getDefaultConvertors();
