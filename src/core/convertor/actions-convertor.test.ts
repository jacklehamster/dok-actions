import { ExecutionStep, execute } from "../execution/ExecutionStep";
import { convertActionsProperty } from "./actions-convertor";
import { getDefaultConvertors } from "./default-convertors";

describe('actions convertor', () => {
    const log = jest.fn();
    const getSteps = jest.fn().mockReturnValue([]);
    const getRemainingActions = jest.fn().mockReturnValue([]);
    const refreshSteps = jest.fn();
    const stopRefresh = jest.fn();
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
});
