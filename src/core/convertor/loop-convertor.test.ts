import { LogAction } from "../actions/LogAction";
import { ExecutionStep, execute } from "../execution/ExecutionStep";
import { getDefaultConvertors } from "./default-convertors";
import { convertLoopProperty } from "./loop-convertor";

describe('loop convertor', () => {
    const log = jest.fn();
    const getSteps = jest.fn().mockReturnValue([]);
    const getRemainingActions = jest.fn().mockReturnValue([]);
    const refreshSteps = jest.fn();
    const stopRefresh = jest.fn();
    it('convert loop', async () => {
        const results: ExecutionStep[] = [];
        await convertLoopProperty<LogAction>({
                loop: 5,
                log: "{index}",
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
});
