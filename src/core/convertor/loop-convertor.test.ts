import { ActionsAction } from "../actions/ActionsAction";
import { LogAction } from "../actions/LogAction";
import { SetAction } from "../actions/SetAction";
import { ExecutionStep, execute } from "../execution/ExecutionStep";
import { getDefaultConvertors } from "./default-convertors";
import { convertLoopProperty, convertWhileProperty } from "./loop-convertor";

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
        const results: ExecutionStep[] = [];
        await convertLoopProperty<LogAction>({
                loop: 5,
                log: "~{index}",
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
        const results: ExecutionStep[] = [];
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

    it('converts while loop', async () => {
        const results: ExecutionStep[] = [];
        await convertWhileProperty<ActionsAction<LogAction & SetAction>>({
                whileCondition: "~{index < 5}",
                actions: [
                    {
                        log: "~{index}",
                    },    
                    {
                        set: {
                            variable: "index",
                            value: "~{value + 1}"
                        },
                    },
                ],
            },
            results,
            {getSteps, getRemainingActions, refreshSteps, stopRefresh},
            { log },
            getDefaultConvertors(),
        );
        execute(results, {index: 0});
        expect(log).toBeCalledTimes(5);
        expect(log).toBeCalledWith(0);
        expect(log).toBeCalledWith(1);
        expect(log).toBeCalledWith(2);
        expect(log).toBeCalledWith(3);
        expect(log).toBeCalledWith(4);
    });

});
