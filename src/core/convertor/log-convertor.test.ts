import { ExecutionStep, execute } from "../execution/ExecutionStep";
import { getDefaultConvertors } from "./default-convertors";
import { convertLogProperty } from "./log-convertor";

describe('log convertor', () => {
    const log = jest.fn();
    const getSteps = jest.fn().mockReturnValue([]);
    const getRemainingActions = jest.fn().mockReturnValue([]);
    it('convert log', () => {
        const results: ExecutionStep[] = [];
        convertLogProperty({
                log: "log-test",
            },
            results,
            {getSteps, getRemainingActions},
            { log },
            getDefaultConvertors(),
        );
        execute(results);
        expect(log).toBeCalledWith("log-test");
    });
});
