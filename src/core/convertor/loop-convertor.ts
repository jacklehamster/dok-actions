import { ExecutionParameters, ExecutionStep, execute } from "../execution/ExecutionStep";
import { ConvertBehavior, Utils } from "./Convertor";
import { calculateNumber } from "../resolutions/calculateNumber";
import { ActionConvertorList, convertAction } from "./convert-action";
import { LogicAction } from "../actions/LogicAction";
import { Context } from "../context/Context";
import { ValueOf } from "../types/ValueOf";
import { newParams, recycleParams } from "./parameter-utils";

function keepLooping(parameters: ExecutionParameters, context: Context, loops: ValueOf<number>[], steps: ExecutionStep[], depth: number = 0) {
    if (depth >= loops.length) {
        console.log(parameters);
        execute(steps, parameters, context);
        return;
    }
    const length = loops[depth].valueOf(parameters);
    const p = newParams(parameters, context);
    const letter = String.fromCharCode('i'.charCodeAt(0) + depth);
    for (let i = 0; i < length; i++) {
        p.index = p[letter] = i;
        keepLooping(p, context, loops, steps, depth + 1);
    }
    recycleParams(p, context);
}

export async function convertLoopProperty<T>(
        action: T & LogicAction,
        stepResults: ExecutionStep[],
        utils: Utils<T & LogicAction>,
        external: Record<string, any>,
        actionConversionMap: ActionConvertorList): Promise<ConvertBehavior | void> {
    if (action.loop === undefined) {
        return;
    }
    if (!action.loop) {
        return ConvertBehavior.SKIP_REMAINING_CONVERTORS;
    }
    const { loop, ...subAction } = action;
    const loops = Array.isArray(loop) ? loop: [loop];
    if (!loops.length) {
        return ConvertBehavior.SKIP_REMAINING_CONVERTORS;
    }
    const loopResolution = loops.map(loop => calculateNumber(loop, 0));
    const subStepResults: ExecutionStep[] = [];
    await convertAction<LogicAction>(subAction, subStepResults, utils, external, actionConversionMap);
    stepResults.push((parameters, context) =>  keepLooping(parameters, context, loopResolution, subStepResults));
    return ConvertBehavior.SKIP_REMAINING_CONVERTORS;
}
