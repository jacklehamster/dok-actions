import { ExecutionParameters, execute } from "../../execution/ExecutionStep";
import { ConvertBehavior, ConvertorSet, StepScript, Utils } from "../Convertor";
import { calculateNumber } from "../../resolutions/calculateNumber";
import { convertAction } from "./convert-action";
import { LogicAction } from "../../actions/LogicAction";
import { Context } from "../../context/Context";
import { ValueOf } from "../../types/ValueOf";
import { calculateBoolean } from "../../resolutions/calculateBoolean";
import { calculateArray } from "../../resolutions/calculateArray";

const VARIABLE_NAMES = "ijklmnopqrstuvwxyzabcdefgh".split("");

function keepLooping(parameters: ExecutionParameters, context: Context, loops: ValueOf<number>[], steps: StepScript, depth: number = 0, base: number = 0) {
    if (depth >= loops.length) {
        execute(steps, parameters, context);
        return;
    }
    const length = loops[depth].valueOf(parameters);
    const p = parameters;
    const letter = VARIABLE_NAMES[depth];
    const subBase = base * length;
    for (let i = 0; i < length; i++) {
        p[letter] = i;
        p.loopIndex = subBase + i;
        keepLooping(p, context, loops, steps, depth + 1, subBase + i);
    }
}

export async function convertLoopProperty<T>(
        action: T & LogicAction,
        stepResults: StepScript,
        utils: Utils<T & LogicAction>,
        external: Record<string, any>,
        convertorSet: ConvertorSet): Promise<ConvertBehavior | void> {
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
    const subStepResults: StepScript = new StepScript();
    await convertAction<LogicAction>(subAction, subStepResults, utils, external, convertorSet);
    stepResults.add((parameters, context) =>  keepLooping(parameters, context, loopResolution, subStepResults));
    return ConvertBehavior.SKIP_REMAINING_CONVERTORS;
}

export async function convertWhileProperty<T>(
        action: T & LogicAction,
        stepResults: StepScript,
        utils: Utils<T & LogicAction>,
        external: Record<string, any>,
        convertorSet: ConvertorSet): Promise<ConvertBehavior | void> {
    if (action.whileCondition === undefined) {
        return;
    }
    if (!action.whileCondition) {
        return ConvertBehavior.SKIP_REMAINING_CONVERTORS;
    }
    const { whileCondition, ...subAction } = action;
    const whileResolution = calculateBoolean(whileCondition);
    const subStepResults: StepScript = new StepScript();
    await convertAction<LogicAction>(subAction, subStepResults, utils, external, convertorSet);
    stepResults.add((parameters, context) =>  {
        while(whileResolution.valueOf(parameters)) {
            execute(subStepResults, parameters, context);
        }
    });
    return ConvertBehavior.SKIP_REMAINING_CONVERTORS;
}

export async function convertLoopEachProperty<T>(
        action: T & LogicAction,
        stepResults: StepScript,
        utils: Utils<T & LogicAction>,
        external: Record<string, any>,
        convertorSet: ConvertorSet): Promise<ConvertBehavior | void> {
    if (action.loopEach === undefined) {
        return;
    }
    const { loopEach, ...subAction } = action;
    const loopEachResolution = calculateArray(loopEach);
    const subStepResults: StepScript = new StepScript();
    await convertAction<LogicAction>(subAction, subStepResults, utils, external, convertorSet);
    stepResults.add((parameters, context) =>  {
        const array = loopEachResolution?.valueOf(parameters);
        if (array) {
            for (let i = 0; i < array.length; i++) {
                parameters.loopIndex = i;
                parameters.element = array[i];
                execute(subStepResults, parameters, context);
            }
        }
    });
    return ConvertBehavior.SKIP_REMAINING_CONVERTORS;
}