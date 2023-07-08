import { ExecutionStep, execute } from "../../execution/ExecutionStep";
import { convertActionsProperty } from "./actions-convertor";
import { getDefaultConvertors } from "../default-convertors";

describe('actions convertor', () => {
    const log = jest.fn();
    const getSteps = jest.fn().mockReturnValue([]);
    const getRemainingActions = jest.fn().mockReturnValue([]);
    const refreshSteps = jest.fn();
    const stopRefresh = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('convert actions', async () => {
        const results: ExecutionStep[] = [];
        await convertActionsProperty({
                actions: [
                    {
                        log: "log-test",
                    }
                ]
            },
            results,
            {getSteps, getRemainingActions, refreshSteps, stopRefresh},
            { log },
            getDefaultConvertors(),
        );
        execute(results);
        expect(log).toBeCalledWith("log-test");
    });

    it('convert nested actions', async () => {
        const results: ExecutionStep[] = [];
        await convertActionsProperty({
                actions: [
                    {
                        log: "log-test-1",
                    },
                    [
                        {
                            log: "log-test-2",
                        },
                        {
                            log: "log-test-3",
                        }    
                    ],
                ]
            },
            results,
            {getSteps, getRemainingActions, refreshSteps, stopRefresh},
            { log },
            getDefaultConvertors(),
        );
        execute(results);
        expect(log).toBeCalledWith("log-test-1");
        expect(log).toBeCalledWith("log-test-2");
        expect(log).toBeCalledWith("log-test-3");
    });
});
