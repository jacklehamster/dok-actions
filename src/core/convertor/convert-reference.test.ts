import { LogAction } from "../actions/LogAction";
import { ExecutionStep, execute } from "../execution/ExecutionStep";
import { convertReferenceProperty } from "./convert-reference";
import { getDefaultConvertors } from "./default-convertors";

describe('reference convertor', () => {
    const log = jest.fn();
    const getSteps = jest.fn().mockReturnValue([]);
    const getRemainingActions = jest.fn().mockReturnValue([]);
    const fetchResult = jest.fn().mockReturnValue({});
    const fetch = jest.fn();

    beforeAll(() => {
        fetch.mockImplementation(() =>
            Promise.resolve({
                json: () => Promise.resolve(fetchResult()),
            })
        );
    });
    
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('convert reference', async () => {
        const mockAction: LogAction = { log: "log-test" };
        fetchResult.mockReturnValue(mockAction);

        const results: ExecutionStep[] = [];
        await convertReferenceProperty({
                reference: "/some-action.json",
            },
            results,
            {getSteps, getRemainingActions},
            { log, fetch },
            getDefaultConvertors(),
        );
        execute(results);
        expect(log).toBeCalledWith("log-test");
    });
});
