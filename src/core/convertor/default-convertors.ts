import { ConvertorSet } from "./Convertor";
import { convertActionsProperty } from "./actions/actions-convertor";
import { convertConditionProperty } from "./actions/condition-convertor";
import { convertExternalCallProperty } from "./actions/convert-external-call";
import { convertDelayProperty, convertLockProperty, convertPauseProperty } from "./actions/convert-pause";
import { convertDefaultValuesProperty, convertSetProperty, convertSetsProperty } from "./actions/convert-set";
import { convertHooksProperty } from "./actions/hooks-convertor";
import { convertLogProperty } from "./actions/log-convertor";
import { convertLoopEachProperty, convertLoopProperty } from "./actions/loop-convertor";
import { convertParametersProperty } from "./actions/parameters-convertor";
import { convertRefreshProperty } from "./actions/refresh-convertor";
import { convertScriptProperty } from "./actions/script-convertor";

export function getDefaultConvertors(): ConvertorSet {
    return {
        actionsConvertor: [
            convertHooksProperty,
            convertParametersProperty,
            convertDefaultValuesProperty,
            convertRefreshProperty,
            convertLoopEachProperty,
            convertLoopProperty,
            convertConditionProperty,
            convertDelayProperty,
            convertPauseProperty,
            convertLockProperty,
            convertSetProperty,
            convertSetsProperty,
            convertLogProperty,
            convertExternalCallProperty,
            convertScriptProperty,
            convertActionsProperty,
        ],
    };
}
