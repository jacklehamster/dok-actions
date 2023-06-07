import { ReferenceAction } from "../actions/ReferenceAction";
import { ExecutionStep, execute } from "../execution/ExecutionStep";
import { calculateString } from "../resolutions/calculateString";
import { ConvertBehavior, Utils } from "./Convertor";
import { ActionConvertorList, convertAction } from "./convert-action";
import { DEFAULT_EXTERNALS } from "./default-externals";

async function fetchAction<T>(
        path: string,
        results: ExecutionStep[],
        utils: Utils<T & ReferenceAction>,
        external: Record<string, any> & typeof DEFAULT_EXTERNALS,
        actionConversionMap: ActionConvertorList): Promise<void> {
    const response = await external.fetch(path);
    const json = await response.json();
    await convertAction(json, results, utils, external, actionConversionMap);    
}

export async function convertReferenceProperty<T>(
        action: ReferenceAction,
        results: ExecutionStep[],
        utils: Utils<T & ReferenceAction>,
        external: Record<string, any> & typeof DEFAULT_EXTERNALS,
        actionConversionMap: ActionConvertorList): Promise<ConvertBehavior|void> {
    if (action.reference === undefined) {
        return;
    }

    const { reference, ...subAction } = action;
    if (Object.keys(subAction).length) {
        console.warn("Remaining properties on reference are ignored:", subAction);
    }

    if (typeof(reference) === "string") {
        await fetchAction<T>(reference, results, utils, external, actionConversionMap);
        return ConvertBehavior.SKIP_REMAINING_CONVERTORS;
    } else {
        const postStepResults: ExecutionStep[] = [];
        const remainingActions = utils.getRemainingActions();
        for (let action of remainingActions) {
            convertAction(action, postStepResults, utils, external, actionConversionMap);
        }

        const fetchedResults: ExecutionStep[] = [];
        const path = calculateString(reference);
        results.push((context, parameters) => {
            fetchAction(path.valueOf(context), fetchedResults, utils, external, actionConversionMap)
                .then(() => {
                    execute(fetchedResults, parameters, context);
                    execute(postStepResults, parameters, context);    
                });
        });
        return ConvertBehavior.SKIP_REMAINING_ACTIONS;
    }
}
