import { ExecutionStep, execute } from "../execution/ExecutionStep";
import { getDefaultConvertors } from "./default-convertors";
import { convertRefreshProperty } from "./refresh-convertor";

describe('refresh convertor', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const log = jest.fn();
    const getSteps = jest.fn().mockReturnValue([]);
    const getRemainingActions = jest.fn().mockReturnValue([]);
    const refreshSteps = jest.fn();
    const stopRefresh = jest.fn();
    it('convert refresh', async () => {
        const results: ExecutionStep[] = [];
        await convertRefreshProperty({
                log: "log-test",
                refresh: {
                    processId: "process-123",
                    cleanupAfterRefresh: false,
                    frameRate: 30,
                    stop: false,
                },
            },
            results,
            {getSteps, getRemainingActions, refreshSteps, stopRefresh},
            { log },
            getDefaultConvertors(),
        );
        execute(results);
        expect(refreshSteps).toBeCalled();
        expect(stopRefresh).not.toBeCalled();
    });

    it('convert stop refresh', async () => {
        const results: ExecutionStep[] = [];
        await convertRefreshProperty({
                log: "log-test",
                refresh: {
                    processId: "process-123",
                    stop: true,
                },
            },
            results,
            {getSteps, getRemainingActions, refreshSteps, stopRefresh},
            { log },
            getDefaultConvertors(),
        );
        execute(results);
        expect(refreshSteps).not.toBeCalled();
        expect(stopRefresh).toBeCalledWith("process-123");
    });
});
