import { convertActionsProperty } from "./actions-convertor";
import { convertConditionProperty } from "./condition-convertor";
import { ActionConvertorList } from "./convert-action";
import { convertDelayProperty, convertLockProperty, convertPauseProperty } from "./convert-pause";
import { convertDefaultValuesProperty, convertSetProperty, convertSetsProperty } from "./convert-set";
import { convertHooksProperty } from "./hooks-convertor";
import { convertLogProperty } from "./log-convertor";
import { convertLoopProperty } from "./loop-convertor";
import { convertParametersProperty } from "./parameters-convertor";
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
        convertDefaultValuesProperty,
        convertSetProperty,
        convertSetsProperty,
        convertLogProperty,
        convertScriptProperty,
        convertActionsProperty,
    ];
}
