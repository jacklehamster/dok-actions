import { ActionsAction } from "../../actions/ActionsAction";
import { LogAction } from "../../actions/LogAction";
import { SetAction } from "../../actions/SetAction";
import { execute } from "../../execution/ExecutionStep";
import { StepScript } from "../Convertor";
import { getDefaultConvertors } from "../default-convertors";
import { convertLoopEachProperty, convertLoopProperty, convertWhileProperty } from "./loop-convertor";

describe('loop convertor', () => {
    const log = jest.fn();
    const getSteps = jest.fn().mockReturnValue([]);
    const getRemainingActions = jest.fn().mockReturnValue([]);
    const refreshSteps = jest.fn();
    const stopRefresh = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('convert loop', async () => {
        const results: StepScript = new StepScript();
        await convertLoopProperty<LogAction>({
                loop: 5,
                log: "~{loopIndex}",
            },
            results,
            {getSteps, getRemainingActions, refreshSteps, stopRefresh},
            { log },
            getDefaultConvertors(),
        );
        execute(results);
        expect(log).toBeCalledTimes(5);
        expect(log).toBeCalledWith(0);
        expect(log).toBeCalledWith(4);
    });

    it('converts doubly loop', async () => {
        const results: StepScript = new StepScript();
        await convertLoopProperty<LogAction>({
                loop: [2, 3],
                log: "~{i * 100 + j}",
            },
            results,
            {getSteps, getRemainingActions, refreshSteps, stopRefresh},
            { log },
            getDefaultConvertors(),
        );
        execute(results);
        expect(log).toBeCalledTimes(6);
        expect(log).toBeCalledWith(0);
        expect(log).toBeCalledWith(100);
        expect(log).toBeCalledWith(1);
        expect(log).toBeCalledWith(101);
        expect(log).toBeCalledWith(2);
        expect(log).toBeCalledWith(102);
    });

    it('converts doubly loop', async () => {
        const results: StepScript = new StepScript();
        await convertLoopProperty<LogAction>({
                loop: [2, 3],
                log: "~{loopIndex}",
            },
            results,
            {getSteps, getRemainingActions, refreshSteps, stopRefresh},
            { log },
            getDefaultConvertors(),
        );
        execute(results);
        expect(log).toBeCalledTimes(6);
        expect(log).toBeCalledWith(0);
        expect(log).toBeCalledWith(1);
        expect(log).toBeCalledWith(2);
        expect(log).toBeCalledWith(3);
        expect(log).toBeCalledWith(4);
        expect(log).toBeCalledWith(5);
    });

    it('converts while loop', async () => {
        const results: StepScript = new StepScript();
        await convertWhileProperty<ActionsAction<LogAction & SetAction>>({
                whileCondition: "~{loopIndex < 5}",
                actions: [
                    {
                        log: "~{loopIndex}",
                    },    
                    {
                        sets: {
                            loopIndex: "~{value + 1}"
                        },
                    },
                ],
            },
            results,
            {getSteps, getRemainingActions, refreshSteps, stopRefresh},
            { log },
            getDefaultConvertors(),
        );
        execute(results, {loopIndex: 0});
        expect(log).toBeCalledTimes(5);
        expect(log).toBeCalledWith(0);
        expect(log).toBeCalledWith(1);
        expect(log).toBeCalledWith(2);
        expect(log).toBeCalledWith(3);
        expect(log).toBeCalledWith(4);
    });

    it('converts loopEach', async () => {
        const results: StepScript = new StepScript();
        await convertLoopEachProperty<ActionsAction<LogAction>>({
                loopEach: [
                    { a: 123 },
                    { a: 456 },
                    { a: 789 },
                ],
                actions: [
                    {
                        log: "~{element}",
                    },    
                ],
            },
            results,
            {getSteps, getRemainingActions, refreshSteps, stopRefresh},
            { log },
            getDefaultConvertors(),
        );
        execute(results);
        expect(log).toBeCalledWith({ a: 123 });
        expect(log).toBeCalledWith({ a: 456 });
        expect(log).toBeCalledWith({ a: 789 });
    });

    it('converts nested loopEach', async () => {
        const results: StepScript = new StepScript();
        await convertLoopEachProperty<ActionsAction<LogAction>>({
                loopEach: [
                    [{ a: 123 },{ a: 456 }],
                    [{ a: 789 }]
                ],
                actions: [
                    {
                        loopEach: "~{element}",
                        actions: [
                            {
                                log: "~{element}",
                            }
                        ],
                    },    
                ],
            },
            results,
            {getSteps, getRemainingActions, refreshSteps, stopRefresh},
            { log },
            getDefaultConvertors(),
        );
        execute(results);
        expect(log).toBeCalledWith({ a: 123 });
        expect(log).toBeCalledWith({ a: 456 });
        expect(log).toBeCalledWith({ a: 789 });
    });
});
