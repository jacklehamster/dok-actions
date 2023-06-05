import { ExecutionStep, execute } from "../execution/ExecutionStep";
import { convertActionsProperty } from "./actions-convertor";
import { getDefaultConvertors } from "./default-convertors";

describe('actions convertor', () => {
    const log = jest.fn();
    const getSteps = jest.fn().mockReturnValue([]);
    const getRemainingActions = jest.fn().mockReturnValue([]);
    it('convert actions', () => {
        const results: ExecutionStep[] = [];
        convertActionsProperty({
                actions: [
                    {
                        log: "log-test",
                    }
                ]
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
