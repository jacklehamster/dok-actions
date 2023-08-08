import { Context, createContext } from "../context/Context";
import { StepScript } from "../convertor/Convertor";
import { execute } from "./ExecutionStep";

describe('ExecutionStep', () => {
    const context: Context = createContext();
    it('execute all steps', () => {
        const steps:StepScript = new StepScript([
            jest.fn(),
            jest.fn(),
        ]);
        execute(steps, {}, context);
        expect(steps.getSteps()[0]).toBeCalledWith({}, context);
        expect(steps.getSteps()[1]).toBeCalledWith({}, context);
    });
    it('execute with parameters', () => {
        const steps:StepScript = new StepScript([
            jest.fn(),
        ]);
        execute(steps, {test: 123, test2: "test2", test3: [1, 2, 3]}, context);
        expect(steps.getSteps()[0]).toBeCalledWith({
            test: 123,
            test2: "test2",
            test3: [1, 2, 3],
        }, context);
    });
});