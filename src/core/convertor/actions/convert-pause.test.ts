import { execute } from "../../execution/ExecutionStep";
import { ConvertBehavior, StepScript } from "../Convertor";
import { getDefaultConvertors } from "../default-convertors";
import { convertDelayProperty, convertLockProperty, convertPauseProperty } from "./convert-pause";
import { createContext } from "../../context/Context";

describe('pause convertor', () => {
    const mock = jest.fn();
    const getSteps = jest.fn();
    const log = jest.fn();
    const getRemainingActions = jest.fn();
    const refreshSteps = jest.fn();
    const stopRefresh = jest.fn();
    const setTimeout = jest.fn().mockImplementation((fn, _, param1, param2) => pendingTimeouts.push(() => fn(param1, param2)));
    const pendingTimeouts: (() => void)[] = [];

    afterEach(() => {
        jest.resetAllMocks();
        pendingTimeouts.length = 0;
    });

    it('should perform action with delay', async () => {
        getRemainingActions.mockReturnValue([{
            log: "test",
        }]);
        const results: StepScript =  new StepScript();
        const behavior = await convertDelayProperty({
                delay: 123,
            },
            results,
            {getSteps, getRemainingActions, refreshSteps, stopRefresh},
            {mock, setTimeout, log},
            getDefaultConvertors(),
        );
        expect(behavior).toEqual(ConvertBehavior.SKIP_REMAINING_ACTIONS);
        execute(results);
        expect(setTimeout).toBeCalled();
        expect(setTimeout.mock.calls[0][1]).toEqual(123);
        pendingTimeouts.forEach(f => f());
        expect(log).toBeCalledWith("test");
    });

    it('should perform action with pause', async () => {
        const context = createContext();
        getRemainingActions.mockReturnValue([{
            log: "test2",
        }]);
        const results: StepScript = new StepScript();
        const behavior = await convertPauseProperty({
                pause: "~{not completed}",
            },
            results,
            {getSteps, getRemainingActions, refreshSteps, stopRefresh},
            {mock, setTimeout, log},
            getDefaultConvertors(),
        );
        expect(behavior).toEqual(ConvertBehavior.SKIP_REMAINING_ACTIONS);
        execute(results, {completed: false}, context);
        expect(log).not.toBeCalled();
        execute(results, {completed: true}, context);
        expect(log).toBeCalledWith("test2");
    });

    it ('should perform action lock', async () => {
        const context = createContext();
        getRemainingActions.mockReturnValue([{
            log: "test3",
        }]);
        const results: StepScript = new StepScript();
        const behavior = await convertLockProperty({
                lock: "theLock",
            },
            results,
            {getSteps, getRemainingActions, refreshSteps, stopRefresh},
            {mock, setTimeout, log},
            getDefaultConvertors(),
        );
        expect(behavior).toEqual(ConvertBehavior.SKIP_REMAINING_ACTIONS);
        execute(results, {}, context);
        expect(log).not.toBeCalled();
        
        const results2: StepScript = new StepScript();
        convertLockProperty({
                unlock: "theLock",
            },
            results2,
            {getSteps, getRemainingActions, refreshSteps, stopRefresh},
            {mock, setTimeout, log},
            getDefaultConvertors(),
        );
        execute(results2, {}, context);
        expect(log).toBeCalledWith("test3");
    });
});
