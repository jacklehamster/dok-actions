import { convertActionsProperty } from "./actions-convertor";
import { convertConditionProperty } from "./condition-convertor";
import { ActionConvertorList } from "./convert-action";
import { convertDelayProperty, convertLockProperty, convertPauseProperty } from "./convert-pause";
import { convertSetProperty, convertSetsProperty } from "./convert-set";
import { convertLogProperty } from "./log-convertor";
import { convertLoopProperty } from "./loop-convertor";
import { convertHooksProperty, convertParametersProperty } from "./parameters-convertor";
import { convertRefreshProperty } from "./refresh-convertor";
import { convertScriptProperty } from "./script-convertor";

export function getDefaultConvertors(): ActionConvertorList {
    return [
        convertHooksProperty,
        convertParametersProperty,
        convertRefreshProperty,
        convertLoopProperty,
        convertConditionProperty,
        convertDelayProperty,
        convertPauseProperty,
        convertLockProperty,
        convertSetProperty,
        convertSetsProperty,
        convertLogProperty,
        convertScriptProperty,
        convertActionsProperty,
    ];
}
