import { ExecutionParameters, ExecutionStep, execute } from "../execution/ExecutionStep";
import { ConvertBehavior, Utils } from "./Convertor";
import { calculateNumber } from "../resolutions/calculateNumber";
import { ActionConvertorList, convertAction } from "./convert-action";
import { LogicAction } from "../actions/LogicAction";
import { Context } from "../context/Context";
import { ValueOf } from "../types/ValueOf";
import { calculateBoolean } from "../resolutions/calculateBoolean";
import { calculateArray } from "../resolutions/calculateArray";

const VARIABLE_NAMES = "ijklmnopqrstuvwxyzabcdefgh".split("");

function keepLooping(parameters: ExecutionParameters, context: Context, loops: ValueOf<number>[], steps: ExecutionStep[], depth: number = 0) {
    if (depth >= loops.length) {
        execute(steps, parameters, context);
        return;
    }
    const length = loops[depth].valueOf(parameters);
    const p = parameters;
    const letter = VARIABLE_NAMES[depth];
    for (let i = 0; i < length; i++) {
        p.index = p[letter] = i;
        keepLooping(p, context, loops, steps, depth + 1);
    }
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

export async function convertWhileProperty<T>(
        action: T & LogicAction,
        stepResults: ExecutionStep[],
        utils: Utils<T & LogicAction>,
        external: Record<string, any>,
        actionConversionMap: ActionConvertorList): Promise<ConvertBehavior | void> {
    if (action.whileCondition === undefined) {
        return;
    }
    if (!action.whileCondition) {
        return ConvertBehavior.SKIP_REMAINING_CONVERTORS;
    }
    const { whileCondition, ...subAction } = action;
    const whileResolution = calculateBoolean(whileCondition);
    const subStepResults: ExecutionStep[] = [];
    await convertAction<LogicAction>(subAction, subStepResults, utils, external, actionConversionMap);
    stepResults.push((parameters, context) =>  {
        while(whileResolution.valueOf(parameters)) {
            execute(subStepResults, parameters, context);
        }
    });
    return ConvertBehavior.SKIP_REMAINING_CONVERTORS;
}

export async function convertLoopEachProperty<T>(
        action: T & LogicAction,
        stepResults: ExecutionStep[],
        utils: Utils<T & LogicAction>,
        external: Record<string, any>,
        actionConversionMap: ActionConvertorList): Promise<ConvertBehavior | void> {
    if (action.loopEach === undefined) {
        return;
    }
    const { loopEach, ...subAction } = action;
    const loopEachResolution = calculateArray(loopEach);
    const subStepResults: ExecutionStep[] = [];
    await convertAction<LogicAction>(subAction, subStepResults, utils, external, actionConversionMap);
    stepResults.push((parameters, context) =>  {
        const array = loopEachResolution?.valueOf(parameters);
        if (array) {
            for (let i = 0; i < array.length; i++) {
                parameters.index = i;
                parameters.element = array[i];
                execute(subStepResults, parameters, context);
            }
        }
    });
    return ConvertBehavior.SKIP_REMAINING_CONVERTORS;
}