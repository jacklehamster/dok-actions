import { execute } from "../../execution/ExecutionStep";
import { StepScript } from "../Convertor";
import { convertLogProperty } from "./log-convertor";

describe('log convertor', () => {
    const log = jest.fn();
    const getSteps = jest.fn().mockReturnValue([]);
    const getRemainingActions = jest.fn().mockReturnValue([]);
    const refreshSteps = jest.fn();
    const stopRefresh = jest.fn();
    it('convert log', async () => {
        const results: StepScript = new StepScript();
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
