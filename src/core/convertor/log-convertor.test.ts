import { ExecutionStep, execute } from "../execution/ExecutionStep";
import { convertLogProperty } from "./log-convertor";

describe('log convertor', () => {
    const log = jest.fn();
    const getSteps = jest.fn().mockReturnValue([]);
    const getRemainingActions = jest.fn().mockReturnValue([]);
    const refreshSteps = jest.fn();
    const stopRefresh = jest.fn();
    it('convert log', async () => {
        const results: ExecutionStep[] = [];
        await convertLogProperty({
                log: "log-test",
            },
            results,
            {getSteps, getRemainingActions, refreshSteps, stopRefresh},
            { log },
        );
        execute(results);
        expect(log).toBeCalledWith("log-test");
    });
});
